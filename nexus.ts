import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server';
import { DateTimeResolver } from 'graphql-scalars';
import {
	arg,
	asNexusMethod,
	enumType,
	inputObjectType,
	intArg,
	makeSchema,
	nonNull,
	objectType,
	stringArg
} from 'nexus';

const DateTime = asNexusMethod(DateTimeResolver, 'date');

const prisma = new PrismaClient();

interface Context {
	prisma: PrismaClient;
}

const context: Context = {
	prisma,
};

const Query = objectType({
	name: 'Query',
	definition(t) {
		t.nonNull.list.nonNull.field('allUsers', {
			type: 'User',
			resolve: (_parent, _args, context: Context) =>
				context.prisma.user.findMany(),
		});

		t.nullable.field('postById', {
			type: 'Post',
			args: {
				id: intArg(),
			},
			resolve: (_parent, args, context: Context) =>
				context.prisma.post.findUnique({
					where: { id: args.id || undefined },
				}),
		});

		t.nonNull.list.nonNull.field('feed', {
			type: 'Post',
			args: {
				searchString: stringArg(),
				skip: intArg(),
				take: intArg(),
				orderBy: arg({
					type: 'PostOrderByUpdatedAtInput',
				}),
			},
			resolve: (_parent, args, context: Context) => {
				const or = args.searchString
					? {
							OR: [
								{ title: { contains: args.searchString } },
								{ content: { contains: args.searchString } },
							],
					  }
					: {};

				return context.prisma.post.findMany({
					where: {
						published: true,
						...or,
					},
					take: args.take || undefined,
					skip: args.skip || undefined,
					orderBy: args.orderBy || undefined,
				});
			},
		});

		t.list.field('draftsByUser', {
			type: 'Post',
			args: {
				userUniqueInput: nonNull(
					arg({
						type: 'UserUniqueInput',
					}),
				),
			},
			resolve: (_parent, args, context: Context) =>
				context.prisma.user
					.findUnique({
						where: {
							id: args.userUniqueInput.id || undefined,
							email: args.userUniqueInput.email || undefined,
						},
					})
					.posts({
						where: {
							published: false,
						},
					}),
		});
	},
});

const Mutation = objectType({
	name: 'Mutation',
	definition(t) {
		t.nonNull.field('signupUser', {
			type: 'User',
			args: {
				data: nonNull(
					arg({
						type: 'UserCreateInput',
					}),
				),
			},
			resolve: (_, args, context: Context) => {
				const postData = args.data.posts?.map(
					(post: { title: any; content: any }) => ({
						title: post.title,
						content: post.content || undefined,
					}),
				);
				return context.prisma.user.create({
					data: {
						name: args.data.name,
						email: args.data.email,
						posts: {
							create: postData,
						},
					},
				});
			},
		});

		t.field('togglePublishPost', {
			type: 'Post',
			args: {
				id: nonNull(intArg()),
			},
			resolve: async (_, args, context: Context) => {
				try {
					const post = await context.prisma.post.findUnique({
						where: { id: args.id || undefined },
						select: {
							published: true,
						},
					});
					return context.prisma.post.update({
						where: { id: args.id || undefined },
						data: { published: !post?.published },
					});
				} catch (e) {
					throw new Error(
						`Post with ID ${args.id} does not exist in the database.`,
					);
				}
			},
		});

		t.field('incrementPostViewCount', {
			type: 'Post',
			args: {
				id: nonNull(intArg()),
			},
			resolve: (_, args, context: Context) =>
				context.prisma.post.update({
					where: { id: args.id || undefined },
					data: {
						viewCount: {
							increment: 1,
						},
					},
				}),
		});

		t.field('deletePost', {
			type: 'Post',
			args: {
				id: nonNull(intArg()),
			},
			resolve: (_, args, context: Context) =>
				context.prisma.post.delete({
					where: { id: args.id },
				}),
		});
	},
});

const User = objectType({
	name: 'User',
	description: 'All users',
	definition(t) {
		t.nonNull.int('id');
		t.string('email');
		t.nonNull.string('name');
		t.nonNull.list.nonNull.field('post', {
			type: 'Post',
			resolve: (parent, _, context: Context) =>
				context.prisma.user
					.findUnique({ where: { id: parent.id || undefined } })
					.posts(),
		});
	},
});

const Post = objectType({
	name: 'Post',
	description: 'All posts',
	definition(t) {
		t.nonNull.int('id');
		t.nonNull.field('createdAt', {
			type: 'DateTime',
			description: 'the date the post was created',
		});
		t.nonNull.field('updatedAt', {
			type: 'DateTime',
			description: 'the date the post was created',
		});
		t.nonNull.string('title');
		t.string('content');
		t.nonNull.boolean('published');
		t.field('author', {
			type: 'User',
			resolve: (parent, _, context: Context) =>
				context.prisma.post
					.findUnique({ where: { id: parent.id || undefined } })
					.author(),
		});
		t.nonNull.int('authorId');
	},
});

const SortOrder = enumType({
	name: 'SortOrder',
	members: ['asc', 'desc'],
});

const PostOrderByUpdatedAtInput = inputObjectType({
	name: 'PostOrderByUpdatedAtInput',
	definition(t) {
		t.nonNull.field('updatedAt', { type: 'SortOrder' });
	},
});

const UserUniqueInput = inputObjectType({
	name: 'UserUniqueInput',
	definition(t) {
		t.int('id');
		t.string('email');
	},
});

const PostCreateInput = inputObjectType({
	name: 'PostCreateInput',
	definition(t) {
		t.nonNull.string('title');
		t.string('content');
	},
});

const UserCreateInput = inputObjectType({
	name: 'UserCreateInput',
	definition(t) {
		t.nonNull.string('email');
		t.string('name');
		t.list.nonNull.field('posts', { type: 'PostCreateInput' });
	},
});

const schema = makeSchema({
	types: [
		Query,
		Mutation,
		User,
		Post,
		UserUniqueInput,
		UserCreateInput,
		PostCreateInput,
		SortOrder,
		PostOrderByUpdatedAtInput,
		DateTime,
	],
	outputs: {
		schema: `${__dirname}/schema.graphql`,
		typegen: `${__dirname}/generated/nexus.ts`,
	},
	sourceTypes: {
		modules: [
			{
				module: '@prisma/client',
				alias: 'prisma',
			},
		],
	},
});

const server = new ApolloServer({
	schema,
	context,
});

server.listen().then(async ({ url }) => {
	console.log(`\
🚀 Server ready at: ${url}
  `);
});
