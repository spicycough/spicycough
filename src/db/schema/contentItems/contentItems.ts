import { Type } from "@sinclair/typebox";
import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { nanoid } from "nanoid";

export const ContentItemKind = {
	ARTICLE: "article",
	REPORT: "report",
	STUDY: "study",
	THREAD: "thread",
} as const;

export type ContentItemKind = (typeof ContentItemKind)[keyof typeof ContentItemKind];

export const ContentItemKinds: [ContentItemKind, ...ContentItemKind[]] = Object.values(
	ContentItemKind,
) as [ContentItemKind, ...ContentItemKind[]];

export type ContentItemId = number;

export const contentItems = sqliteTable("content_items", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid()),
	kind: text("kind", {
		enum: ContentItemKinds,
	}).default(ContentItemKind.ARTICLE),
	permalink: text("permalink").notNull(),
	title: text("title").notNull(),
	authors: text("authors", { mode: "json" }).$type<string[]>(),
	imageUrl: text("image_url"),
	abstract: text("abstract"),
	fullText: text("full_text"),
	slug: text("slug").notNull(),
	publishedAt: integer("published_at", { mode: "timestamp" }).notNull(),
	// createdAt: integer("created_at", { mode: "timestamp_ms" })
	// 	.$default(() => new Date())
	// 	.$type<Date>(),
	// updatedAt: integer("updated_at", { mode: "timestamp_ms" })
	// 	.$default(() => new Date())
	// 	.$type<Date>(),
});

export type ContentItemTable = typeof contentItems;
export type ContentItem = InferSelectModel<ContentItemTable>;
export type NewContentItem = InferInsertModel<ContentItemTable>;

export const insertContentItemSchema = createInsertSchema(contentItems, {
	id: Type.String(),
	authors: Type.Array(Type.String()),
});

export const selectContentItemSchema = createSelectSchema(contentItems, {
	id: Type.String(),
	authors: Type.Array(Type.String()),
});
