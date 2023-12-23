import { ContentItemKind, contentItems, type ContentItem, type NewContentItem } from "@/db/schema";
import { useScrape } from "@/lib/seki";
import { useDatabase } from "@/db/useDatabase";
import { slugify } from "@/lib/misc";

export const handleFormData = async (data: FormData) => {
	const url = data.get("url")?.toString();
	if (!url) throw new Error("No URL provided");
	else if (!isValidUrl(url)) throw new Error("Invalid URL provided");

	return { url };
};

export const fetchContentItem = async (url: string | URL) => {
	const { db } = useDatabase();

	const _url: URL = url instanceof URL ? url : new URL(url);
	// Check if exists
	const existing = await db.query.contentItems
		.findFirst({
			where: (row, { eq }) => {
				return eq(row.sourceUrl, _url.href);
			},
		})
		.execute();

	if (existing) return existing;

	// const newContentItem = await scrapeUrl(_url);

	// const r = (
	// 	await db
	// 		.insert(contentItems)
	// 		.values(newContentItem)
	// 		.onConflictDoNothing({ target: contentItems.id })
	// 		.returning()
	// 		.execute()
	// )?.[0]!;
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
