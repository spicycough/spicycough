import * as cheerio from "cheerio";
import type { RouteContext, ParsedData } from "./types";
import { parse } from "./parsing";

type Section = {
	markup: string;
};

const nature = ({ response }: RouteContext): ParsedData => {
	const $ = cheerio.load(response.body, { recognizeSelfClosing: true });

	return {
		title: $("h1.c-article-title").text().trim(),
		authors: $("li.c-article-author-list__item > a")
			.map((_, el) => $(el).text().trim())
			.get(),
		publicationDate: $("li.c-article-identifiers__item > a > time").text().trim(),
		abstract: $("div.c-article-body > div.c-article-section__content--standfirst > p")
			.text()
			.trim(),
		fullText: $(".c-article-body > .main-content section")
			.toArray()
			.reduce((acc: Section[], el: cheerio.Element) => [...acc, { markup: parse(el) }], [])
			.map(({ markup }) => markup)
			.join(""),
	};
};

export const router = {
	nature,
};
