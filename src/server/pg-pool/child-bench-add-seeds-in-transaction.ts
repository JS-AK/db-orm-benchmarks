import PG from "pg";

import {
	generateRandomEmail,
	getRandomFirstName,
	getRandomLastName,
	getUserRoleId,
} from "../helpers/index.js";

type Config = { host: string; port: number; user: string; password: string; database: string; };

const start = async (queryCount: number, config: Config): Promise<number> => {
	const pool = new PG.Pool(config);

	const userRoles = (await pool.query<{ id: string; }>("SELECT id FROM user_roles")).rows.map((e) => e.id);

	const start = performance.now();

	const client = await pool.connect();

	const userIds: string[] = [];

	try {
		await client.query("BEGIN");

		for (let idx = 0; idx < queryCount; idx++) {
			const randomEmail = generateRandomEmail();
			const randomFirstName = getRandomFirstName();
			const randomLastName = getRandomLastName();

			const { rows: [entity] } = await client.query<{ id: string; }>(`
				INSERT INTO users(is_deleted, id_user_role, email, first_name, last_name)
				VALUES ($1, $2, $3, $4, $5)
				RETURNING id
			`, [false, getUserRoleId(userRoles), randomEmail, randomFirstName, randomLastName]);

			if (entity) userIds.push(entity.id);
		}

		await client.query("COMMIT");
	} catch (err) {
		await client.query("ROLLBACK");
	} finally {
		client.release();
	}

	const execTime = Math.round(performance.now() - start);

	await pool.query("DELETE FROM users WHERE id = ANY($1)", [userIds]);

	await pool.end();

	return execTime;
};

process.on("message", async (message: { config: Config; queryCount: number; }) => {
	const { config, queryCount } = message;
	const execTime = await start(queryCount, config);

	if (process.send) process.send(execTime);
});
