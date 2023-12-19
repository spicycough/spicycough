import * as cheerio from "cheerio";
import { type Response } from "got-scraping";

export type RouteContext = {
	response: Response<string>;
};

export type ParsedBody = {
	title: string;
	authors: string[];
	publicationDate: string;
	abstract: string;
	fullText: string[];
};

export type ParsedResponse = Pick<Response<string>, "request" | "body" | "url"> & {
	parsedBody: ParsedBody;
};

const nature = async ({ response }: RouteContext): Promise<ParsedResponse> => {
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
		...response,
		parsedBody: {
			title,
			authors,
			publicationDate,
			abstract,
			fullText,
		},
	};
};

export const router = {
	nature,
};
