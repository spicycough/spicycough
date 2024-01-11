import { ContentItemKind, type ContentItem, insertContentItemSchema } from "@/db/schema";
import { useDatabase } from "@/db/useDatabase";
import { useScrape } from "@/lib/seki";
import { slugify } from "@/lib/utils";
import { Partial, Type } from "@sinclair/typebox";
import { eq } from "drizzle-orm";
import { publicProcedure, router } from "../router";
import { RpcType } from "../utils";

export const buildRouter = () => {
	const { db, schema } = useDatabase();

	return router({
		get: publicProcedure.query(async () => await db.select().from(schema.contentItems).execute()),
		create: publicProcedure
			.input(RpcType(Type.String()))
			.mutation(async ({ input }): Promise<ContentItem> => {
				const url = new URL(input);

				const { data } = await useScrape({ url });
				const scrapedContentItems = {
					permalink: url.href,
					kind: ContentItemKind.ARTICLE,
					title: data.title,
					publishedAt: data.publicationDate,
					abstract: data.abstract,
					slug: slugify(data.title),
					authors: data.authors,
					fullText: data.fullText,
				};

				const ret = await db
					.insert(schema.contentItems)
					.values(scrapedContentItems)
					.returning()
					.execute();

				return ret[0]!;
			}),
		delete: publicProcedure
			.input(RpcType(Type.Integer()))
			.mutation(
				async ({ input: id }) =>
					await db.delete(schema.contentItems).where(eq(schema.contentItems.id, id)).execute(),
			),
		update: publicProcedure.input(RpcType(insertContentItemSchema)).mutation(async ({ input }) => {
			const ret = await db
				.update(schema.contentItems)
				.set(input)
				.where(eq(schema.contentItems.id, input.id!))
				.returning()
				.execute();

			return ret[0]!;
		}),
		partialUpdate: publicProcedure
			.input(RpcType(Partial(insertContentItemSchema)))
			.mutation(async ({ input }) => {
				const ret = await db
					.update(schema.contentItems)
					.set(input)
					.where(eq(schema.contentItems.id, input.id!))
					.returning()
					.execute();

				return ret[0]!;
			}),
		// eslint-disable-next-line drizzle/enforce-delete-with-where
		clear: publicProcedure.mutation(async () => await db.delete(schema.contentItems).execute()),
		refresh: publicProcedure
			.input(RpcType(Type.String({ format: "uri" })))
			.mutation(async ({ input }) => {
				const url = new URL(input);
				const { data } = await useScrape({ url });

				return await db
					.update(schema.contentItems)
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
					.where(eq(schema.contentItems.permalink, url.href))
					.returning()
					.execute();
			}),
	});
};
