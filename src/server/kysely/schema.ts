import { Kysely, PostgresDialect } from "kysely";

import PG from "pg";

import * as Schema from "./schemas/index.js";

export interface Database {
	users: Schema.UsersTable;
	["user-roles"]: Schema.UserRolesTable;
}

export const init = async (config: {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
}) => {
	const dialect = new PostgresDialect({ pool: new PG.Pool(config) });
	const db = new Kysely<Database>({ dialect });

	return { db };
};
