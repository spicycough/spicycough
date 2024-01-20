import type { NanoId } from "@/db/types";
import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { nanoid } from "nanoid";

export const extractedUrls = sqliteTable("extracted_urls", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid())
		.$type<NanoId>(),
	url: text("url").notNull().unique(),
	createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type ExtractedUrlTable = typeof extractedUrls;
export type Url = InferSelectModel<ExtractedUrlTable>;
export type NewUrl = InferInsertModel<ExtractedUrlTable>;

export const insertExtractedUrlSchema = createInsertSchema(extractedUrls);
export const selectExtractedUrlSchema = createSelectSchema(extractedUrls);
