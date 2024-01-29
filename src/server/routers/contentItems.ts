import { Type } from "@sinclair/typebox";
import * as drizzle from "drizzle-orm";

import {
	ContentItemKind,
	insertContentItemSchema,
	type NewContentItem,
	selectContentItemSchema,
} from "@/db/schema";
import type { ExtractResults } from "@/lib/seki/types";
// const standardizeDate = (date: string) => {
// 	const dateObj = new Date(date);
// 	return `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}`;
// };
// async function oldExtractContentItem(url: string): Promise<NewContentItem> {
// 	const { results } = await useExtract(url);
// 	const { content, metadata } = results;
// 	const findFirst = (results: ExtractResults) => {
// 		return results.find(({ value }) => !!value || typeof value === "undefined");
// 	};
// 	const abstract = findFirst(content.abstract)?.value?.toString();
// 	if (!abstract) throw new Error(`Could not extract abstract from ${url}`);
// 	const title = findFirst(metadata.title)?.value?.toString();
// 	if (!title) throw new Error(`Could not extract title from ${url}`);
// 	const authors = findFirst(metadata.authors)?.value;
// 	if (!authors) throw new Error(`Could not extract authors from ${url}`);
// 	const imageUrl = findFirst(metadata.imageUrl)?.value?.toString();
// 	if (!imageUrl) throw new Error(`Could not extract image url from ${url}`);
// 	const rawPublishedAt = findFirst(metadata.publishedAt)?.value?.toString();
// 	if (!rawPublishedAt) throw new Error(`Could not extract published at from ${url}`);
// 	const publishedAt = new Date(rawPublishedAt);
// 	return {
// 		kind: ContentItemKind.ARTICLE,
// 		permalink: url,
// 		title,
// 		authors,
// 		imageUrl,
// 		publishedAt,
// 		abstract,
// 		fullText: content.fullText,
// 		slug: slugify(title),
// 	};
// }
import { useExtract } from "@/lib/seki/use-extract";
import { slugify } from "@/lib/utils";
import { head, RpcType } from "@/server/utils";

import { publicProcedure, router } from "../router";

const extractContentItem = async (url: string): Promise<NewContentItem> => {
	const { content, metadata } = await useExtract(url);

	const extractedContentItem: NewContentItem = {
		kind: ContentItemKind.ARTICLE,
		permalink: metadata.url ?? "",
		title: metadata.title ?? "",
		authors: [metadata.authors ?? ""],
		imageUrl: metadata.image ?? "",
		publishedAt: metadata.date ? new Date(metadata.date) : new Date(),
		abstract: metadata.description ?? "",
		fullText: content,
		slug: slugify(metadata.title ?? ""),
	};

	console.log(extractedContentItem);

	return extractedContentItem;
};

export const contentItemRouter = () => {
	return router({
		/** QUERIES **/

		/**
		 * GET /content_items
		 *
		 * Returns all content items.
		 * */
		all: publicProcedure.query(
			async ({ ctx: { db, schema } }) => await db.select().from(schema.contentItems),
		),

		/**
		 * GET /content_items/:id
		 *
		 * Returns the content item with the given id.
		 */
		byId: publicProcedure
			.input(RpcType(selectContentItemSchema.properties["id"]))
			.query(async ({ ctx: { db, schema }, input: id }) =>
				head(
					await db
						.select()
						.from(schema.contentItems)
						.where(drizzle.eq(schema.contentItems.id, id))
						.execute(),
				),
			),

		/**
		 * GET /content_items/count
		 *
		 * Returns the total number of content items.
		 */
		count: publicProcedure.input(RpcType(selectContentItemSchema)).query(
			async ({ ctx: { db, schema } }) =>
				head(
					await db
						.select({ count: drizzle.count(schema.contentItems.id) })
						.from(schema.contentItems)
						.execute(),
				)?.count,
		),

		/** SINGLE MUTATIONS **/

		/**
		 * POST /content_items
		 *
		 * Creates a new content item.
		 */
		create: publicProcedure
			.input(RpcType(insertContentItemSchema.properties["permalink"]))
			.mutation(
				async ({ ctx: { db, schema }, input: url }) =>
					await db.insert(schema.contentItems).values(await extractContentItem(url)),
			),

		/**
		 * DELETE /content_items/:id
		 *
		 * Delete the content item with the given id.
		 */
		remove: publicProcedure
			.input(RpcType(selectContentItemSchema.properties["id"]))
			.mutation(
				async ({ ctx: { db, schema }, input: id }) =>
					await db.delete(schema.contentItems).where(drizzle.eq(schema.contentItems.id, id)),
			),

		/**
		 * PATCH /content_items/:id
		 *
		 * Update the content item with the given id.
		 */
		update: publicProcedure
			.input(RpcType(insertContentItemSchema))
			.mutation(async ({ ctx: { db, schema }, input }) =>
				head(
					await db
						.update(schema.contentItems)
						.set(input)
						.where(drizzle.eq(schema.contentItems.id, input.id!))
						.returning(),
				),
			),

		/** BULK MUTATIONS **/

		/**
		 * POST /content_items/bulk
		 *
		 * Creates a new content item.
		 */
		bulkCreate: publicProcedure
			.input(RpcType(Type.Array(insertContentItemSchema.properties["permalink"])))
			.mutation(async ({ ctx: { db, schema }, input: urls }) => {
				const contentItem = await Promise.all(urls.map(async (url) => extractContentItem(url)));
				return await db.insert(schema.contentItems).values(contentItem);
			}),

		/**
		 * PATCH /content_items/bulk
		 *
		 * Bulk update existing content items.
		 */
		patch: publicProcedure
			.input(RpcType(Type.Partial(insertContentItemSchema)))
			.mutation(async ({ ctx: { db, schema }, input }) =>
				head(
					await db
						.update(schema.contentItems)
						.set(input)
						.where(drizzle.eq(schema.contentItems, input.id))
						.returning(),
				),
			),

		/**
		 * PUT /content_items/bulk
		 *
		 * Bulk refresh existing content items.
		 */
		refresh: publicProcedure
			.input(RpcType(selectContentItemSchema.properties["id"]))
			.mutation(async ({ ctx: { db, schema }, input: id }) => {
				const existing = head(
					await db.select().from(schema.contentItems).where(drizzle.eq(schema.contentItems.id, id)),
				);
				if (!existing) {
					throw new Error(`Content item with ID ${id} does not exist.`);
				}

				const extract = await extractContentItem(existing.permalink);

				return await db
					.update(schema.contentItems)
					.set(extract)
					.where(drizzle.eq(schema.contentItems.id, id))
					.returning();
			}),

		/**
		 * DELETE /content_items/bulk
		 *
		 * Delete all existing content items.
		 */
		removeAll: publicProcedure
			.input(RpcType(Type.Void()))
			// eslint-disable-next-line drizzle/enforce-delete-with-where
			.mutation(async ({ ctx: { db, schema } }) => await db.delete(schema.contentItems)),
	});
};
