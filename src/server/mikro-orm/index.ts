import { User } from "./entities/User.js";
import { init } from "./schema.js";

export const benchMikroOrm = async (queryCount: number, config: {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
}) => {
	const { orm } = await init(config);

	const promises = [];

	const users = await orm.em.fork().getRepository(User).find({}, { fields: ["id"] });

	function getRandomInt(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	for (let i = 0; i < queryCount; i++) {
		const randomUserId = users[getRandomInt(0, users.length - 1)]?.id as string;

		promises.push(
			orm.em.fork().getRepository(User).findOne(
				{ id: randomUserId },
				{ fields: ["id"] },
			),
		);
	}
	const start = performance.now();

	await Promise.all(promises);

	const execTime = Math.round(performance.now() - start);

	await orm.close();

	return execTime;
};
