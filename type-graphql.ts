/* eslint-disable */
// prettier-ignore
import 'reflect-metadata';
import { resolvers } from '@generated/type-graphql';
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server';
import * as tq from 'type-graphql';

const prisma = new PrismaClient();

const app = async () => {
	const schema = await tq.buildSchema({ resolvers, emitSchemaFile: true });
	const server = new ApolloServer({
		schema,
		context: { prisma },
	});

	server.listen().then(async ({ url }) => {
		console.log(`🚀 Server ready at: ${url}`);
	});
};

app();
