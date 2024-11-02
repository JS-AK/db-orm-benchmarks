import { init } from "./schema.js";

type Config = { host: string; port: number; user: string; password: string; database: string; };

const start = async (queryCount: number, config: Config): Promise<number> => {
	const { User, sequelize } = init(config);

	const promises = [];

	const users = (await User.findAll({
		attributes: ["id"],
	})).map((e) => e.get({ plain: true }));

	function getRandomInt(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	const start = performance.now();

	for (let i = 0; i < queryCount; i++) {
		const randomUserId = users[getRandomInt(1, users.length - 1)]?.id as string;

		promises.push(
			() => User.findOne({
				attributes: ["email"],
				where: { id: randomUserId },
			}),
		);
	}

	for (const promise of promises) await promise();

	const execTime = Math.round(performance.now() - start);

	await sequelize.close();

	return execTime;
};

process.on("message", async (message: { config: Config; queryCount: number; }) => {
	const { config, queryCount } = message;
	const execTime = await start(queryCount, config);

	if (process.send) process.send(execTime);
});
