import { User } from "./entities/User.js";
import { init } from "./schema.js";

type Config = { host: string; port: number; user: string; password: string; database: string; };

const start = async (queryCount: number, config: Config): Promise<number> => {
	const { orm } = await init(config);

	const promises = [];

	const users = await orm.em.fork().getRepository(User).find({}, { fields: ["id"] });

	function getRandomInt(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	const start = performance.now();

	for (let i = 0; i < queryCount; i++) {
		const randomUserId = users[getRandomInt(1, users.length - 1)]?.id as string;

		promises.push(
			orm.em.fork().getRepository(User).findOne(
				{ id: randomUserId },
				{ fields: ["id"] },
			),
		);
	}

	await Promise.all(promises);

	const execTime = Math.round(performance.now() - start);

	await orm.close();

	return execTime;
};

process.on("message", async (message: { config: Config; queryCount: number; }) => {
	const { config, queryCount } = message;
	const execTime = await start(queryCount, config);

	if (process.send) process.send(execTime);
});
