import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contentItemStaging = sqliteTable("content_item_staging", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	kind: text("content_kind", {
		mode: "text",
		enum: Object.values(ContentItemKind) as [string, ...string[]],
	}).notNull(),
	title: text("title").notNull(),
	authors: text("authors"),
	permalink: text("source_url").notNull(),
	abstract: text("abstract"),
	fullText: text("full_text"),
	slug: text("slug").notNull(),
	publishedAt: text("published_at").notNull(),
	createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type ContentItemStagingTable = typeof contentItemStaging;
export type ContentItemStaging = InferSelectModel<ContentItemStagingTable>;
export type NewContentItemStaging = InferInsertModel<ContentItemStagingTable>;
