import path from "node:path";

import { PG } from "@js-ak/db-manager";

export const start = async (config: any) => {
	const databases = [
		config.DB_POSTGRE_DATABASE_DB_MANAGER,
		config.DB_POSTGRE_DATABASE_DRIZZLE,
		config.DB_POSTGRE_DATABASE_KYSELY,
		config.DB_POSTGRE_DATABASE_MIKRO_ORM,
		config.DB_POSTGRE_DATABASE_OBJECTION_JS,
		config.DB_POSTGRE_DATABASE_PG_POOL,
		config.DB_POSTGRE_DATABASE_PRISMA,
		config.DB_POSTGRE_DATABASE_SEQUELIZE,
		config.DB_POSTGRE_DATABASE_TYPEORM,
	];

	for (const database of databases) {
		const settings = {
			database,
			host: config.DB_POSTGRE_HOST,
			password: config.DB_POSTGRE_PASSWORD,
			port: config.DB_POSTGRE_PORT,
			user: config.DB_POSTGRE_USER,
		};

		const pool = PG.BaseModel.getStandardPool(settings);

		await PG.MigrationSystem.Up.start(pool, {
			migrationsTableName: "migration_control",
			pathToSQL: path.resolve(process.cwd(), "src", "migrations", "sql"),
		});

		await PG.BaseModel.removeStandardPool(settings);
	}
};
