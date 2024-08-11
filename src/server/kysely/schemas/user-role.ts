import {
	Generated,
	Insertable,
	Selectable,
	Updateable,
} from "kysely";

export interface UserRolesTable {
	id: Generated<string>;

	title: string;

	created_at: string;
	updated_at: string | null;
}

export type UserRole = Selectable<UserRolesTable>;
export type UserRoleCreate = Insertable<UserRolesTable>;
export type UserRoleUpdate = Updateable<UserRolesTable>;
