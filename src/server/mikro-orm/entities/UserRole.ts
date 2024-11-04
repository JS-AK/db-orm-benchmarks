/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/indent */
import {
	Entity,
	PrimaryKey,
	Property,
} from "@mikro-orm/core";

@Entity({ tableName: "user_roles" })
export class UserRole {
	@PrimaryKey({ name: "id" })
	id: string;

	@Property({ name: "title" })
	title: string;
}
