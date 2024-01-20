import { RpcType, head } from "@/server/utils";
import * as drizzle from "drizzle-orm";
import { publicProcedure, router } from "../router";

import {
	ContentItemKind,
	insertContentItemSchema,
	selectContentItemSchema,
	type NewContentItem,
} from "@/db/schema";
import { useExtract } from "@/lib/seki";
import { slugify } from "@/lib/utils";

import { Type } from "@sinclair/typebox";

async function extractContentItem(url: string): Promise<NewContentItem> {
	const { content, metadata } = await useExtract(url);

	return {
		kind: ContentItemKind.ARTICLE,
		permalink: url,
		title: metadata.title,
		authors: metadata.authors,
		imageUrl: metadata.imageUrl,
		publishedAt: metadata.publishedAt,
		abstract: content.abstract,
		fullText: content.fullText,
		slug: slugify(metadata.title),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};
}

export const contentItemRouter = router({
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
		.input(RpcType(selectContentItemSchema["id"]))
		.query(async ({ ctx: { db, schema }, input: { id } }) =>
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
		.mutation(
			async ({ ctx: { db, schema }, input: urls }) =>
				await db
					.insert(schema.contentItems)
					.values(await Promise.all(urls.map(async (url) => extractContentItem(url)))),
		),

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
			if (!existing) throw new Error(`Content item with ID ${id} does not exist.`);

			return await db
				.update(schema.contentItems)
				.set(await extractContentItem(existing.permalink))
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
