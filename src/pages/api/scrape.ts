import type { APIRoute } from "astro";

import { ContentItemKind, type NewContentItem } from "@/db/schema/contentItems";
import { useScrape } from "@/lib/seki";
import { useDatabase } from "@/db/useDatabase";
import { slugify } from "@/lib/utils";

export const GET: APIRoute = async ({ request }) => {
	const formData = await request.formData();
	const urls = formData.get("urls")?.toString().split("\n") ?? [];
	if (!urls.length) return new Response(JSON.stringify("No URLs provided"), { status: 400 });

	const existingContentItems = await fetchExisting(urls);

	const existingUrls = existingContentItems.map((item) => item.sourceUrl);
	const newUrls = urls.filter((url) => !existingUrls.includes(url));

	const newContentItems = await fetchNew(newUrls);

	const respBody = JSON.stringify([...existingContentItems, ...newContentItems]);
	return new Response(respBody, { status: 200 });
};

const fetchExisting = async (urls: string[]) => {
	const { db } = useDatabase();

	return await db.query.contentItems.findMany({
		where: (contentItems, { inArray }) => inArray(contentItems.sourceUrl, urls),
	});
};

const fetchNew = async (urls: string[]) => {
	const { db, schema } = useDatabase();

	const scrapedContentItems = await Promise.all(urls.map(scrapeUrl));
	return await db.insert(schema.contentItems).values(scrapedContentItems).returning().execute();
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
