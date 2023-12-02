import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ContentItemType = ["article", "report", "study", "thread"] as const;

export type ContentItemId = number & { __brand: number };

export const contentItems = sqliteTable("content_items", {
	id: integer("id").$type<ContentItemId>().primaryKey({ autoIncrement: true }),
	type: text("content_type", { mode: "text", enum: ContentItemType }).notNull(),
	title: text("title").notNull(),
	author: text("author"),
	sourceUrl: text("source_url").notNull(),
	abstract: text("abstract"),
	fullText: text("full_text"),
	slug: text("slug").notNull(),
	publishedAt: text("published_at").notNull(),
	createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type ContentItem = InferSelectModel<typeof contentItems>;

export type NewContentItem = InferInsertModel<typeof contentItems>;
