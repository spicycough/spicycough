import { P, match } from "ts-pattern";
import { Hostnames } from "./constants";
import type { ContentSelectors } from "./types";

const nature: ContentSelectors = {
	title: ["h1.c-article-title"],
	authors: ["li.c-article-author-list__item > a"],
	publicationDate: ["li.c-article-identifiers__item > a > time"],
	abstract: ["div.c-article-body > div.c-article-section__content--standfirst > p"],
	fullText: [".c-article-body > .main-content section"],
} as const;

const fallback: ContentSelectors = {
	title: [".title", "title"],
	authors: [".author", "author"],
	publicationDate: [".publish-data", "publish-data"],
	abstract: [".abstract", "abstract"],
	fullText: [".article", "article"],
} as const;

export const getSelectors = (hostname: string): ContentSelectors => {
	return match(hostname)
		.with(P.string.includes(Hostnames.NATURE), () => nature)
		.otherwise(() => fallback);
};
