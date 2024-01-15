import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { createInsertSchema, createSelectSchema } from "drizzle-typebox";

export const urls = sqliteTable("urls", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	url: text("url").notNull(),
	createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type UrlTable = typeof urls;
export type Url = InferSelectModel<UrlTable>;
export type NewUrl = InferInsertModel<UrlTable>;

export const insertUrlSchema = createInsertSchema(urls);
export const selectUrlSchema = createSelectSchema(urls);
