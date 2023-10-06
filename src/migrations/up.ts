import dotenv from "dotenv";
import path from "node:path";

import PG from "pg";

import * as DbMigrationSystem from "./lib/index.js";
import { getConfig } from "../server/config/index.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const { data: dataConfig, message } = getConfig();

if (!dataConfig) {
	process.stderr.write(`${message}\n`);
	process.exit(1);
} else {
	const pool = new PG.Pool({
		host: dataConfig.DB_POSTGRE_HOST,
		port: dataConfig.DB_POSTGRE_PORT,
		user: dataConfig.DB_POSTGRE_USER,
		password: dataConfig.DB_POSTGRE_PASSWORD,
		database: dataConfig.DB_POSTGRE_DATABASE,
	});

	await DbMigrationSystem.Up.start(pool, {
		migrationsTableName: "migration_control",
		// pathToJS: path.resolve(process.cwd(), "build", "migrations", "js"),
		pathToSQL: path.resolve(process.cwd(), "src", "migrations", "sql"),
	});

	await pool.end();
}
