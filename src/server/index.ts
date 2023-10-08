import { getConfig } from "../server/config/index.js";

import * as DbManager from "./db-manager/index.js";
import * as Drizzle from "./drizzle/index.js";
import * as Kysely from "./kysely/index.js";
import * as MikroOrm from "./mikro-orm/index.js";
import * as Pg from "./pg-pool/index.js";
import * as Prisma from "./prisma/index.js";
import * as Sequelize from "./sequelize/index.js";
import * as TypeOrm from "./typeorm/index.js";

const queryCount = 50_000;
const count = 10;

const { data: config, message } = getConfig();

if (!config) {
	process.stderr.write(`${message}\n`);
	process.exit(1);
} else {
	await Drizzle.addSeeds({
		database: config.DB_POSTGRE_DATABASE,
		host: config.DB_POSTGRE_HOST,
		password: config.DB_POSTGRE_PASSWORD,
		port: config.DB_POSTGRE_PORT,
		user: config.DB_POSTGRE_USER,
	});

	await startBench({ benchFunction: Pg.bench, queryCount, count, name: "pg.Pool Promise.All", config });
	await startBench({ benchFunction: Pg.benchOneByOne, queryCount, count, name: "pg.Pool OneByOne", config });

	await startBench({ benchFunction: Drizzle.bench, queryCount, count, name: "drizzle Promise.All", config });
	await startBench({ benchFunction: Drizzle.benchOneByOne, queryCount, count, name: "drizzle OneByOne", config });

	await startBench({ benchFunction: DbManager.bench, queryCount, count, name: "db-manager Promise.All", config });
	await startBench({ benchFunction: DbManager.benchOneByOne, queryCount, count, name: "db-manager OneByOne", config });

	await startBench({ benchFunction: Prisma.bench, queryCount, count, name: "prisma Promise.All", config });
	await startBench({ benchFunction: Prisma.benchOneByOne, queryCount, count, name: "prisma OneByOne", config });

	await startBench({ benchFunction: Sequelize.bench, queryCount, count, name: "sequelize Promise.All", config });
	await startBench({ benchFunction: Sequelize.benchOneByOne, queryCount, count, name: "sequelize OneByOne", config });

	await startBench({ benchFunction: TypeOrm.bench, queryCount, count, name: "typeorm Promise.All", config });
	await startBench({ benchFunction: TypeOrm.benchOneByOne, queryCount, count, name: "typeorm OneByOne", config });

	await startBench({ benchFunction: MikroOrm.bench, queryCount, count, name: "mikro-orm Promise.All", config });
	await startBench({ benchFunction: MikroOrm.benchOneByOne, queryCount, count, name: "mikro-orm OneByOne", config });

	await startBench({ benchFunction: Kysely.bench, queryCount, count, name: "kysely Promise.All", config });
	await startBench({ benchFunction: Kysely.benchOneByOne, queryCount, count, name: "kysely OneByOne", config });
}

async function startBench(data: {
	benchFunction: any;
	config: {
		DB_POSTGRE_DATABASE: string;
		DB_POSTGRE_HOST: string;
		DB_POSTGRE_PASSWORD: string;
		DB_POSTGRE_PORT: number;
		DB_POSTGRE_USER: string;
	};
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
		const time = await benchFunction(queryCount, {
			database: config.DB_POSTGRE_DATABASE,
			host: config.DB_POSTGRE_HOST,
			password: config.DB_POSTGRE_PASSWORD,
			port: config.DB_POSTGRE_PORT,
			user: config.DB_POSTGRE_USER,
		});

		times.push(time);
	}

	console.log(name, times.map((e) => `${e}ms`).join(" "));
	const sum = times.reduce((a, b) => a + b, 0);
	const avg = (sum / times.length) || 0;

	console.log(name, avg + "ms");
}
