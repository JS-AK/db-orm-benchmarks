import { User } from "./entities/User.js";
import { UserRole } from "./entities/UserRole.js";
import { init } from "./schema.js";

import {
	generateRandomEmail,
	getRandomFirstName,
	getRandomLastName,
	getUserRoleId,
} from "../helpers/index.js";

type Config = { host: string; port: number; user: string; password: string; database: string; };

const start = async (queryCount: number, config: Config): Promise<number> => {
	const { orm } = await init(config);

	const promises = [];

	const userRolesIds = (await orm.em.fork()
		.getRepository(UserRole)
		.find({}, { fields: ["id"] }))
		.map((e) => e.id);

	const start = performance.now();

	for (let idx = 0; idx < queryCount; idx++) {
		const randomEmail = generateRandomEmail();
		const randomFirstName = getRandomFirstName();
		const randomLastName = getRandomLastName();

		promises.push(
			() => {
				const user = new User();

				user.id = crypto.randomUUID();
				user.idUserRole = getUserRoleId(userRolesIds);
				user.email = randomEmail;
				user.firstName = randomFirstName;
				user.lastName = randomLastName;
				user.isDeleted = false;
				user.salt = null;
				user.password = null;

				return orm.em.fork().persistAndFlush(user).then(() => user);
			},
		);
	}

	const users = await Promise.all(promises.map((e) => e()));

	const execTime = Math.round(performance.now() - start);

	await orm.em.fork()
		.getRepository(User)
		.nativeDelete({ id: { $in: users.map((e) => e.id) } });

	await orm.close();

	return execTime;
};

process.on("message", async (message: { config: Config; queryCount: number; }) => {
	const { config, queryCount } = message;
	const execTime = await start(queryCount, config);

	if (process.send) process.send(execTime);
});
