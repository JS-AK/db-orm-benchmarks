import { User } from "./entities/User.js";
import { init } from "./schema.js";

type Config = { host: string; port: number; user: string; password: string; database: string; };

const start = async (queryCount: number, config: Config): Promise<number> => {
	const { orm } = await init(config);

	const promises = [];

	const users = await User.query().select("id");

	function getRandomInt(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	const start = performance.now();

	for (let i = 0; i < queryCount; i++) {
		const randomUserId = users[getRandomInt(1, users.length - 1)]?.id as string;

		promises.push(
			() => User.query()
				.select("id")
				.where("id", randomUserId),
		);
	}

	await Promise.all(promises.map((e) => e()));

	const execTime = Math.round(performance.now() - start);

	await orm.destroy();

	return execTime;
};

process.on("message", async (message: { config: Config; queryCount: number; }) => {
	const { config, queryCount } = message;
	const execTime = await start(queryCount, config);

	if (process.send) process.send(execTime);
});
