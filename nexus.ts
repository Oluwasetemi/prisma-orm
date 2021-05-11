import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server';
import { makeSchema, objectType } from 'nexus';

const prisma = new PrismaClient();

const Query = objectType({
	name: 'Query',
	definition(t) {
		t.string('hello', {
			resolve: () => 'hello chat!',
		});
		t.list.field('users', {
			type: 'User',
			resolve: async () => {
				const users = await prisma.user.findMany();

				return users;
			},
		});
		t.list.field('posts', {
			type: 'Post',
			resolve: async () => {
				const posts = await prisma.post.findMany();

				return posts;
			},
		});
	},
});

const User = objectType({
	name: 'User',
	definition(t) {
		t.int('id');
		t.string('email');
		t.string('name');
	},
});

const Post = objectType({
	name: 'Post',
	definition(t) {
		t.int('id');
		t.string('title');
		t.string('content');
		t.boolean('published');
		t.string('author');
		t.int('authorId');
	},
});

const schema = makeSchema({
	types: [Query, User, Post],
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
});

server.listen().then(async ({ url }) => {
	console.log(`\
🚀 Server ready at: ${url}
  `);
});
