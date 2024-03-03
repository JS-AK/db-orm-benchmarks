import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { isMainThread } from "node:worker_threads";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", "..", "..", ".env") });

export type ConfigOptions = {
	DB_POSTGRE_DATABASE_PG_POOL: string;
	DB_POSTGRE_DATABASE_DRIZZLE: string;
	DB_POSTGRE_DATABASE_DB_MANAGER: string;
	DB_POSTGRE_DATABASE_PRISMA: string;
	DB_POSTGRE_DATABASE_SEQUELIZE: string;
	DB_POSTGRE_DATABASE_TYPEORM: string;
	DB_POSTGRE_DATABASE_MIKRO_ORM: string;
	DB_POSTGRE_DATABASE_OBJECTION_JS: string;
	DB_POSTGRE_DATABASE_KYSELY: string;
	DB_POSTGRE_HOST: string;
	DB_POSTGRE_PASSWORD: string;
	DB_POSTGRE_PORT: number;
	DB_POSTGRE_USER: string;

	IS_MAIN_THREAD: boolean;
};

type ConfigOptionsRaw = {
	DB_POSTGRE_DATABASE_PG_POOL?: string;
	DB_POSTGRE_DATABASE_DRIZZLE?: string;
	DB_POSTGRE_DATABASE_DB_MANAGER?: string;
	DB_POSTGRE_DATABASE_PRISMA?: string;
	DB_POSTGRE_DATABASE_SEQUELIZE?: string;
	DB_POSTGRE_DATABASE_TYPEORM?: string;
	DB_POSTGRE_DATABASE_MIKRO_ORM?: string;
	DB_POSTGRE_DATABASE_OBJECTION_JS?: string;
	DB_POSTGRE_DATABASE_KYSELY?: string;
	DB_POSTGRE_HOST?: string;
	DB_POSTGRE_PASSWORD?: string;
	DB_POSTGRE_PORT?: string;
	DB_POSTGRE_USER?: string;
};

const config: ConfigOptionsRaw = {
	DB_POSTGRE_DATABASE_PG_POOL: process.env.DB_POSTGRE_DATABASE_PG_POOL,
	DB_POSTGRE_DATABASE_DRIZZLE: process.env.DB_POSTGRE_DATABASE_DRIZZLE,
	DB_POSTGRE_DATABASE_DB_MANAGER: process.env.DB_POSTGRE_DATABASE_DB_MANAGER,
	DB_POSTGRE_DATABASE_PRISMA: process.env.DB_POSTGRE_DATABASE_PRISMA,
	DB_POSTGRE_DATABASE_SEQUELIZE: process.env.DB_POSTGRE_DATABASE_SEQUELIZE,
	DB_POSTGRE_DATABASE_TYPEORM: process.env.DB_POSTGRE_DATABASE_TYPEORM,
	DB_POSTGRE_DATABASE_MIKRO_ORM: process.env.DB_POSTGRE_DATABASE_MIKRO_ORM,
	DB_POSTGRE_DATABASE_OBJECTION_JS: process.env.DB_POSTGRE_DATABASE_OBJECTION_JS,
	DB_POSTGRE_DATABASE_KYSELY: process.env.DB_POSTGRE_DATABASE_KYSELY,
	DB_POSTGRE_HOST: process.env.DB_POSTGRE_HOST,
	DB_POSTGRE_PASSWORD: process.env.DB_POSTGRE_PASSWORD,
	DB_POSTGRE_PORT: process.env.DB_POSTGRE_PORT,
	DB_POSTGRE_USER: process.env.DB_POSTGRE_USER,
};

export const getConfig = (): {
	data?: ConfigOptions;
	error: number;
	message?: string;
} => {
	for (const [k, v] of Object.entries(config)) {
		if (!v) return { error: 1, message: `Empty env - ${k}` };
	}

	const preparedConfig = { ...config } as Required<ConfigOptionsRaw>;

	return {
		data: {
			DB_POSTGRE_DATABASE_PG_POOL: preparedConfig.DB_POSTGRE_DATABASE_PG_POOL,
			DB_POSTGRE_DATABASE_DRIZZLE: preparedConfig.DB_POSTGRE_DATABASE_DRIZZLE,
			DB_POSTGRE_DATABASE_DB_MANAGER: preparedConfig.DB_POSTGRE_DATABASE_DB_MANAGER,
			DB_POSTGRE_DATABASE_PRISMA: preparedConfig.DB_POSTGRE_DATABASE_PRISMA,
			DB_POSTGRE_DATABASE_SEQUELIZE: preparedConfig.DB_POSTGRE_DATABASE_SEQUELIZE,
			DB_POSTGRE_DATABASE_TYPEORM: preparedConfig.DB_POSTGRE_DATABASE_TYPEORM,
			DB_POSTGRE_DATABASE_MIKRO_ORM: preparedConfig.DB_POSTGRE_DATABASE_MIKRO_ORM,
			DB_POSTGRE_DATABASE_OBJECTION_JS: preparedConfig.DB_POSTGRE_DATABASE_OBJECTION_JS,
			DB_POSTGRE_DATABASE_KYSELY: preparedConfig.DB_POSTGRE_DATABASE_KYSELY,
			DB_POSTGRE_HOST: preparedConfig.DB_POSTGRE_HOST,
			DB_POSTGRE_PASSWORD: preparedConfig.DB_POSTGRE_PASSWORD,
			DB_POSTGRE_PORT: parseInt(preparedConfig.DB_POSTGRE_PORT, 10),
			DB_POSTGRE_USER: preparedConfig.DB_POSTGRE_USER,

			IS_MAIN_THREAD: isMainThread,
		},
		error: 0,
	};
};
