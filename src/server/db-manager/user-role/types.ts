export type CreateFields = Pick<TableFields,
	| "title"
>;

export type SearchFields = Partial<TableFields>;

export type TableFields = {
	id: string;

	title: string;

	created_at: string;
	updated_at: string | null;
};

export type TableKeys = keyof TableFields;

export type UpdateFields = Partial<Pick<TableFields,
	| "title"
>>;
