/* eslint-disable no-console */

import fs from "node:fs";

import { walk } from "./helpers.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function start(pool: any, settings: { pathToSQL: string; }) {
	try {
		const sqlFiles = await walk(settings.pathToSQL);

		for (const file of sqlFiles) {
			const sql = fs.readFileSync(file).toString();

			const tables = sql
				.toLowerCase()
				.replace(/[^a-z0-9,()_; ]/g, " ")
				.replace(/  +/g, " ")
				.trim()
				.split("create table");

			tables.shift();

			if (tables) {
				for (const table of tables) {
					const t = table.trim().split("(")[0];

					await pool.query(`DROP TABLE IF EXISTS ${t} CASCADE`);
					console.log(`DROP TABLE ${t} done!`);
				}
			}

			const types = sql
				.toLowerCase()
				.replace(/[^a-z0-9,()_; ]/g, " ")
				.replace(/  +/g, " ")
				.trim()
				.split("create type");

			types.shift();

			if (types) {
				for (const type of types) {
					const t = type.trim().split("(")[0] || "";
					const v = t.trim().split(" as ");

					if (v.length > 1) {
						console.log(`DROP TYPE ${v[0]} done!`);
						await pool.query(`DROP TYPE IF EXISTS ${v[0]}`);
					} else {
						console.log(`DROP TYPE ${t[0]} done!`);
						await pool.query(`DROP TYPE IF EXISTS ${t[0]}`);
					}
				}
			}
		}

		{
			// FINALLY DROP ALL LEFTOVER TRASH
			const tables = (await pool.query(`
			  SELECT tablename
			  FROM pg_tables
			  WHERE schemaname = 'public'
			`)).rows;

			if (tables.length) {
				for (const table of tables) {
					await pool.query(`DROP TABLE IF EXISTS ${table.tablename} CASCADE`);
					console.log(`DROP TABLE ${table.tablename} done!`);
				}
			}
		}

		console.log("All done!");
	} catch (error) {
		return console.log(error);
	}
}
