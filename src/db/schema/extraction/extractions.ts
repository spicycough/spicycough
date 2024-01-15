import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { createInsertSchema, createSelectSchema } from "drizzle-typebox";

export const extractions = sqliteTable("extractions", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	urlId: integer("url_id").notNull(),
	createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type ExtractionTable = typeof extractions;
export type Extraction = InferSelectModel<ExtractionTable>;
export type NewExtraction = InferInsertModel<ExtractionTable>;

export const insertExtractionSchema = createInsertSchema(extractions);
export const selectExtractionSchema = createSelectSchema(extractions);
