import {
	Generated,
	Insertable,
	Kysely,
	PostgresDialect,
	Selectable,
	Updateable,
} from "kysely";
import PG from "pg";

export interface Database {
	users: UsersTable;
}

export interface UsersTable {
	id: Generated<string>;

	email: string;
	first_name: string;
	last_name: string | null;
	is_deleted: boolean;
	password: string;
	salt: string;
}

export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type PersonUpdate = Updateable<UsersTable>;

export const init = async (config: {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
}) => {
	const dialect = new PostgresDialect({
		pool: new PG.Pool(config),
	});

	const db = new Kysely<Database>({
		dialect,
	});

	return { db };
};
