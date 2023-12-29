import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contentItemSummaries = sqliteTable("content_item_summaries", {
	contentItemId: integer("content_item_id").primaryKey(),
	mini: text("mini").notNull(),
	short: text("short").notNull(),
	long: text("long").notNull(),
	paragraph: text("paragraph").notNull(),
});
