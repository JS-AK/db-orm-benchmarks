import PG from "pg";

export const benchPg = async (queryCount: number, config: {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
}) => {
	const pool = new PG.Pool(config);

	const promises = [];

	const users = (await pool.query<{ id: string; }>(`
		SELECT id
		FROM users
		LIMIT ${queryCount}
	`)).rows;

	function getRandomInt(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	for (let i = 0; i < queryCount; i++) {
		promises.push(
			pool.query(`
				SELECT
				  email
				FROM
				  users
				WHERE users.id = $1
			`, [users[getRandomInt(0, users.length - 1)]?.id as string]),
		);
	}

	{
		const start = Date.now();

		await Promise.all(promises);
		const execTime = Math.round(Date.now() - start);

		console.log(`PG.pool execTime: ${execTime}ms`);
	}
};
