import { PG } from "@js-ak/db-manager";

import * as User from "./user/domain.js";

export const bench = async (queryCount: number, config: {
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

	const start = performance.now();

	for (let i = 0; i < queryCount; i++) {
		const randomUserId = users[getRandomInt(1, users.length - 1)]?.id as string;

		promises.push(
			user.getOneByParams({
				params: { id: randomUserId },
				selected: ["email"],
			}),
		);
	}

	await Promise.all(promises);

	const execTime = Math.round(performance.now() - start);

	await PG.BaseModel.removeStandardPool(config);

	return execTime;
};

export const benchOneByOne = async (queryCount: number, config: {
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

	const start = performance.now();

	for (let i = 0; i < queryCount; i++) {
		const randomUserId = users[getRandomInt(1, users.length - 1)]?.id as string;

		promises.push(
			user.getOneByParams({
				params: { id: randomUserId },
				selected: ["email"],
			}),
		);
	}

	for (const promise of promises) await promise;

	const execTime = Math.round(performance.now() - start);

	await PG.BaseModel.removeStandardPool(config);

	return execTime;
};
