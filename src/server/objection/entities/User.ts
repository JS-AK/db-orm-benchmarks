import { Model } from "objection";

export class User extends Model {
	id!: string;
	email!: string;
	first_name!: string;
	last_name!: string;
	is_deleted!: boolean;
	password!: string;
	salt!: string;

	static get tableName() {
		return "users";
	}

	static get idColumn() {
		return "id";
	}
}
