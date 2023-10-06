/* eslint-disable no-console */

import * as fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

function generateTemplateSQL(): string {
	return "TYPE UR SQL HERE\n";
}

function getCurrentDate(): string {
	const currentDate = new Date();

	const year = currentDate.getFullYear();
	const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
	const day = currentDate.getDate().toString().padStart(2, "0");

	const formattedDate = `${year}-${month}-${day}`;

	return formattedDate;
}

export async function create(): Promise<void> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise<void>((resolve, reject) => {
		rl.question("Enter the filename: ", async (filename) => {
			rl.close();

			const filenamePrepared = Date.now() + "_" + (filename.trim() || "example") + ".sql";
			const pathToParentDirectory = path.resolve(process.cwd(), "src", "migrations", "sql");

			if (
				!fs.existsSync(pathToParentDirectory)
				|| !fs.statSync(pathToParentDirectory).isDirectory()
			) {
				const filename = filenamePrepared;
				const content = generateTemplateSQL();

				try {
					await fs.promises.writeFile(filename, content);
					console.log(`File ${filename} created successfully`);
				} catch (err) {
					console.error("Something went wrong. ", err);
				}
			} else {
				const today = getCurrentDate();
				const pathToTodayDirectory = path.resolve(process.cwd(), "src", "migrations", "sql", today);

				if (
					!fs.existsSync(pathToTodayDirectory)
					|| !fs.statSync(pathToTodayDirectory).isDirectory()
				) {
					fs.mkdirSync(pathToTodayDirectory, { recursive: true });
				}

				const filename = path.resolve(process.cwd(), "src", "migrations", "sql", today, filenamePrepared);
				const content = generateTemplateSQL();

				try {
					await fs.promises.writeFile(filename, content);
					console.log(`File ${filename} created successfully`);

					resolve();
				} catch (err) {
					console.error("Something went wrong. ", err);
					reject(err);
				}
			}
		});
	});
}
