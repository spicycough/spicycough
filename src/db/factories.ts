import {
	randFullName,
	randRecentDate,
	randParagraph,
	randLine,
	randTextRange,
	rand,
	randNumber,
} from "@ngneat/falso";
import { ContentItemKind, type ContentItem, type ContentItemId } from "./schema";

export const createFakeContentItems = (amount: number = 1): ContentItem[] => {
	return Array.from({ length: amount }, () => {
		const id = randNumber() as ContentItemId;
		const kind = rand(Object.values(ContentItemKind));
		const title = randTextRange({ min: 3, max: 15 });
		const authors = randFullName();
		const slug = title.toLowerCase().replace(/\s/g, "-");
		const permalink = "https://www.nature.com/articles/s41586-021-03402-5";
		const imageUrl = "http://unsplash.it/200/200";
		const abstract = randLine();
		const fullText = randParagraph();
		const publishedAt = randRecentDate().toISOString();
		const createdAt = Date.now().toString();
		const updatedAt = Date.now().toString();

		return {
			id,
			kind,
			title,
			authors,
			permalink,
			imageUrl,
			abstract,
			fullText,
			slug,
			publishedAt,
			createdAt,
			updatedAt,
		};
	});
};
