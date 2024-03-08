import { ConfigOptions } from "./config/index.js";

import * as MigrationsDown from "../migrations/down.js";
import * as MigrationsUp from "../migrations/up.js";

import * as Pg from "./pg-pool/index.js";

type DbConfig = { database: string; host: string; password: string; port: number; user: string; };

export const start = async (config: ConfigOptions) => {
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
		await Pg.addSeedsInitial(databaseConfig);
	}
};
