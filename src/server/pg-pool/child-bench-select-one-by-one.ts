import PG from "pg";

type Config = { host: string; port: number; user: string; password: string; database: string; };

const start = async (queryCount: number, config: Config): Promise<number> => {
	const pool = new PG.Pool(config);

	const promises = [];

	const users = (await pool.query<{ id: string; }>("SELECT id FROM users")).rows;

	function getRandomInt(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	const start = performance.now();

	for (let i = 0; i < queryCount; i++) {
		const randomUserId = users[getRandomInt(1, users.length - 1)]?.id as string;

		promises.push(
			() => pool.query(
				"SELECT email FROM users WHERE users.id = $1",
				[randomUserId],
			),
		);
	}

	for (const promise of promises) await promise();

	const execTime = Math.round(performance.now() - start);

	await pool.end();

	return execTime;
};

process.on("message", async (message: { config: Config; queryCount: number; }) => {
	const { config, queryCount } = message;
	const execTime = await start(queryCount, config);

	if (process.send) process.send(execTime);
});
