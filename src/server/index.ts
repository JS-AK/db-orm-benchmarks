import { getConfig } from "../server/config/index.js";

import { addSeeds, benchDrizzle } from "./drizzle/index.js";
import { benchDbManager } from "./db-manager/index.js";
import { benchPg } from "./pg-pool/index.js";
import { benchPrisma } from "./prisma/index.js";
import { benchSequelize } from "./sequelize/index.js";

const queryCount = 50_000;

const { data: config, message } = getConfig();

if (!config) {
	process.stderr.write(`${message}\n`);
	process.exit(1);
} else {
	await addSeeds({
		database: config.DB_POSTGRE_DATABASE,
		host: config.DB_POSTGRE_HOST,
		password: config.DB_POSTGRE_PASSWORD,
		port: config.DB_POSTGRE_PORT,
		user: config.DB_POSTGRE_USER,
	});
	await benchDrizzle(queryCount, {
		database: config.DB_POSTGRE_DATABASE,
		host: config.DB_POSTGRE_HOST,
		password: config.DB_POSTGRE_PASSWORD,
		port: config.DB_POSTGRE_PORT,
		user: config.DB_POSTGRE_USER,
	});
	await benchPg(queryCount, {
		database: config.DB_POSTGRE_DATABASE,
		host: config.DB_POSTGRE_HOST,
		password: config.DB_POSTGRE_PASSWORD,
		port: config.DB_POSTGRE_PORT,
		user: config.DB_POSTGRE_USER,
	});
	await benchDbManager(queryCount, {
		database: config.DB_POSTGRE_DATABASE,
		host: config.DB_POSTGRE_HOST,
		password: config.DB_POSTGRE_PASSWORD,
		port: config.DB_POSTGRE_PORT,
		user: config.DB_POSTGRE_USER,
	});
	await benchPrisma(queryCount);
	await benchSequelize(queryCount, {
		database: config.DB_POSTGRE_DATABASE,
		host: config.DB_POSTGRE_HOST,
		password: config.DB_POSTGRE_PASSWORD,
		port: config.DB_POSTGRE_PORT,
		user: config.DB_POSTGRE_USER,
	});
}
