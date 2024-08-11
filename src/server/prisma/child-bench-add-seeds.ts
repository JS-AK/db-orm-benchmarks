import { PrismaClient } from "@prisma/client";

import {
	generateRandomEmail,
	getRandomFirstName,
	getRandomLastName,
	getUserRoleId,
} from "../helpers/index.js";

const start = async (queryCount: number): Promise<number> => {
	const prisma = new PrismaClient();

	const promises = [];

	await prisma.$connect();

	const userRoles = (await prisma.userRole.findMany({
		select: { id: true },
	})).map((e) => e.id);

	const start = performance.now();

	for (let idx = 0; idx < queryCount; idx++) {
		const randomEmail = generateRandomEmail();
		const randomFirstName = getRandomFirstName();
		const randomLastName = getRandomLastName();

		promises.push(
			prisma.user.create({
				data: {
					is_deleted: false,
					id_user_role: getUserRoleId(userRoles),
					email: randomEmail,
					first_name: randomFirstName,
					last_name: randomLastName,
				},
			}),
		);
	}
	const users = await Promise.all(promises);

	const execTime = Math.round(performance.now() - start);

	const userIds = users.map((e) => e?.id);

	await prisma.$executeRawUnsafe(`DELETE FROM users WHERE id IN (${userIds.map((e) => `'${e}'`).join(",")})`);

	await prisma.$disconnect();

	return execTime;
};

process.on("message", async (message: { queryCount: number; }) => {
	const { queryCount } = message;
	const execTime = await start(queryCount);

	if (process.send) process.send(execTime);
});
