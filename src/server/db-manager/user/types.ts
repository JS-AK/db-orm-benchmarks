export type CreateFields = Pick<TableFields,
	| "email"
	| "first_name"
	| "is_deleted"
	| "id_user_role"
	| "last_name"
>;

export type SearchFields = Partial<TableFields>;

export type TableFields = {
	created_at: string;
	email: string | null;
	first_name: string | null;
	id: string;
	id_user_role: string | null;
	is_deleted: boolean;
	last_name: string | null;
	password: string | null;
	salt: string | null;
	updated_at: string | null;
};

export type TableKeys = keyof TableFields;

export type UpdateFields = Partial<Pick<TableFields,
	| "email"
	| "first_name"
	| "id_user_role"
	| "is_deleted"
	| "last_name"
	| "password"
	| "salt"
>>;
