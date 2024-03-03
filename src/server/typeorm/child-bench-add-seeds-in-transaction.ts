import {
	User,
	UserRole,
	init,
} from "./schema.js";

type Config = { host: string; port: number; user: string; password: string; database: string; };

const start = async (queryCount: number, config: Config): Promise<number> => {
	const { PostgresDataSource } = await init(config);

	const userExists = await PostgresDataSource.getRepository(User).find({ select: ["id"] });

	if (userExists.length) await PostgresDataSource.getRepository(User).clear();

	const userRoles = await PostgresDataSource.getRepository(UserRole).find({ select: ["id"] });

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

	const queryRunner = PostgresDataSource.createQueryRunner();

	await queryRunner.connect();
	await queryRunner.startTransaction();

	try {
		for (let idx = 0; idx < totalUsers; idx++) {
			const randomEmail = generateRandomEmail();
			const randomFirstName = getRandomFirstName();
			const randomLastName = getRandomLastName();

			await queryRunner.manager.createQueryBuilder()
				.insert()
				.into(User)
				.values({
					isDeleted: false,
					userRoleId: getUserRoleId() as string,
					email: randomEmail,
					firstName: randomFirstName,
					lastName: randomLastName,
				})
				.execute();
		}

		// commit transaction now:
		await queryRunner.commitTransaction();
	} catch (err) {
		// since we have errors let's rollback changes we made
		await queryRunner.rollbackTransaction();
	} finally {
		// you need to release query runner which is manually created:
		await queryRunner.release();
	}

	const execTime = Math.round(performance.now() - start);

	await PostgresDataSource.destroy();

	return execTime;
};

process.on("message", async (message: { config: Config; queryCount: number; }) => {
	const { config, queryCount } = message;
	const execTime = await start(queryCount, config);

	if (process.send) process.send(execTime);
});
