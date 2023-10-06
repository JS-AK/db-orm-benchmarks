import * as DbManager from "@js-ak/db-manager";

import * as Types from "./types.js";

export class Model extends DbManager.PG.BaseModel {
	constructor(creds: DbManager.PG.ModelTypes.TDBCreds) {
		super(
			{
				createField,
				primaryKey,
				tableFields,
				tableName,
				updateField,
			},
			creds,
		);
	}
}

const tableName = "users";
const primaryKey = "id";
const createField = { title: "created_at", type: "timestamp" } as const;
const updateField = { title: "updated_at", type: "timestamp" } as const;
const tableFields: Types.TableKeys[] = [
	"created_at",
	"email",
	"first_name",
	"id",
	"id_user_role",
	"is_deleted",
	"last_name",
	"password",
	"salt",
	"updated_at",
];

// const queries = {

// };
