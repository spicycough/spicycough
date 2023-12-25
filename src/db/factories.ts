import {
	randFullName,
	randRecentDate,
	randParagraph,
	randLines,
	randTextRange,
	rand,
	randNumber,
} from "@ngneat/falso";
import { ContentItemKind, type ContentItem, type ContentItemId } from "./schema/contentItems";

export const createFakeContentItem = (): ContentItem => {
	const id = randNumber() as ContentItemId;
	const kind = rand(Object.values(ContentItemKind));
	const title = randTextRange({ min: 3, max: 15 });
	const authors = randFullName();
	const slug = title.toLowerCase().replace(/\s/g, "-");
	const sourceUrl = "http://unsplash.it/200/200";
	const abstract = randLines();
	const fullText = randParagraph();
	const publishedAt = randRecentDate().toISOString();
	const createdAt = Date.now().toString();
	const updatedAt = Date.now().toString();

	return {
		id,
		kind,
		title,
		authors,
		sourceUrl,
		abstract,
		fullText,
		slug,
		publishedAt,
		createdAt,
		updatedAt,
	};
};
