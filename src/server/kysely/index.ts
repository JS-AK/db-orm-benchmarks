import { init } from "./schema.js";

export const bench = async (queryCount: number, config: {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
}) => {
	const { db } = await init(config);

	const promises = [];

	const users = await db
		.selectFrom("users")
		.select("id")
		.execute();

	function getRandomInt(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	for (let i = 0; i < queryCount; i++) {
		const randomUserId = users[getRandomInt(0, users.length - 1)]?.id as string;

		promises.push(
			db.selectFrom("users")
				.where("id", "=", randomUserId)
				.select("email")
				.executeTakeFirst(),
		);
	}

	const start = performance.now();

	await Promise.all(promises);

	const execTime = Math.round(performance.now() - start);

	await db.destroy();

	return execTime;
};

export const benchOneByOne = async (queryCount: number, config: {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
}) => {
	const { db } = await init(config);

	const promises = [];

	const users = await db
		.selectFrom("users")
		.select("id")
		.execute();

	function getRandomInt(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	for (let i = 0; i < queryCount; i++) {
		const randomUserId = users[getRandomInt(0, users.length - 1)]?.id as string;

		promises.push(
			db.selectFrom("users")
				.where("id", "=", randomUserId)
				.select("email")
				.executeTakeFirst(),
		);
	}

	const start = performance.now();

	for (const promise of promises) await promise;

	const execTime = Math.round(performance.now() - start);

	await db.destroy();

	return execTime;
};
