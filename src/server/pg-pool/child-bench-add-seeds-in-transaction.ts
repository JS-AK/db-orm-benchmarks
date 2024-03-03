import PG from "pg";

type Config = { host: string; port: number; user: string; password: string; database: string; };

const start = async (queryCount: number, config: Config): Promise<number> => {
	const pool = new PG.Pool(config);

	const userExists = (await pool.query<{ id: string; }>("SELECT id FROM users LIMIT 1")).rows;

	if (userExists.length) await pool.query("DELETE FROM users");

	const userRoles = (await pool.query<{ id: string; }>("SELECT id FROM user_roles"))
		.rows
		.map((e) => e.id);

	const totalUsers = queryCount;

	const start = performance.now();

	const client = await pool.connect();

	try {
		await client.query("BEGIN");

		for (let idx = 0; idx < totalUsers; idx++) {
			const randomEmail = generateRandomEmail();
			const randomFirstName = getRandomFirstName();
			const randomLastName = getRandomLastName();

			await client.query(`
				INSERT INTO users(is_deleted, id_user_role, email, first_name, last_name)
				VALUES ($1, $2, $3, $4, $5)
			`, [false, getUserRoleId(userRoles), randomEmail, randomFirstName, randomLastName]);
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

	await pool.end();

	return execTime;
};

function getUserRoleId(userRoles: string[]): string {
	const randomIndex = Math.floor(Math.random() * userRoles.length);

	return userRoles[randomIndex] as string;
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

process.on("message", async (message: { config: Config; queryCount: number; }) => {
	const { config, queryCount } = message;
	const execTime = await start(queryCount, config);

	if (process.send) process.send(execTime);
});
