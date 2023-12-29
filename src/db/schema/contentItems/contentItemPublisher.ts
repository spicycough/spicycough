import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contentItemPublishers = sqliteTable("content_item_publishers", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("publisher").notNull(),
});
