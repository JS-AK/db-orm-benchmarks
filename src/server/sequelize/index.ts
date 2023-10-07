import { init } from "./schema.js";

export const benchSequelize = async (queryCount: number, config: {
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
		promises.push(
			User.findOne({
				attributes: ["email"],
				where: { id: users[getRandomInt(0, users.length - 1)]?.id as string },
			}),
		);
	}

	{
		const start = performance.now();

		await Promise.all(promises);
		const execTime = Math.round(performance.now() - start);

		console.log(`sequelize execTime: ${execTime}ms`);
	}

	await sequelize.close();
};
