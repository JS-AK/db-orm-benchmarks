import PG from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { inArray } from "drizzle-orm";

import * as Schemas from "./schemas/index.js";

import {
	generateRandomEmail,
	getRandomFirstName,
	getRandomLastName,
	getUserRoleId,
} from "../helpers/index.js";

type Config = { host: string; port: number; user: string; password: string; database: string; };

const start = async (queryCount: number, config: Config): Promise<number> => {
	const pool = new PG.Pool(config);
	const db = drizzle(pool);

	const userRoles = (await db.select({ id: Schemas.userRoles.id }).from(Schemas.userRoles)).map((e) => e.id);

	const start = performance.now();

	const userIds: string[] = [];

	await db.transaction(async (tx) => {
		for (let idx = 0; idx < queryCount; idx++) {
			const randomEmail = generateRandomEmail();
			const randomFirstName = getRandomFirstName();
			const randomLastName = getRandomLastName();

			const [entity] = await tx.insert(Schemas.users).values({
				email: randomEmail,
				firstName: randomFirstName,
				isDeleted: false,
				lastName: randomLastName,
				userRoleId: getUserRoleId(userRoles),
			}).returning({ id: Schemas.users.id });

			if (entity) userIds.push(entity.id);
		}
	});

	const execTime = Math.round(performance.now() - start);

	await db.delete(Schemas.users).where(inArray(Schemas.users.id, userIds));

	await pool.end();

	return execTime;
};

process.on("message", async (message: { config: Config; queryCount: number; }) => {
	const { config, queryCount } = message;
	const execTime = await start(queryCount, config);

	if (process.send) process.send(execTime);
});
