/* eslint-disable no-console */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { walk } from "./helpers.js";

type TFile = { fileName: string; filePath: string; timestamp: number; type: "sql" | "js"; };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function start(pool: any, settings: {
	pathToSQL?: string;
	pathToJS?: string;
	migrationsTableName: string;
}) {
	try {
		const files: TFile[] = [];
		const jsFiles = settings.pathToJS ? await walk(settings.pathToJS) : [];
		const sqlFiles = settings.pathToSQL ? await walk(settings.pathToSQL) : [];

		for (const file of sqlFiles) {
			const fileNameBase = path.parse(file).base;

			files.push({
				fileName: fileNameBase,
				filePath: file,
				timestamp: parseInt(fileNameBase.split("_")[0] || ""),
				type: "sql",
			});
		}

		for (const file of jsFiles) {
			const fileNameBase = path.parse(file).base;

			if (fileNameBase.split(".js").length === 1) continue;
			files.push({
				fileName: fileNameBase,
				filePath: file,
				timestamp: parseInt(fileNameBase.split("_")[0] || ""),
				type: "js",
			});
		}

		if (!files.length) throw new Error("pathToJS and pathToSQL is empty");

		const sortedByTimestamp = files.sort((a, b) => {
			if (a.timestamp > b.timestamp) return 1;
			if (a.timestamp < b.timestamp) return -1;

			return 0;
		});

		let error = false;

		const migrations: string[] = [];

		try {
			migrations
				.push(
					...(await pool.query(`SELECT * FROM ${settings.migrationsTableName}`))
						.rows
						.map((e: { title: string; }) => e.title),
				);
		} catch (err) {
			error = true;

			await pool.query(`
				CREATE TABLE ${settings.migrationsTableName}(
				  id                              BIGSERIAL PRIMARY KEY,
				  title                           TEXT NOT NULL UNIQUE,
				  created_at                      TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
				  updated_at                      TIMESTAMP WITHOUT TIME ZONE
				)
			`);
		}

		for (const file of sortedByTimestamp) {
			if (file.type === "sql") {
				const { fileName, filePath } = file;

				if (error) {
					const sql = fs.readFileSync(filePath).toString();

					await pool.query(sql);
					await pool.query(`INSERT INTO ${settings.migrationsTableName} (title) VALUES ('${fileName}')`);

					console.log(`${fileName} done!`);
				} else {
					if (!migrations.includes(fileName)) {
						const sql = fs.readFileSync(filePath).toString();

						await pool.query(sql);
						await pool.query(`INSERT INTO ${settings.migrationsTableName} (title) VALUES ('${fileName}')`);

						console.log(`${fileName} done!`);
					}
				}
			} else if (file.type === "js") {
				const { fileName, filePath } = file;

				if (!migrations.includes(fileName)) {
					const file = os.platform() === "win32"
						? await import("file://" + filePath)
						: await import(filePath);
					const { error, message } = await file.up(pool);

					if (!error) {
						await pool.query(`INSERT INTO ${settings.migrationsTableName} (title) VALUES ('${fileName}')`);
						console.log(`${fileName} done!`);
					} else {
						console.error(`${fileName} not done!`);
						console.error(message);

						throw new Error(message);
					}
				}
			}
		}
		console.log("All done!");
	} catch (error) {
		console.error(error);

		throw error;
	}
}
