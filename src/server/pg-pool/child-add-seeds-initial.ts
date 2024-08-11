import PG from "pg";

import {
	generateRandomEmail,
	getRandomFirstName,
	getRandomLastName,
	getUserRoleId,
} from "../helpers/index.js";

type Config = { host: string; port: number; user: string; password: string; database: string; };

const start = async (config: Config): Promise<number> => {
	const pool = new PG.Pool(config);

	const { rows: userExists } = await pool.query<{ id: string; }>("SELECT id FROM users LIMIT 1");

	if (userExists.length) {
		await pool.end();

		return 0;
	}

	const userRoles = (await pool.query<{ id: string; }>("SELECT id FROM user_roles")).rows.map((e) => e.id);

	async function insertUsersInBatches(
		totalUsers: number,
		batchSize: number,
	) {
		for (let i = 0; i < totalUsers; i += batchSize) {
			const currentBatchSize = Math.min(batchSize, totalUsers - i);

			const batch = [];

			for (let j = 0; j < currentBatchSize; j++) {
				const randomEmail = generateRandomEmail();
				const randomFirstName = getRandomFirstName();
				const randomLastName = getRandomLastName();

				batch.push(
					pool.query<{ id: string; }>(`
						INSERT INTO users(is_deleted, id_user_role, email, first_name, last_name)
						VALUES ($1, $2, $3, $4, $5)
						RETURNING id
					`, [false, getUserRoleId(userRoles), randomEmail, randomFirstName, randomLastName]),
				);
			}

			await Promise.all(batch);
		}
	}

	const totalUsers = 1_000_000;
	const batchSize = 10_000;

	await insertUsersInBatches(totalUsers, batchSize);

	// eslint-disable-next-line no-console
	console.log("Seeders inserted successfully to database " + config.database);

	await pool.end();

	return 0;
};

process.on("message", async (message: { config: Config; }) => {
	const { config } = message;

	const code = await start(config);

	if (process.send) process.send(code);
});
