import * as cheerio from "cheerio";
import { type Response } from "got-scraping";

export type RouteContext = {
	response: Response<string>;
};

const nature = async ({ response }: RouteContext) => {
	const { body } = response;
	const $ = cheerio.load(body);

	const title = $("h1.c-article-title").text().trim();
	const authors = $("li.c-article-author-list__item > a")
		.map((_, el) => $(el).text().trim())
		.get();
	const publicationDate = $("li.c-article-identifiers__item > a > time").text().trim();
	const abstract = $("div.c-article-body > div.c-article-section__content--standfirst > p")
		.text()
		.trim();
	const fullText = $("div.c-article-body > div.main-content > div.c-article-section__content > p")
		.map((_, el) => $(el).text().trim())
		.get();

	return {
		sourceUrl: response.requestUrl.href,
		title,
		authors,
		publicationDate,
		abstract,
		fullText,
	};
};

export const router = {
	nature,
};
