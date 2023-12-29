import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { Type } from "@sinclair/typebox";

export const ContentItemKind = {
	ARTICLE: "article",
	REPORT: "report",
	STUDY: "study",
	THREAD: "thread",
};

export type ContentItemKind = (typeof ContentItemKind)[keyof typeof ContentItemKind];

export type ContentItemId = number;

export const contentItems = sqliteTable("content_items", {
	id: integer("id").$type<ContentItemId>().primaryKey({ autoIncrement: true }),
	kind: text("content_kind", {
		mode: "text",
		enum: Object.values(ContentItemKind) as [string, ...string[]],
	}).notNull(),
	title: text("title").notNull(),
	authors: text("authors"),
	permalink: text("permalink").notNull(),
	imageUrl: text("image_url"),
	abstract: text("abstract"),
	fullText: text("full_text"),
	slug: text("slug").notNull(),
	publishedAt: text("published_at").notNull(),
	createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type ContentItemTable = typeof contentItems;
export type ContentItem = InferSelectModel<ContentItemTable>;
export type NewContentItem = InferInsertModel<ContentItemTable>;

// Schema for inserting a user - can be used to validate API requests
export const insertContentItemSchema = createInsertSchema(contentItems);
// Schema for selecting a user - can be used to validate API responses
export const selectContentItemSchema = createSelectSchema(contentItems);
