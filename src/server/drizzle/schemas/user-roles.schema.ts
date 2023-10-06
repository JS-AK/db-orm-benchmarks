import {
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const userRoles = pgTable("user_roles", {
	createdAt: timestamp("created_at").default(sql`now()`),
	id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
	title: text("title"),
	updatedAt: timestamp("updated_at"),
});
