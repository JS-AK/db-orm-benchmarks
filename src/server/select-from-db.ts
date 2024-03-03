import * as MigrationsDown from "../migrations/down.js";
import * as MigrationsUp from "../migrations/up.js";

import * as DbManager from "./db-manager/index.js";
import * as Drizzle from "./drizzle/index.js";
import * as Kysely from "./kysely/index.js";
import * as MikroOrm from "./mikro-orm/index.js";
import * as Objection from "./objection/index.js";
import * as Pg from "./pg-pool/index.js";
import * as Prisma from "./prisma/index.js";
import * as Sequelize from "./sequelize/index.js";
import * as TypeOrm from "./typeorm/index.js";

type DbConfig = { database: string; host: string; password: string; port: number; user: string; };

const queryCount = 50_000;
const count = 10;

export const start = async (config: any) => {
	await MigrationsDown.start(config);
	await MigrationsUp.start(config);

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
	const objectionJsConfig = createDbConfig(config.DB_POSTGRE_DATABASE_OBJECTION_JS);
	const kyselyConfig = createDbConfig(config.DB_POSTGRE_DATABASE_KYSELY);

	const databaseConfigs = [
		pgPoolConfig,
		drizzleConfig,
		dbManagerConfig,
		prismaConfig,
		sequelizeConfig,
		typeormConfig,
		mikroOrmConfig,
		objectionJsConfig,
		kyselyConfig,
	];

	for (const databaseConfig of databaseConfigs) {
		await Drizzle.addSeedsInitial(databaseConfig);
	}

	const cases = [
		{ benchFunction: Pg.benchSelect, queryCount, count, name: "pg.Pool Promise.All", config: pgPoolConfig },
		{ benchFunction: Drizzle.benchSelect, queryCount, count, name: "drizzle Promise.All", config: drizzleConfig },
		{ benchFunction: DbManager.benchSelect, queryCount, count, name: "db-manager Promise.All", config: dbManagerConfig },
		{ benchFunction: Prisma.benchSelect, queryCount, count, name: "prisma Promise.All", config: prismaConfig },
		{ benchFunction: Sequelize.benchSelect, queryCount, count, name: "sequelize Promise.All", config: sequelizeConfig },
		{ benchFunction: TypeOrm.benchSelect, queryCount, count, name: "typeorm Promise.All", config: typeormConfig },
		{ benchFunction: MikroOrm.benchSelect, queryCount, count, name: "mikro-orm Promise.All", config: mikroOrmConfig },
		{ benchFunction: Objection.benchSelect, queryCount, count, name: "Objection.js Promise.All", config: objectionJsConfig },
		{ benchFunction: Kysely.benchSelect, queryCount, count, name: "kysely Promise.All", config: kyselyConfig },

		{ benchFunction: Pg.benchSelectOneByOne, queryCount, count, name: "pg.Pool OneByOne", config: pgPoolConfig },
		{ benchFunction: Drizzle.benchSelectOneByOne, queryCount, count, name: "drizzle OneByOne", config: drizzleConfig },
		{ benchFunction: DbManager.benchSelectOneByOne, queryCount, count, name: "db-manager OneByOne", config: dbManagerConfig },
		{ benchFunction: Prisma.benchSelectOneByOne, queryCount, count, name: "prisma OneByOne", config: prismaConfig },
		{ benchFunction: Sequelize.benchSelectOneByOne, queryCount, count, name: "sequelize OneByOne", config: sequelizeConfig },
		{ benchFunction: TypeOrm.benchSelectOneByOne, queryCount, count, name: "typeorm OneByOne", config: typeormConfig },
		{ benchFunction: MikroOrm.benchSelectOneByOne, queryCount, count, name: "mikro-orm OneByOne", config: mikroOrmConfig },
		{ benchFunction: Objection.benchSelectOneByOne, queryCount, count, name: "Objection.js OneByOne", config: objectionJsConfig },
		{ benchFunction: Kysely.benchSelectOneByOne, queryCount, count, name: "kysely OneByOne", config: kyselyConfig },
	];

	for (const c of cases) await startBench(c);

	await MigrationsDown.start(config);
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

	// console.log(`ATTEMPTS: ${times.map((e) => `${e}ms`).join(" ")}`);
	// console.log(`AVG ${avgQPS}qps`);
	// console.log(`AVG ${avg}ms`);
	console.log(`${name} |  ${avgQPS}            | ${times.map((e) => `${e}ms`).join(" | ")} | ${avg}ms |`);
}
