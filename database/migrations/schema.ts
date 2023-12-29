import { sqliteTable, AnySQLiteColumn, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const contentItems = sqliteTable("content_items", {
	id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
	contentType: text("content_type").notNull(),
	title: text("title").notNull(),
	author: text("author"),
	publicationDate: text("publication_date").notNull(),
	permalink: text("source_url").notNull(),
	abstract: text("abstract"),
	fullText: text("full_text"),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`"),
	updatedAt: text("updated_at").default("sql`(CURRENT_TIMESTAMP)`"),
});
