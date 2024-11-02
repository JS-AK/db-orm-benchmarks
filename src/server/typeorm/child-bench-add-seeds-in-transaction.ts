import {
	User,
	UserRole,
	init,
} from "./schema.js";

import {
	generateRandomEmail,
	getRandomFirstName,
	getRandomLastName,
	getUserRoleId,
} from "../helpers/index.js";

type Config = { host: string; port: number; user: string; password: string; database: string; };

const start = async (queryCount: number, config: Config): Promise<number> => {
	const { PostgresDataSource } = await init(config);

	const userRolesIds = (await PostgresDataSource.getRepository(UserRole).find({ select: ["id"] })).map((e) => e.id);

	const start = performance.now();

	const queryRunner = PostgresDataSource.createQueryRunner();

	await queryRunner.connect();

	const userIds: string[] = [];

	await queryRunner.startTransaction();

	try {
		for (let idx = 0; idx < queryCount; idx++) {
			const randomEmail = generateRandomEmail();
			const randomFirstName = getRandomFirstName();
			const randomLastName = getRandomLastName();

			const entity = await queryRunner
				.manager
				.getRepository(User)
				.save({
					userRoleId: getUserRoleId(userRolesIds),

					email: randomEmail,
					firstName: randomFirstName,
					lastName: randomLastName,

					isDeleted: false,
				});

			if (entity) userIds.push(entity.id);
		}

		await queryRunner.commitTransaction();
	} catch (err) {
		await queryRunner.rollbackTransaction();
	} finally {
		await queryRunner.release();
	}

	const execTime = Math.round(performance.now() - start);

	await PostgresDataSource.getRepository(User).delete(userIds);

	await PostgresDataSource.destroy();

	return execTime;
};

process.on("message", async (message: { config: Config; queryCount: number; }) => {
	const { config, queryCount } = message;
	const execTime = await start(queryCount, config);

	if (process.send) process.send(execTime);
});
