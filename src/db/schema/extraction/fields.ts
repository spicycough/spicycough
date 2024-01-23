import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { nanoid } from "nanoid";

import type { NanoId } from "@/db/types";

export const extractedFields = sqliteTable("extracted_fields", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid())
		.$type<NanoId>(),
	name: text("name").notNull(),
	value: text("value"),
	cssSelector: text("css_selector").notNull(),
	selectionMethod: text("selection_method", {
		mode: "text",
		enum: ["text", "attr", "prop", "val"],
	}).default("text"),
});

export type ExtractedFieldTable = typeof extractedFields;
export type ExtractedField = InferSelectModel<ExtractedFieldTable>;
export type NewExtractedField = InferInsertModel<ExtractedFieldTable>;

export const insertExtractedFieldSchema = createInsertSchema(extractedFields);
export const selectExtractedFieldSchema = createSelectSchema(extractedFields);
