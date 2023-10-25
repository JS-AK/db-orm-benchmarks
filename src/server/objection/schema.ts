import * as Knex from "knex";
import { Model } from "objection";

export const init = async (config: {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
}) => {
	const orm = Knex.default({
		client: "postgresql",
		connection: {
			host: config.host,
			port: config.port,
			user: config.user,
			password: config.password,
			database: config.database,
		},
	});

	Model.knex(orm);

	return { orm };
};
