import { PG } from "@js-ak/db-manager";

import * as User from "./user/index.js";
import * as UserRole from "./user-role/index.js";

import {
	generateRandomEmail,
	getRandomFirstName,
	getRandomLastName,
	getUserRoleId,
} from "../helpers/index.js";

type Config = { host: string; port: number; user: string; password: string; database: string; };

const start = async (queryCount: number, config: Config): Promise<number> => {
	const promises = [];

	const user = User.domain(config);
	const userRole = UserRole.domain(config);

	const userRolesIds = (await userRole.getArrByParams({ params: {}, selected: ["id"] })).map((e) => e.id);

	const start = performance.now();

	for (let idx = 0; idx < queryCount; idx++) {
		const randomEmail = generateRandomEmail();
		const randomFirstName = getRandomFirstName();
		const randomLastName = getRandomLastName();

		promises.push(
			() => user.createOne({
				id_user_role: getUserRoleId(userRolesIds),

				email: randomEmail,
				first_name: randomFirstName,
				last_name: randomLastName,
			}),
		);
	}

	const users = await Promise.all(promises.map((e) => e()));

	const execTime = Math.round(performance.now() - start);

	const userIds = users.map((e) => e.id);

	await user.deleteByParams({ params: { id: { $in: userIds } } });

	await PG.connection.shutdown();

	return execTime;
};

process.on("message", async (message: { config: Config; queryCount: number; }) => {
	const { config, queryCount } = message;
	const execTime = await start(queryCount, config);

	if (process.send) process.send(execTime);
});
