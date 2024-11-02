import { PrismaClient } from "@prisma/client";

const start = async (queryCount: number) => {
	const prisma = new PrismaClient();

	const promises = [];

	await prisma.$connect();

	const users = await prisma.user.findMany({
		select: { id: true },
	});

	function getRandomInt(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

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

	await Promise.all(promises.map((e) => e()));

	const execTime = Math.round(performance.now() - start);

	await prisma.$disconnect();

	return execTime;
};

process.on("message", async (message: { queryCount: number; }) => {
	const { queryCount } = message;
	const execTime = await start(queryCount);

	if (process.send) process.send(execTime);
});

/*
	const prisma = new PrismaClient({
		log: [
			{
				emit: "event",
				level: "query",
			},
			{
				emit: "stdout",
				level: "error",
			},
			{
				emit: "stdout",
				level: "warn",
			},
		],
	});

	prisma.$on("query", (e) => {
		let query = e.query;

		try {
			const params = JSON.parse(e.params);

			for (let i = params.length; i > -1; i--) {
				query = query.replace(
					new RegExp("\\$" + String(i + 1), "g"),
					isNaN(Number(params[i])) ? "'" + params[i] + "'" : params[i],
				);
			}
		} catch (e) {
			console.log(e);
		}
		const statements = [
			"SELECT",
			"JOIN",
			"FROM",
			"WHERE",
			"OFFSET",
			"IN",
			"ORDER BY",
			"ORDER",
			"ASC",
			"DESC",
			"AND",
			"OR",
			"LIMIT",
			"AS",
			"INNER",
			"LEFT",
			"IS NOT NULL",
			"IS NULL",
		];

		statements.map((statement) => {
			query = query.replace(
				new RegExp(statement, "g"),
				chalk.green(statement),
			);
		});
		console.log("----------------");
		console.log(query);

		console.log("Duration: " + (e.duration > 100 ? chalk.yellow(e.duration) : e.duration));
	});
*/
