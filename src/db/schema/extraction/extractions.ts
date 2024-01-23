import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";

import type { NanoId } from "@/db/types";

import { extractedFields } from "./fields";
import { extractedUrls } from "./urls";

export const extractions = sqliteTable(
	"extractions",
	{
		attempt: integer("attempt"),
		fieldId: text("field_id")
			.$type<NanoId>()
			.notNull()
			.references(() => extractedFields.id),
		urlId: text("url_id")
			.$type<NanoId>()
			.notNull()
			.references(() => extractedUrls.id),
		isCorrect: integer("is_correct", { mode: "boolean" }).default(false),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.attempt, table.fieldId, table.urlId] }),
	}),
);

export type ExtractionTable = typeof extractions;
export type Extraction = InferSelectModel<ExtractionTable>;
export type NewExtraction = InferInsertModel<ExtractionTable>;

export const insertExtractionSchema = createInsertSchema(extractions);
export const selectExtractionSchema = createSelectSchema(extractions);
