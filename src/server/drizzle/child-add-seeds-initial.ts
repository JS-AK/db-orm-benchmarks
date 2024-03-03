import PG from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import * as Schemas from "./schemas/index.js";

type Config = { host: string; port: number; user: string; password: string; database: string; };

const start = async (config: Config): Promise<number> => {
	const pool = new PG.Pool(config);

	const db = drizzle(pool);

	const userExists = await db
		.select({ id: Schemas.users.id })
		.from(Schemas.users)
		.limit(1);

	if (userExists.length) {
		await pool.end();

		return 0;
	}

	const userRoles = await db
		.select({ id: Schemas.userRoles.id })
		.from(Schemas.userRoles);

	function getUserRoleId() {
		const randomIndex = Math.floor(Math.random() * userRoles.length);

		return userRoles[randomIndex]?.id;
	}

	const domains = ["example.com", "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "mail.ru", "yandex.ru", "icloud.com"];

	function generateRandomEmail() {
		const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		let email = "";

		const emailLength = Math.floor(Math.random() * (10 - 5 + 1)) + 7;

		for (let i = 0; i < emailLength; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);

			email += characters[randomIndex];
		}

		const randomDomainIndex = Math.floor(Math.random() * domains.length);
		const domain = domains[randomDomainIndex];

		email += `@${domain}`;

		return email;
	}

	const firstNames = ["John", "Jane", "Michael", "Emily", "David", "Sarah", "Daniel", "Olivia", "William", "Sophia", "Matthew", "Ella", "Christopher", "Ava", "Andrew", "Grace", "James", "Chloe", "Benjamin", "Lily", "Joseph", "Mia", "Robert", "Charlotte"];

	function getRandomFirstName() {
		const randomIndex = Math.floor(Math.random() * firstNames.length);

		return firstNames[randomIndex];
	}

	const lastNames = ["Smith", "Johnson", "Brown", "Davis", "Wilson", "Anderson", "Lee", "Clark", "Taylor", "Moore", "White", "Hall", "Thomas", "Harris", "Martin", "Jackson", "Thompson", "Garcia", "Martinez", "Lopez", "Hernandez", "Young", "King", "Wright"];

	function getRandomLastName() {
		const randomIndex = Math.floor(Math.random() * lastNames.length);

		return lastNames[randomIndex];
	}

	async function insertUsersInBatches(
		totalUsers: number,
		batchSize: number,
	) {
		const batchPromises = [];

		for (let i = 0; i < totalUsers; i += batchSize) {
			const batchInserts = [];

			for (let j = 0; j < batchSize; j++) {
				const randomEmail = generateRandomEmail();
				const randomFirstName = getRandomFirstName();
				const randomLastName = getRandomLastName();

				batchInserts.push({
					isDeleted: false,
					userRoleId: getUserRoleId() as string,
					email: randomEmail,
					firstName: randomFirstName,
					last_name: randomLastName,
				});
			}

			batchPromises.push(db.insert(Schemas.users).values(batchInserts));
		}

		await Promise.all(batchPromises);
	}

	const totalUsers = 1_000_000;
	const batchSize = 10;

	await insertUsersInBatches(totalUsers, batchSize);

	// eslint-disable-next-line no-console
	console.log("Seeders inserted successfully to database " + config.database);

	await pool.end();

	return 0;
};

process.on("message", async (message: { config: Config; }) => {
	const { config } = message;

	const code = await start(config);

	if (process.send) process.send(code);
});