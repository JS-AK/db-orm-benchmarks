import {
	User,
	init,
} from "./schema.js";

type Config = { host: string; port: number; user: string; password: string; database: string; };

const start = async (queryCount: number, config: Config): Promise<number> => {
	const { PostgresDataSource } = await init(config);

	const promises = [];

	const users = (await PostgresDataSource
		.getRepository(User)
		.find({ select: ["id"] }));

	function getRandomInt(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	const start = performance.now();

	for (let i = 0; i < queryCount; i++) {
		const randomUserId = users[getRandomInt(1, users.length - 1)]?.id as string;

		promises.push(
			() => PostgresDataSource
				.getRepository(User)
				.findOne({
					select: ["email"],
					where: { id: randomUserId },
				}),
		);
	}

	for (const promise of promises) await promise();

	const execTime = Math.round(performance.now() - start);

	await PostgresDataSource.destroy();

	return execTime;
};

process.on("message", async (message: { config: Config; queryCount: number; }) => {
	const { config, queryCount } = message;
	const execTime = await start(queryCount, config);

	if (process.send) process.send(execTime);
});
