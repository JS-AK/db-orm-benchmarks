import { getConfig } from "../server/config/index.js";

import { addSeeds, benchDrizzle } from "./drizzle/index.js";
import { benchDbManager } from "./db-manager/index.js";
import { benchMikroOrm } from "./mikro-orm/index.js";
import { benchPg } from "./pg-pool/index.js";
import { benchPrisma } from "./prisma/index.js";
import { benchSequelize } from "./sequelize/index.js";
import { benchTypeorm } from "./typeorm/index.js";

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

	{
		const times = [];

		for (let index = 0; index < 10; index++) {
			const time = await benchPg(queryCount, {
				database: config.DB_POSTGRE_DATABASE,
				host: config.DB_POSTGRE_HOST,
				password: config.DB_POSTGRE_PASSWORD,
				port: config.DB_POSTGRE_PORT,
				user: config.DB_POSTGRE_USER,
			});

			times.push(time);
		}

		console.log("benchPg", times.map((e) => `${e}ms`).join(" "));
		const sum = times.reduce((a, b) => a + b, 0);
		const avg = (sum / times.length) || 0;

		console.log("benchPg", avg + "ms");
	}

	{
		const times = [];

		for (let index = 0; index < 10; index++) {
			const time = await benchDrizzle(queryCount, {
				database: config.DB_POSTGRE_DATABASE,
				host: config.DB_POSTGRE_HOST,
				password: config.DB_POSTGRE_PASSWORD,
				port: config.DB_POSTGRE_PORT,
				user: config.DB_POSTGRE_USER,
			});

			times.push(time);
		}

		console.log("benchDrizzle", times.map((e) => `${e}ms`).join(" "));
		const sum = times.reduce((a, b) => a + b, 0);
		const avg = (sum / times.length) || 0;

		console.log("benchDrizzle", avg + "ms");
	}

	{
		const times = [];

		for (let index = 0; index < 10; index++) {
			const time = await benchDbManager(queryCount, {
				database: config.DB_POSTGRE_DATABASE,
				host: config.DB_POSTGRE_HOST,
				password: config.DB_POSTGRE_PASSWORD,
				port: config.DB_POSTGRE_PORT,
				user: config.DB_POSTGRE_USER,
			});

			times.push(time);
		}

		console.log("benchDbManager", times.map((e) => `${e}ms`).join(" "));
		const sum = times.reduce((a, b) => a + b, 0);
		const avg = (sum / times.length) || 0;

		console.log("benchDbManager", avg + "ms");
	}

	{
		const times = [];

		for (let index = 0; index < 10; index++) {
			const time = await benchPrisma(queryCount);

			times.push(time);
		}

		console.log("benchPrisma", times.map((e) => `${e}ms`).join(" "));
		const sum = times.reduce((a, b) => a + b, 0);
		const avg = (sum / times.length) || 0;

		console.log("benchPrisma", avg + "ms");
	}

	{
		const times = [];

		for (let index = 0; index < 10; index++) {
			const time = await benchSequelize(queryCount, {
				database: config.DB_POSTGRE_DATABASE,
				host: config.DB_POSTGRE_HOST,
				password: config.DB_POSTGRE_PASSWORD,
				port: config.DB_POSTGRE_PORT,
				user: config.DB_POSTGRE_USER,
			});

			times.push(time);
		}

		console.log("benchSequelize", times.map((e) => `${e}ms`).join(" "));
		const sum = times.reduce((a, b) => a + b, 0);
		const avg = (sum / times.length) || 0;

		console.log("benchSequelize", avg + "ms");
	}

	{
		const times = [];

		for (let index = 0; index < 10; index++) {
			const time = await benchTypeorm(queryCount, {
				database: config.DB_POSTGRE_DATABASE,
				host: config.DB_POSTGRE_HOST,
				password: config.DB_POSTGRE_PASSWORD,
				port: config.DB_POSTGRE_PORT,
				user: config.DB_POSTGRE_USER,
			});

			times.push(time);
		}

		console.log("benchTypeorm", times.map((e) => `${e}ms`).join(" "));
		const sum = times.reduce((a, b) => a + b, 0);
		const avg = (sum / times.length) || 0;

		console.log("benchTypeorm", avg + "ms");
	}

	{
		const times = [];

		for (let index = 0; index < 10; index++) {
			const time = await benchMikroOrm(queryCount, {
				database: config.DB_POSTGRE_DATABASE,
				host: config.DB_POSTGRE_HOST,
				password: config.DB_POSTGRE_PASSWORD,
				port: config.DB_POSTGRE_PORT,
				user: config.DB_POSTGRE_USER,
			});

			console.log(time);

			times.push(time);
		}

		console.log("benchMikroOrm", times.map((e) => `${e}ms`).join(" "));
		const sum = times.reduce((a, b) => a + b, 0);
		const avg = (sum / times.length) || 0;

		console.log("benchMikroOrm", avg + "ms");
	}
}
