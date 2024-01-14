import { ContentItemKind } from "@/db/schema";
import { useDatabase } from "@/db/useDatabase";
import { useScrape } from "@/lib/seki";
import { slugify } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { publicProcedure, router } from "../router";
import { RpcType, head } from "../utils";
import { useValidationSchema } from "./validation";

export const buildRouter = () => {
	const { db, schema } = useDatabase();
	const { contentItems } = schema;

	const validationSchemas = useValidationSchema();

	return router({
		list: publicProcedure.query(async () => await db.select().from(contentItems).execute()),
		byId: publicProcedure
			.input(RpcType(validationSchemas.byId))
			.query(async ({ input: { id } }) =>
				head(await db.select().from(contentItems).where(eq(contentItems.id, id)).execute()),
			),
		create: publicProcedure
			.input(RpcType(validationSchemas.create))
			.mutation(async ({ input: { url } }) => {
				const _url = new URL(url);

				const { data } = await useScrape({ url: _url });
				const scrapedContentItems = {
					permalink: _url.href,
					kind: ContentItemKind.ARTICLE,
					title: data.title,
					publishedAt: data.publicationDate,
					abstract: data.abstract,
					slug: slugify(data.title),
					authors: data.authors,
					fullText: data.fullText,
				};

				return await db.insert(contentItems).values(scrapedContentItems).returning().execute();
			}),
		bulkCreate: publicProcedure
			.input(RpcType(validationSchemas.bulkCreate))
			.mutation(async ({ input: { urls } }) => {
				const scrapedContentItems = await Promise.all(
					urls.map(async (url) => {
						const _url = new URL(url);

						const { data } = await useScrape({ url: _url });
						return {
							permalink: _url.href,
							kind: ContentItemKind.ARTICLE,
							title: data.title,
							publishedAt: data.publicationDate,
							abstract: data.abstract,
							slug: slugify(data.title),
							authors: data.authors,
							fullText: data.fullText,
						};
					}),
				);
				return await db.insert(contentItems).values(scrapedContentItems).returning().execute();
			}),
		delete: publicProcedure
			// eslint-disable-next-line drizzle/enforce-delete-with-where
			.input(RpcType(validationSchemas.delete))
			.mutation(
				async ({ input: { id } }) =>
					await db.delete(contentItems).where(eq(contentItems.id, id)).execute(),
			),
		update: publicProcedure.input(RpcType(validationSchemas.update)).mutation(async ({ input }) => {
			return head(
				await db
					.update(contentItems)
					.set(input)
					.where(eq(contentItems.id, input.id!))
					.returning()
					.execute(),
			);
		}),
		patch: publicProcedure.input(RpcType(validationSchemas.patch)).mutation(async ({ input }) => {
			return head(
				await db
					.update(contentItems)
					.set(input)
					.where(eq(contentItems, input.id))
					.returning()
					.execute(),
			);
		}),
		clear: publicProcedure
			.input(RpcType(validationSchemas.clear))
			// eslint-disable-next-line drizzle/enforce-delete-with-where
			.mutation(async () => await db.delete(contentItems).execute()),
		refresh: publicProcedure
			.input(RpcType(validationSchemas.refresh))
			.mutation(async ({ input: { id } }) => {
				const existing = head(
					await db.select().from(contentItems).where(eq(contentItems.id, id)).execute(),
				);
				if (!existing) throw new Error(`Content item with ID ${id} does not exist.`);

				const url = new URL(existing.permalink);
				const { data } = await useScrape({ url });

				return await db
					.update(contentItems)
					.set({
						permalink: url.href,
						kind: ContentItemKind.ARTICLE,
						title: data.title,
						publishedAt: data.publicationDate,
						abstract: data.abstract,
						slug: slugify(data.title),
						authors: data.authors,
						fullText: data.fullText,
					})
					.where(eq(contentItems.permalink, url.href))
					.returning()
					.execute();
			}),
	});
};
