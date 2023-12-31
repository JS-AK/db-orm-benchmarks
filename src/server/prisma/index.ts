import { PrismaClient } from "@prisma/client";

export const bench = async (queryCount: number) => {
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

export const benchOneByOne = async (queryCount: number) => {
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

	for (const promise of promises) await promise;

	const execTime = Math.round(performance.now() - start);

	await prisma.$disconnect();

	return execTime;
};
