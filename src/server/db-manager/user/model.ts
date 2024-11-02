import { PG } from "@js-ak/db-manager";

export const model = (creds: PG.ModelTypes.TDBCreds) => new PG.Model.BaseTable(
	{
		createField: { title: "created_at", type: "timestamp" },
		primaryKey: "id",
		tableFields: [
			"id",

			"id_user_role",

			"email",
			"first_name",
			"last_name",
			"password",
			"salt",

			"deleted_at",
			"is_deleted",

			"created_at",
			"updated_at",
		],
		tableName: "users",
		updateField: { title: "updated_at", type: "timestamp" },
	},
	creds,
);
