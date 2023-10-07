import { PG } from "@js-ak/db-manager";

import * as User from "./user/domain.js";

export const benchDbManager = async (queryCount: number, config: {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
}) => {
	const user = new User.default(config);

	const promises = [];

	const users = await user.getArrByParams({
		params: {},
		selected: ["id"],
	});

	function getRandomInt(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	for (let i = 0; i < queryCount; i++) {
		promises.push(
			user.getOneByParams({
				params: { id: users[getRandomInt(0, users.length - 1)]?.id as string },
				selected: ["email"],
			}),
		);
	}

	const start = performance.now();

	await Promise.all(promises);
	const execTime = Math.round(performance.now() - start);

	await PG.BaseModel.removeStandardPool(config);

	return execTime;
};
