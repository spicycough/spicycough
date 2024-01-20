import { Type } from "@sinclair/typebox";
import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { nanoid } from "nanoid";

export const ContentItemKind = {
	ARTICLE: "article",
	REPORT: "report",
	STUDY: "study",
	THREAD: "thread",
} as const;

export const ContentItemKinds = Object.values(ContentItemKind) as [string, ...string[]];

export type ContentItemKind = (typeof ContentItemKind)[keyof typeof ContentItemKind];

export type ContentItemId = number;

export const contentItems = sqliteTable("content_items", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid()),
	kind: text("kind", {
		mode: "text",
		enum: ContentItemKinds,
	})
		.default(ContentItemKind.ARTICLE)
		.notNull(),
	permalink: text("permalink").notNull(),
	title: text("title").notNull(),
	authors: text("authors", { mode: "json" }),
	imageUrl: text("image_url"),
	abstract: text("abstract"),
	fullText: text("full_text"),
	slug: text("slug").notNull(),
	publishedAt: integer("published_at", { mode: "timestamp" }).notNull(),
	createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type ContentItemTable = typeof contentItems;
export type ContentItem = InferSelectModel<ContentItemTable>;
export type NewContentItem = InferInsertModel<ContentItemTable>;

export const insertContentItemSchema = createInsertSchema(contentItems, {
	id: Type.String(),
});
export const selectContentItemSchema = createSelectSchema(contentItems);
