import { PrismaClient } from "@prisma/client";

const start = async (queryCount: number) => {
	const prisma = new PrismaClient();

	const promises = [];

	await prisma.$connect();

	const users = await prisma.users.findMany({
		select: { id: true },
	});

	function getRandomInt(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	const start = performance.now();

	for (let i = 0; i < queryCount; i++) {
		const randomUserId = users[getRandomInt(1, users.length - 1)]?.id as string;

		promises.push(
			prisma.users.findFirst({
				select: { email: true },
				where: { id: randomUserId },
			}),
		);
	}

	await Promise.all(promises);

	const execTime = Math.round(performance.now() - start);

	await prisma.$disconnect();

	return execTime;
};

process.on("message", async (message: { queryCount: number; }) => {
	const { queryCount } = message;
	const execTime = await start(queryCount);

	if (process.send) process.send(execTime);
});
