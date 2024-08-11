import { Prisma, PrismaClient } from "@prisma/client";

import {
	generateRandomEmail,
	getRandomFirstName,
	getRandomLastName,
	getUserRoleId,
} from "../helpers/index.js";

const start = async (queryCount: number): Promise<number> => {
	const prisma = new PrismaClient();

	await prisma.$connect();

	const userRoles = (await prisma.userRole.findMany({
		select: { id: true },
	})).map((e) => e.id);

	const userIds: string[] = [];

	const start = performance.now();

	await prisma.$transaction(
		async (tx) => {
			for (let idx = 0; idx < queryCount; idx++) {
				const randomEmail = generateRandomEmail();
				const randomFirstName = getRandomFirstName();
				const randomLastName = getRandomLastName();

				const entity = await tx.user.create({
					data: {
						is_deleted: false,
						id_user_role: getUserRoleId(userRoles),
						email: randomEmail,
						first_name: randomFirstName,
						last_name: randomLastName,
					},
				});

				if (entity) userIds.push(entity.id);
			}
		},
		{
			maxWait: 5000, // default: 2000
			timeout: 2 * 60 * 1000, // default: 5000
			isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
		},
	);

	const execTime = Math.round(performance.now() - start);

	await prisma.$executeRawUnsafe(`DELETE FROM users WHERE id IN (${userIds.map((e) => `'${e}'`).join(",")})`);

	await prisma.$disconnect();

	return execTime;
};

process.on("message", async (message: { queryCount: number; }) => {
	const { queryCount } = message;
	const execTime = await start(queryCount);

	if (process.send) process.send(execTime);
});
