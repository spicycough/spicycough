import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ContentItemSummaryKind = {
	mini: "mini",
	short: "short",
	long: "long",
	paragraph: "paragraph",
};

export const contentItemSummaries = sqliteTable("content_item_summaries", {
	contentItemId: integer("content_item_id").primaryKey(),
	kind: text("kind", {
		mode: "text",
		enum: Object.values(ContentItemSummaryKind) as [string, ...string[]],
	}).notNull(),
});
