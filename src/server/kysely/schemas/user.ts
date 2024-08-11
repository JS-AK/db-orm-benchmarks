import {
	Generated,
	Insertable,
	Selectable,
	Updateable,
} from "kysely";

export interface UsersTable {
	id: Generated<string>;

	id_user_role: string;

	email: string;
	first_name: string;
	last_name: string | null;
	password: string;
	salt: string;

	deleted_at: string | null;
	is_deleted: boolean;

	created_at: string;
	updated_at: string | null;
}
export type User = Selectable<UsersTable>;
export type UserCreate = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;
