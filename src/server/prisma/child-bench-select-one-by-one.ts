import { PrismaClient } from "@prisma/client";

const start = async (queryCount: number) => {
	const prisma = new PrismaClient();

	await prisma.$connect();

	const users = await prisma.user.findMany({
		select: { id: true },
	});

	function getRandomInt(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	const promises = [];

	const start = performance.now();

	for (let i = 0; i < queryCount; i++) {
		const randomUserId = users[getRandomInt(1, users.length - 1)]?.id as string;

		promises.push(
			() => prisma.user.findFirst({
				select: { email: true },
				where: { id: randomUserId },
			}),
		);
	}

	for (const promise of promises) await promise();

	const execTime = Math.round(performance.now() - start);

	await prisma.$disconnect();

	return execTime;
};

process.on("message", async (message: { queryCount: number; }) => {
	const { queryCount } = message;
	const execTime = await start(queryCount);

	if (process.send) process.send(execTime);
});
