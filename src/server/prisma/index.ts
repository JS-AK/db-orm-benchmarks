import { PrismaClient } from "@prisma/client";

export const benchPrisma = async (queryCount: number) => {
	const prisma = new PrismaClient();

	const promises = [];

	const users = await prisma.users.findMany({
		select: { id: true },
	});

	function getRandomInt(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	for (let i = 0; i < queryCount; i++) {
		const randomUserId = users[getRandomInt(0, users.length - 1)]?.id as string;

		promises.push(
			prisma.users.findFirst({
				select: { email: true },
				where: { id: randomUserId },
			}),
		);
	}

	const start = performance.now();

	await Promise.all(promises);
	const execTime = Math.round(performance.now() - start);

	await prisma.$disconnect();

	return execTime;
};
