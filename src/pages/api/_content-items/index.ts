import type { APIRoute } from "astro";

import { ContentItemKind, type NewContentItem } from "@/db/schema";
import { useScrape } from "@/lib/seki";
import { useDatabase } from "@/db/useDatabase";
import { slugify } from "@/lib/utils";
import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

export const GET: APIRoute = async () => {
	const { db, schema } = useDatabase();
	try {
		const resp = await db.select().from(schema.contentItems).execute();

		return new Response(JSON.stringify(resp), { status: 200 });
	} catch (err) {
		return new Response(JSON.stringify(err), { status: 400 });
	}
};

const BodySchema = Type.Object({
	urls: Type.Array(Type.String()),
});

type Body = Static<typeof BodySchema>;

export const POST: APIRoute = async ({ request }) => {
	const { db, schema } = useDatabase();

	const body: Body = await request.json();
	const isValidBody = Value.Check(BodySchema, body);
	if (!isValidBody) throw new Error("Invalid request");

	const urls = body.urls.map((url) => new URL(url));
	const scrapedContentItems = await Promise.all(
		urls.map(async (url): Promise<NewContentItem> => {
			const { data } = await useScrape({ url });

			return {
				permalink: url.href,
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

	try {
		const resp = await db
			.insert(schema.contentItems)
			.values(scrapedContentItems)
			.returning()
			.execute();

		return new Response(JSON.stringify(resp), { status: 201 });
	} catch (err) {
		return new Response(JSON.stringify(err), { status: 400 });
	}
};

// delete all
export const DELETE: APIRoute = async () => {
	const { db, schema } = useDatabase();

	try {
		// eslint-disable-next-line drizzle/enforce-delete-with-where
		const resp = await db.delete(schema.contentItems).execute();
		return new Response(JSON.stringify(resp.rowsAffected), { status: 200 });
	} catch (err) {
		return new Response(JSON.stringify(err), { status: 400 });
	}
};
