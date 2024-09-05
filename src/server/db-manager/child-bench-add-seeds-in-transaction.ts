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
	const user = User.domain(config);
	const userRole = UserRole.domain(config);

	const userRoles = (await userRole.getArrByParams({ params: {}, selected: ["id"] })).map((e) => e.id);

	const start = performance.now();

	const pool = PG.BaseModel.getTransactionPool(config);
	const client = await pool.connect();

	const userIds: string[] = [];

	try {
		await client.query("BEGIN");

		for (let idx = 0; idx < queryCount; idx++) {
			const randomEmail = generateRandomEmail();
			const randomFirstName = getRandomFirstName();
			const randomLastName = getRandomLastName();

			const [entity] = await user.model.queryBuilder({ client })
				.insert({
					params: {
						email: randomEmail,
						first_name: randomFirstName,
						id_user_role: getUserRoleId(userRoles),
						is_deleted: false,
						last_name: randomLastName,
					},
				})
				.returning(["id"])
				.execute<{ id: string; }>();

			if (entity) userIds.push(entity.id);
		}

		await client.query("COMMIT");
	} catch (err) {
		await client.query("ROLLBACK");
	} finally {
		client.release();
	}

	const execTime = Math.round(performance.now() - start);

	await user.deleteByParams({ params: { id: { $in: userIds } } });

	await PG.connection.shutdown();

	return execTime;
};

process.on("message", async (message: { config: Config; queryCount: number; }) => {
	const { config, queryCount } = message;
	const execTime = await start(queryCount, config);

	if (process.send) process.send(execTime);
});
