import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { contentItems } from "./contentItems";

export const ContentItemSummaryKind = {
	mini: "mini",
	short: "short",
	long: "long",
	paragraph: "paragraph",
} as const;

const ContentItemSummaryKinds = Object.values(ContentItemSummaryKind) as [string, ...string[]];

export type ContentItemSummaryKind =
	(typeof ContentItemSummaryKind)[keyof typeof ContentItemSummaryKind];

export const contentItemSummaries = sqliteTable("content_item_summaries", {
	contentItemId: text("content_item_id").references(() => contentItems.id),
	kind: text("kind", {
		mode: "text",
		enum: ContentItemSummaryKinds,
	}).notNull(),
});
