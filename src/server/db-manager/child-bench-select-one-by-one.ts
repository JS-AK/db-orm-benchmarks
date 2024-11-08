import { PG } from "@js-ak/db-manager";

import * as User from "./user/index.js";

type Config = { host: string; port: number; user: string; password: string; database: string; };

const start = async (queryCount: number, config: Config): Promise<number> => {
	const user = User.domain(config);

	const promises = [];

	const users = await user.getArrByParams({
		params: {},
		selected: ["id"],
	});

	function getRandomInt(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	const start = performance.now();

	for (let i = 0; i < queryCount; i++) {
		const randomUserId = users[getRandomInt(1, users.length - 1)]?.id as string;

		promises.push(
			() => user.getOneByParams({
				params: { id: randomUserId },
				selected: ["email"],
			}),
		);
	}

	for (const promise of promises) await promise();

	const execTime = Math.round(performance.now() - start);

	await PG.connection.shutdown();

	return execTime;
};

process.on("message", async (message: { config: Config; queryCount: number; }) => {
	const { config, queryCount } = message;
	const execTime = await start(queryCount, config);

	if (process.send) process.send(execTime);
});
