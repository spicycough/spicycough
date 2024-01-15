import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { extractions } from "./extractions";

import { createInsertSchema, createSelectSchema } from "drizzle-typebox";

export const extractedFields = sqliteTable("extracted_fields", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	extractionId: integer("extraction_id")
		.notNull()
		.references(() => extractions.id),
	name: text("name").notNull(),
	value: text("value"),
	cssSelector: text("css_selector").notNull(),
	selectionMethod: text("selection_method", {
		mode: "text",
		enum: ["text", "attr", "prop", "val"],
	})
		.default("text")
		.notNull(),
	isCorrect: integer("is_correct", { mode: "boolean" }).notNull().default(false),
});

export type ExtractedFieldTable = typeof extractions;
export type ExtractedField = InferSelectModel<ExtractedFieldTable>;
export type NewExtractedField = InferInsertModel<ExtractedFieldTable>;

export const insertExtractedFieldSchema = createInsertSchema(extractedFields);
export const selectExtractedFieldSchema = createSelectSchema(extractedFields);
