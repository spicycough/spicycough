import * as cheerio from "cheerio";
import { match, P } from "ts-pattern";

import { type ContentSelectors, Hostnames } from "./types";

const nature = ($: cheerio.CheerioAPI) =>
	({
		title: $("h1.c-article-title").text(),
		authors: $("li.c-article-author-list__item > a").text(),
		publicationDate: $("li.c-article-identifiers__item > a > time").text(),
		abstract: $("div.c-article-body > div.c-article-section__content--standfirst > p").text(),
		fullText: $(".c-article-body > .main-content section").text(),
	}) as const;

const fallback: ContentSelectors = {
	title: [".title", "title"],
	authors: [".author", "author"],
	publicationDate: [".publish-data", "publish-data"],
	abstract: [".abstract", "abstract"],
	fullText: [".article", "article"],
} as const;

export const getSelectors = (hostname: string) => {
	return match(hostname)
		.with(P.string.includes(Hostnames.NATURE), () => nature)
		.otherwise(() => fallback);
};
