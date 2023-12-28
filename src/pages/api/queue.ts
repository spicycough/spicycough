import type { APIRoute } from "astro";

import { isValidUrl } from "./utils";

import { ContentItemKind, type NewContentItem } from "@/db/schema/contentItems";
import { useScrape } from "@/lib/seki";
import { useDatabase } from "@/db/useDatabase";
import { slugify } from "@/lib/utils";

export const POST: APIRoute = async ({ request }) => {
	try {
		const data = await request.formData();
		const { urls } = await parseFormData(data);

		const existingContentItems = await fetchExisting(urls);
		const existingUrls = existingContentItems.map((item) => item.sourceUrl);

		const newUrls = urls.filter((url) => !existingUrls.includes(url));
		if (newUrls.length === 0)
			return new Response(JSON.stringify(existingContentItems), { status: 200 });

		const newContentItems = await fetchNew(newUrls);
		const respBody = JSON.stringify([...existingContentItems, ...newContentItems]);

		return new Response(respBody, { status: 200 });
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(error?.message);
			return new Response(
				JSON.stringify({ message: error.message, cause: error.cause, stack: error.stack }),
				{ status: 400 },
			);
		} else {
			console.error(error);
			return new Response(JSON.stringify({ message: "Unknown error" }), { status: 400 });
		}
	}
};

const parseFormData = async (data: FormData) => {
	const urls = data.get("urls")?.toString().split("\n") ?? [];

	const hasInvalidUrl = urls.some((url) => !isValidUrl(url));
	if (hasInvalidUrl) throw new Error("Invalid URL provided");

	return { urls };
};

const fetchExisting = async (urls: string[]) => {
	const { db } = useDatabase();

	return await db.query.contentItemStaging.findMany({
		where: (contentItems, { inArray }) => inArray(contentItems.sourceUrl, urls),
	});
};

const fetchNew = async (urls: string[]) => {
	const { db, schema } = useDatabase();

	const scrapedContentItems = await Promise.all(urls.map((url) => scrapeUrl(url)));

	return await db
		.insert(schema.contentItemStaging)
		.values(scrapedContentItems)
		.returning()
		.execute();
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
		fullText: data.fullText,
	};
};
