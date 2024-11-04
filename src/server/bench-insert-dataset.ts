/* eslint-disable no-console */

import { ConfigOptions } from "./config/index.js";

import * as DbManager from "./db-manager/index.js";
import * as Drizzle from "./drizzle/index.js";
// import * as Kysely from "./kysely/index.js";
import * as MikroOrm from "./mikro-orm/index.js";
// import * as Objection from "./objection/index.js";
import * as Pg from "./pg-pool/index.js";
import * as Prisma from "./prisma/index.js";
import * as Sequelize from "./sequelize/index.js";
import * as TypeOrm from "./typeorm/index.js";

type DbConfig = { database: string; host: string; password: string; port: number; user: string; };

const queryCount = 50_000;
const count = 10;

export const start = async (config: ConfigOptions) => {
	const createDbConfig = (database: string): DbConfig => ({
		database,
		host: config.DB_POSTGRE_HOST,
		password: config.DB_POSTGRE_PASSWORD,
		port: config.DB_POSTGRE_PORT,
		user: config.DB_POSTGRE_USER,
	});

	const pgPoolConfig = createDbConfig(config.DB_POSTGRE_DATABASE_PG_POOL);
	const drizzleConfig = createDbConfig(config.DB_POSTGRE_DATABASE_DRIZZLE);
	const dbManagerConfig = createDbConfig(config.DB_POSTGRE_DATABASE_DB_MANAGER);
	const prismaConfig = createDbConfig(config.DB_POSTGRE_DATABASE_PRISMA);
	const sequelizeConfig = createDbConfig(config.DB_POSTGRE_DATABASE_SEQUELIZE);
	const typeormConfig = createDbConfig(config.DB_POSTGRE_DATABASE_TYPEORM);
	const mikroOrmConfig = createDbConfig(config.DB_POSTGRE_DATABASE_MIKRO_ORM);
	// const objectionJsConfig = createDbConfig(config.DB_POSTGRE_DATABASE_OBJECTION_JS);
	// const kyselyConfig = createDbConfig(config.DB_POSTGRE_DATABASE_KYSELY);

	const cases = [
		{ benchFunction: Pg.benchAddSeeds, queryCount, count, name: "pg.pool", config: pgPoolConfig },
		{ benchFunction: Drizzle.benchAddSeeds, queryCount, count, name: "drizzle-orm", config: drizzleConfig },
		{ benchFunction: DbManager.benchAddSeeds, queryCount, count, name: "@js-ak/db-manager", config: dbManagerConfig },
		{ benchFunction: Prisma.benchAddSeeds, queryCount, count, name: "@prisma/client", config: prismaConfig },
		{ benchFunction: Sequelize.benchAddSeeds, queryCount, count, name: "sequelize", config: sequelizeConfig },
		{ benchFunction: TypeOrm.benchAddSeeds, queryCount, count, name: "typeorm", config: typeormConfig },
		{ benchFunction: MikroOrm.benchAddSeeds, queryCount, count, name: "mikro-orm", config: mikroOrmConfig },
		// { benchFunction: Objection.benchAddSeeds, queryCount, count, name: "objection.js", config: objectionJsConfig },
		// { benchFunction: Kysely.benchAddSeeds, queryCount, count, name: "kysely", config: kyselyConfig },
	];

	console.log("┌───────────────────┬───────────────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬───────────┐");
	console.log("│ orm db            │ avg query per sec |   1     │   2     │   3     │   4     │   5     │   6     │   7     │   8     │   9     │  10     │ avg       │");
	console.log("├───────────────────┼───────────────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼───────────┤");

	for (const c of cases) await startBench(c);

	console.log("└───────────────────┴───────────────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴───────────┘");
};

async function startBench(data: {
	benchFunction: (queryCount: number, config: DbConfig) => Promise<number>;
	config: DbConfig;
	count: number;
	name: string;
	queryCount: number;
}) {
	const {
		benchFunction,
		config,
		count,
		name,
		queryCount,
	} = data;

	const times = [];

	for (let index = 0; index < count; index++) {
		const time = await benchFunction(queryCount, config);

		times.push(time);
	}

	const sum = times.reduce((a, b) => a + b, 0);
	const avg = (sum / times.length) || 0;
	const avgQPS = Math.round((queryCount / avg) * 1000) || 0;

	console.log(`│ ${name.padEnd(18)}|${String(avgQPS).padStart(6)}             |${times.map((e) => `${String(e).padStart(6)}ms `).join("|")}|${String(avg.toFixed(1)).padStart(8)}ms |`);
}
