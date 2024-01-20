import { ContentItemKind, type NewContentItem } from "@/db/schema";
import { useScrape } from "@/lib/seki";
import { slugify } from "@/lib/utils";
import { count, eq } from "drizzle-orm";
import { publicProcedure, router } from "../router";
import { RpcType, head } from "../utils";
import { useValidationSchema } from "./validation";

export const buildRouter = () => {
	const validationSchemas = useValidationSchema();

	return router({
		count: publicProcedure.query(async ({ ctx: { db, schema } }) => {
			return head(
				await db
					.select({ count: count(schema.contentItems.id) })
					.from(schema.contentItems)
					.execute(),
			)?.count;
		}),
		list: publicProcedure.query(
			async ({ ctx: { db, schema } }) => await db.select().from(schema.contentItems).execute(),
		),
		byId: publicProcedure
			.input(RpcType(validationSchemas.byId))
			.query(async ({ ctx: { db, schema }, input: { id } }) =>
				head(
					await db
						.select()
						.from(schema.contentItems)
						.where(eq(schema.contentItems.id, id))
						.execute(),
				),
			),
		create: publicProcedure
			.input(RpcType(validationSchemas.create))
			.mutation(async ({ ctx: { db, schema }, input: { url } }) => {
				const _url = new URL(url);

				const { data } = await useScrape({ url: _url });
				const scrapedContentItems: NewContentItem = {
					permalink: _url.href,
					kind: ContentItemKind.ARTICLE,
					title: data.title,
					publishedAt: new Date(data.publicationDate),
					abstract: data.abstract,
					slug: slugify(data.title),
					authors: data.authors,
					fullText: data.fullText,
				};

				return await db
					.insert(schema.contentItems)
					.values(scrapedContentItems)
					.returning()
					.execute();
			}),
		bulkCreate: publicProcedure
			.input(RpcType(validationSchemas.bulkCreate))
			.mutation(async ({ ctx: { db, schema }, input: { urls } }) => {
				const scrapedContentItems = await Promise.all(
					urls.map(async (url) => {
						const _url = new URL(url);

						const { data } = await useScrape({ url: _url });
						return {
							permalink: _url.href,
							kind: ContentItemKind.ARTICLE,
							title: data.title,
							publishedAt: new Date(data.publicationDate),
							abstract: data.abstract,
							slug: slugify(data.title),
							authors: data.authors,
							fullText: data.fullText,
						};
					}),
				);
				return await db
					.insert(schema.contentItems)
					.values(scrapedContentItems)
					.returning()
					.execute();
			}),
		delete: publicProcedure
			// eslint-disable-next-line drizzle/enforce-delete-with-where
			.input(RpcType(validationSchemas.delete))
			.mutation(
				async ({ ctx: { db, schema }, input: { id } }) =>
					await db.delete(schema.contentItems).where(eq(schema.contentItems.id, id)).execute(),
			),
		update: publicProcedure
			.input(RpcType(validationSchemas.update))
			.mutation(async ({ ctx: { db, schema }, input }) => {
				return head(
					await db
						.update(schema.contentItems)
						.set(input)
						.where(eq(schema.contentItems.id, input.id!))
						.returning()
						.execute(),
				);
			}),
		patch: publicProcedure
			.input(RpcType(validationSchemas.patch))
			.mutation(async ({ ctx: { db, schema }, input }) => {
				return head(
					await db
						.update(schema.contentItems)
						.set(input)
						.where(eq(schema.contentItems, input.id))
						.returning()
						.execute(),
				);
			}),
		clear: publicProcedure
			.input(RpcType(validationSchemas.clear))
			// eslint-disable-next-line drizzle/enforce-delete-with-where
			.mutation(async ({ ctx: { db, schema } }) => await db.delete(schema.contentItems).execute()),
		refresh: publicProcedure
			.input(RpcType(validationSchemas.refresh))
			.mutation(async ({ ctx: { db, schema }, input: { id } }) => {
				const existing = head(
					await db
						.select()
						.from(schema.contentItems)
						.where(eq(schema.contentItems.id, id))
						.execute(),
				);
				if (!existing) throw new Error(`Content item with ID ${id} does not exist.`);

				const url = new URL(existing.permalink);
				const { data } = await useScrape({ url });

				return await db
					.update(schema.contentItems)
					.set({
						permalink: url.href,
						kind: ContentItemKind.ARTICLE,
						title: data.title,
						publishedAt: new Date(data.publicationDate),
						abstract: data.abstract,
						slug: slugify(data.title),
						authors: data.authors,
						fullText: data.fullText,
					})
					.where(eq(schema.contentItems.id, id))
					.returning()
					.execute();
			}),
	});
};
