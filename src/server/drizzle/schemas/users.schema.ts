import {
	boolean,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import * as Schemas from "./index.js";

export const users = pgTable("users", {
	createdAt: timestamp("created_at"),
	id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
	userRoleId: uuid("id_user_role").notNull().references(() => Schemas.userRoles.id, { onDelete: "cascade" }),
	email: text("email"),
	firstName: text("first_name"),
	lastName: text("last_name"),
	isDeleted: boolean("is_deleted").notNull(),
	password: text("password"),
	salt: text("salt"),
	updatedAt: timestamp("updated_at"),
});
