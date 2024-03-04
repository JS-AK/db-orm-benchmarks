import PG from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import * as Schemas from "./schemas/index.js";

import {
	generateRandomEmail,
	getRandomFirstName,
	getRandomLastName,
	getUserRoleId,
} from "../helpers/index.js";

type Config = { host: string; port: number; user: string; password: string; database: string; };

const start = async (config: Config): Promise<number> => {
	const pool = new PG.Pool(config);

	const db = drizzle(pool);

	const userExists = await db
		.select({ id: Schemas.users.id })
		.from(Schemas.users)
		.limit(1);

	if (userExists.length) {
		await pool.end();

		return 0;
	}

	const userRoles = (await db
		.select({ id: Schemas.userRoles.id })
		.from(Schemas.userRoles))
		.map((e) => e.id);

	async function insertUsersInBatches(
		totalUsers: number,
		batchSize: number,
	) {
		const batchPromises = [];

		for (let i = 0; i < totalUsers; i += batchSize) {
			const batchInserts = [];

			for (let j = 0; j < batchSize; j++) {
				const randomEmail = generateRandomEmail();
				const randomFirstName = getRandomFirstName();
				const randomLastName = getRandomLastName();

				batchInserts.push({
					email: randomEmail,
					firstName: randomFirstName,
					isDeleted: false,
					lastName: randomLastName,
					userRoleId: getUserRoleId(userRoles),
				});
			}

			batchPromises.push(db.insert(Schemas.users).values(batchInserts));
		}

		await Promise.all(batchPromises);
	}

	const totalUsers = 1_000_000;
	const batchSize = 10;

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
