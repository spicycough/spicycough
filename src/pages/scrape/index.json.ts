import type { APIRoute } from "astro";

import { ContentItemKind, contentItems, type NewContentItem } from "@/db/schema/contentItems";
import { useScrape } from "@/lib/seki";
import { useDatabase } from "@/db/useDatabase";
import { slugify } from "@/lib/utils";

export const handleFormData = async (data: FormData) => {
	const urls = data.get("urls")?.toString().split("\n") ?? [];

	urls.forEach(async (url) => {
		if (!url) throw new Error("No URL provided");
		else if (!isValidUrl(url)) throw new Error("Invalid URL provided");
	});

	return { urls };
};

export const POST: APIRoute = async ({ request }) => {
	const isForm = request.headers.get("Content-Type") === "application/x-www-form-urlencoded";
	if (!isForm) return new Response(null, { status: 404 });

	const { db, schema } = useDatabase();

	try {
		const data = await request.formData();
		const { urls } = await handleFormData(data);

		const records = await db
			.insert(schema.contentItemQueue)
			.values(
				urls.map((url) => ({
					sourceUrl: url,
				})),
			)
			.execute();

		return new Response(null, { status: 200 });
	} catch (error) {
		console.error(error);
		return new Response(null, { status: 400 });
	}
};

export const fetchContentItem = async (url: string | URL) => {
	const { db } = useDatabase();

	const _url: URL = url instanceof URL ? url : new URL(url);

	const existing = await db.query.contentItems
		.findFirst({
			where: (row, { eq }) => {
				return eq(row.sourceUrl, _url.href);
			},
		})
		.execute();

	if (existing) return existing;

	const newContentItem = await scrapeUrl(_url);

	const resp = await db
		.insert(contentItems)
		.values(newContentItem)
		.onConflictDoNothing({ target: contentItems.id })
		.returning()
		.execute();

	return resp[0];
};

export const scrapeUrl = async (url: string | URL): Promise<NewContentItem> => {
	const _url: URL = url instanceof URL ? url : new URL(url);

	const { data } = await useScrape({ url: _url });

	return {
		sourceUrl: _url.href,
		kind: ContentItemKind.ARTICLE,
		title: data.title,
		publishedAt: data.publicationDate,
		abstract: data.abstract,
		slug: slugify(data.title),
		authors: data.authors.join("\n"),
		fullText: data.fullText.join("\n"),
	};
};

const isValidUrl = (url: string) => {
	try {
		new URL(url);
		return true;
	} catch (err) {
		return false;
	}
};
