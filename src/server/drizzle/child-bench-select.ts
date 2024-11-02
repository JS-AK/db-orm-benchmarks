import PG from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";

import * as Schemas from "./schemas/index.js";

type Config = { host: string; port: number; user: string; password: string; database: string; };

const start = async (queryCount: number, config: Config): Promise<number> => {
	const pool = new PG.Pool(config);

	const db = drizzle(pool);

	const promises = [];

	const users = await db.select({ id: Schemas.users.id })
		.from(Schemas.users);

	function getRandomInt(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	const start = performance.now();

	for (let i = 0; i < queryCount; i++) {
		const randomUserId = users[getRandomInt(1, users.length - 1)]?.id as string;

		promises.push(
			() => db.select({ email: Schemas.users.email })
				.from(Schemas.users)
				.where(eq(Schemas.users.id, randomUserId)),
		);
	}

	await Promise.all(promises.map((e) => e()));
	
	const execTime = Math.round(performance.now() - start);

	await pool.end();

	return execTime;
};

process.on("message", async (message: { config: Config; queryCount: number; }) => {
	const { config, queryCount } = message;
	const execTime = await start(queryCount, config);

	if (process.send) process.send(execTime);
});
