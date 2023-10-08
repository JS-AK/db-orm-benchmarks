import { init } from "./schema.js";

export const bench = async (queryCount: number, config: {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
}) => {
	const { User, sequelize } = init(config);

	const promises = [];

	const users = (await User.findAll({
		attributes: ["id"],
	})).map((e) => e.get({ plain: true }));

	function getRandomInt(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	for (let i = 0; i < queryCount; i++) {
		const randomUserId = users[getRandomInt(0, users.length - 1)]?.id as string;

		promises.push(
			User.findOne({
				attributes: ["email"],
				where: { id: randomUserId },
			}),
		);
	}

	const start = performance.now();

	await Promise.all(promises);

	const execTime = Math.round(performance.now() - start);

	await sequelize.close();

	return execTime;
};

export const benchOneByOne = async (queryCount: number, config: {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
}) => {
	const { User, sequelize } = init(config);

	const promises = [];

	const users = (await User.findAll({
		attributes: ["id"],
	})).map((e) => e.get({ plain: true }));

	function getRandomInt(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	for (let i = 0; i < queryCount; i++) {
		const randomUserId = users[getRandomInt(0, users.length - 1)]?.id as string;

		promises.push(
			User.findOne({
				attributes: ["email"],
				where: { id: randomUserId },
			}),
		);
	}

	const start = performance.now();

	for (const promise of promises) await promise;

	const execTime = Math.round(performance.now() - start);

	await sequelize.close();

	return execTime;
};
