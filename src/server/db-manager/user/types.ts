export type CreateFields = Pick<TableFields,
	| "id_user_role"

	| "email"
	| "first_name"
	| "last_name"
>;

export type SearchFields = Partial<TableFields>;

export type TableFields = {
	id: string;

	id_user_role: string | null;

	email: string | null;
	first_name: string | null;
	last_name: string | null;
	password: string | null;
	salt: string | null;

	deleted_at: string | null;
	is_deleted: boolean;

	created_at: string;
	updated_at: string | null;
};

export type TableKeys = keyof TableFields;

export type UpdateFields = Partial<Pick<TableFields,
	| "id_user_role"

	| "email"
	| "first_name"
	| "last_name"
	| "password"
	| "salt"

	| "deleted_at"
	| "is_deleted"
>>;
