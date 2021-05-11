import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const profile = await prisma.profile
		.create({
			data: {
				bio: 'Hello World',
				user: {
					connect: { email: 'setemi@mailinator.co' },
				},
			},
		})
		.catch(err => console.log(err.message));

	// const user = await prisma.user.create({
	// 	data: {
	// 		email: 'john@prisma.io',
	// 		name: 'John',
	// 		profile: {
	// 			create: {
	// 				bio: 'Hello World',
	// 			},
	// 		},
	// 	},
	// });
	console.dir(profile, { depth: Infinity });
	process.exit(0);
}

main();
