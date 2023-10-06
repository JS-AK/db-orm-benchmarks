import { PrismaClient } from "@prisma/client";

export const benchPrisma = async (queryCount: number) => {
	const prisma = new PrismaClient();

	const promises = [];

	const users = await prisma.users.findMany({
		select: { id: true },
		take: queryCount,
	});

	function getRandomInt(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	for (let i = 0; i < queryCount; i++) {
		promises.push(
			prisma.users.findFirst({
				select: { email: true },
				where: { id: users[getRandomInt(0, users.length - 1)]?.id as string },
			}),
		);
	}

	{
		const start = Date.now();

		await Promise.all(promises);
		const execTime = Math.round(Date.now() - start);

		console.log(`Prisma execTime: ${execTime}ms`);
	}
};
