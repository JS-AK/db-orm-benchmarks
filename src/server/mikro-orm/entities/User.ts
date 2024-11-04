/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/indent */
import {
	Entity,
	PrimaryKey,
	Property,
} from "@mikro-orm/core";

@Entity({ tableName: "users" })
export class User {
	@PrimaryKey({ name: "id" })
	id: string;

	@Property({ name: "id_user_role" })
	idUserRole: string;

	@Property({ name: "email" })
	email: string;

	@Property({ name: "first_name" })
	firstName: string;

	@Property({ name: "last_name" })
	lastName: string;

	@Property({ name: "is_deleted" })
	isDeleted: boolean;

	@Property({ name: "password", nullable: true })
	password: string | null;

	@Property({ name: "salt", nullable: true })
	salt: string | null;
}
