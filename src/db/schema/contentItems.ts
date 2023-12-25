import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// ContentItem Enums

export const ContentItemKind = {
	ARTICLE: "article",
	REPORT: "report",
	STUDY: "study",
	THREAD: "thread",
};
export type ContentItemKind = (typeof ContentItemKind)[keyof typeof ContentItemKind];

// ContentItemQueue

export const contentItemQueue = sqliteTable("content_item_queue", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	sourceUrl: text("source_url").notNull(),
	queuedAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export type ContentItemQueueTable = typeof contentItemQueue;
export type ContentItemQueue = InferSelectModel<ContentItemQueueTable>;
export type NewContentItemQueue = InferInsertModel<ContentItemQueueTable>;

// ContentItemStaging

export const contentItemStaging = sqliteTable("content_item_staging", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	kind: text("content_kind", {
		mode: "text",
		enum: Object.values(ContentItemKind) as [string, ...string[]],
	}).notNull(),
	title: text("title").notNull(),
	authors: text("authors"),
	sourceUrl: text("source_url").notNull(),
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

// ContentItem

export type ContentItemId = number;
export const contentItems = sqliteTable("content_items", {
	id: integer("id").$type<ContentItemId>().primaryKey({ autoIncrement: true }),
	kind: text("content_kind", {
		mode: "text",
		enum: Object.values(ContentItemKind) as [string, ...string[]],
	}).notNull(),
	title: text("title").notNull(),
	authors: text("authors"),
	sourceUrl: text("source_url").notNull(),
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
