import { ContentItemKind, contentItems, type ContentItem, type NewContentItem } from "@/db/schema";
import { useScrape } from "@seki";
import { useDatabase } from "@/db/useDatabase";
import { slugify } from "@/lib/utils";

export const handleFormData = async (data: FormData) => {
	const url = data.get("url")?.toString();
	if (!url) throw new Error("No URL provided");
	else if (!isValidUrl(url)) throw new Error("Invalid URL provided");

	return { url };
};

export const scrapeUrl = async (url: string | URL): Promise<ContentItem | undefined> => {
	const db = useDatabase();

	const _url: URL = url instanceof URL ? url : new URL(url);

	const { data } = await useScrape({
		url: _url,
	});

	const newContentItem: NewContentItem = {
		sourceUrl: _url.href,
		type: ContentItemKind.ARTICLE,
		slug: slugify(data.title),
		title: data.title,
		authors: data.authors.join("\n"),
		publishedAt: data.publicationDate,
		abstract: data.abstract,
		fullText: data.fullText.join("\n"),
	};

	const [contentItem] = await db.insert(contentItems).values(newContentItem).returning().execute();
	return contentItem;
};

const isValidUrl = (url: string) => {
	try {
		new URL(url);
		return true;
	} catch (err) {
		return false;
	}
};

export const hasErrors = (errors: { error: string }) => Object.values(errors).some((msg) => msg);
