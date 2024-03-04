import PG from "pg";

import {
	generateRandomEmail,
	getRandomFirstName,
	getRandomLastName,
	getUserRoleId,
} from "../helpers/index.js";

type Config = { host: string; port: number; user: string; password: string; database: string; };

const start = async (queryCount: number, config: Config): Promise<number> => {
	const promises = [];

	const pool = new PG.Pool(config);

	const userRoles = (await pool.query<{ id: string; }>("SELECT id FROM user_roles")).rows.map((e) => e.id);

	const start = performance.now();

	for (let idx = 0; idx < queryCount; idx++) {
		const randomEmail = generateRandomEmail();
		const randomFirstName = getRandomFirstName();
		const randomLastName = getRandomLastName();

		promises.push(
			pool.query<{ id: string; }>(`
				INSERT INTO users(is_deleted, id_user_role, email, first_name, last_name)
				VALUES ($1, $2, $3, $4, $5)
				RETURNING id
			`, [false, getUserRoleId(userRoles), randomEmail, randomFirstName, randomLastName]),
		);
	}
	const users = await Promise.all(promises);

	const execTime = Math.round(performance.now() - start);

	const userIds = users.map((e) => e.rows[0]?.id);

	await pool.query("DELETE FROM users WHERE id = ANY($1)", [userIds]);

	await pool.end();

	return execTime;
};

process.on("message", async (message: { config: Config; queryCount: number; }) => {
	const { config, queryCount } = message;
	const execTime = await start(queryCount, config);

	if (process.send) process.send(execTime);
});
