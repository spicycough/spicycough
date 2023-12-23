import * as cheerio from "cheerio";
import type { RouteContext, ParsedData } from "./types";

const nature = ({ response }: RouteContext): ParsedData => {
	const $ = cheerio.load(response.body);

	return {
		title: $("h1.c-article-title").text().trim(),
		authors: $("li.c-article-author-list__item > a")
			.map((_, el) => $(el).text().trim())
			.get(),
		publicationDate: $("li.c-article-identifiers__item > a > time").text().trim(),
		abstract: $("div.c-article-body > div.c-article-section__content--standfirst > p")
			.text()
			.trim(),
		fullText: $("div.c-article-body > div.main-content > div.c-article-section__content > p")
			.map((_, el) => $(el).text().trim())
			.get(),
	};
};

export const router = {
	nature,
};
