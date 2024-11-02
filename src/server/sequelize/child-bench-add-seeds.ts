import { init } from "./schema.js";

import {
	generateRandomEmail,
	getRandomFirstName,
	getRandomLastName,
	getUserRoleId,
} from "../helpers/index.js";

type Config = { host: string; port: number; user: string; password: string; database: string; };

const start = async (queryCount: number, config: Config): Promise<number> => {
	const { User, UserRole, sequelize } = init(config);

	const promises = [];

	const userRolesIds = (await UserRole.findAll({ attributes: ["id"] }))
		.map((e) => e.get({ plain: true }))
		.map((e) => e.id);

	const start = performance.now();

	for (let idx = 0; idx < queryCount; idx++) {
		const randomEmail = generateRandomEmail();
		const randomFirstName = getRandomFirstName();
		const randomLastName = getRandomLastName();

		promises.push(
			() => User.create({
				id_user_role: getUserRoleId(userRolesIds),

				email: randomEmail,
				first_name: randomFirstName,
				last_name: randomLastName,

				isDeleted: false,
			}),
		);
	}

	const users = await Promise.all(promises.map((e) => e()));

	const execTime = Math.round(performance.now() - start);

	const userIds = users
		.map((e) => e.get({ plain: true }))
		.map((e) => e.id);

	await User.destroy({ where: { id: userIds } });

	await sequelize.close();

	return execTime;
};

process.on("message", async (message: { config: Config; queryCount: number; }) => {
	const { config, queryCount } = message;
	const execTime = await start(queryCount, config);

	if (process.send) process.send(execTime);
});
