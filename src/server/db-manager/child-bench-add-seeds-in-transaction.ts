import { PG } from "@js-ak/db-manager";

import * as User from "./user/index.js";

type Config = { host: string; port: number; user: string; password: string; database: string; };

const start = async (queryCount: number, config: Config): Promise<number> => {
	const user = new User.Domain.default(config);

	const userExists = await user.getArrByParams({
		pagination: { limit: 1, offset: 1 },
		params: {},
		selected: ["id"],
	});

	if (userExists.length) await user.deleteAll();

	const userRole = new User.Domain.default(config);

	const userRoles = await userRole.getArrByParams({
		params: {},
		selected: ["id"],
	});

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

	const totalUsers = queryCount;

	const start = performance.now();

	const tPool = PG.BaseModel.getTransactionPool(config);
	const client = await tPool.connect();

	try {
		await client.query("BEGIN");

		for (let idx = 0; idx < totalUsers; idx++) {
			const randomEmail = generateRandomEmail();
			const randomFirstName = getRandomFirstName();
			const randomLastName = getRandomLastName();

			const { query, values } = PG.BaseModel
				.getInsertFields<
					User.Types.CreateFields,
					User.Types.TableKeys
				>({
					params: {
						email: randomEmail,
						first_name: randomFirstName as string,
						id_user_role: getUserRoleId() as string,
						last_name: randomLastName as string,
					},
					returning: ["id"],
					tableName: user.tableName,
				});

			await client.query<{ id: string; }>(query, values);
		}

		// commit transaction now:
		await client.query("COMMIT");
	} catch (err) {
		// since we have errors let's rollback changes we made
		await client.query("ROLLBACK");
	} finally {
		client.release();
	}

	const execTime = Math.round(performance.now() - start);

	await PG.BaseModel.removeStandardPool(config);
	await PG.BaseModel.removeTransactionPool(config);

	return execTime;
};

process.on("message", async (message: { config: Config; queryCount: number; }) => {
	const { config, queryCount } = message;
	const execTime = await start(queryCount, config);

	if (process.send) process.send(execTime);
});
