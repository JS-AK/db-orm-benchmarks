import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { isMainThread } from "node:worker_threads";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", "..", "..", ".env") });

// const convertEnvToBoolean = (defaultBoolean: boolean, env?: string) => {
// if (env) {
// if (env.toLowerCase() === "true") return true;
// else if (env.toLowerCase() === "false") return false;
// else throw new Error(`Wrong boolean env ${env} incoming`);
// }

// return defaultBoolean;
// };

export type ConfigOptions = {
	DB_POSTGRE_DATABASE: string;
	DB_POSTGRE_HOST: string;
	DB_POSTGRE_PASSWORD: string;
	DB_POSTGRE_PORT: number;
	DB_POSTGRE_USER: string;

	IS_MAIN_THREAD: boolean;
};

type ConfigOptionsRaw = {
	DB_POSTGRE_DATABASE?: string;
	DB_POSTGRE_HOST?: string;
	DB_POSTGRE_PASSWORD?: string;
	DB_POSTGRE_PORT?: string;
	DB_POSTGRE_USER?: string;
};

const config: ConfigOptionsRaw = {
	DB_POSTGRE_DATABASE: process.env.DB_POSTGRE_DATABASE,
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
			DB_POSTGRE_DATABASE: preparedConfig.DB_POSTGRE_DATABASE,
			DB_POSTGRE_HOST: preparedConfig.DB_POSTGRE_HOST,
			DB_POSTGRE_PASSWORD: preparedConfig.DB_POSTGRE_PASSWORD,
			DB_POSTGRE_PORT: parseInt(preparedConfig.DB_POSTGRE_PORT, 10),
			DB_POSTGRE_USER: preparedConfig.DB_POSTGRE_USER,

			IS_MAIN_THREAD: isMainThread,
		},
		error: 0,
	};
};
