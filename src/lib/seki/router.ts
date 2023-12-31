import * as cheerio from "cheerio";
import type { RouteContext, ParsedData } from "./types";
import { parse } from "./parsing";
import { readFile } from "node:fs";

type Section = {
	title: string;
	markup: string;
};

const nature = ({ response }: RouteContext): ParsedData => {
	// reads file as string
	const filename =
		"file:///Users/tim/Dropbox/projects/astro/spicycough-react/src/lib/seki/test.html";
	let body;
	readFile(filename, "utf8", (e, d) => {
		if (e) throw e;
		else body = d;
	});

	const $ = cheerio.load(response.body, { recognizeSelfClosing: true });

	const sections = $(".c-article-body > .main-content section");
	const sectionReducer = (acc: Section[], el: cheerio.Element) => {
		const $ = cheerio.load(el);
		const title = $("h2").text().trim();
		const markup = parse(el);
		return [...acc, { title, markup }];
	};
	const fullText = sections
		.toArray()
		.reduce(sectionReducer, [])
		.map(({ markup }) => markup)
		.join("\n");

	return {
		title: $("h1.c-article-title").text().trim(),
		authors: $("li.c-article-author-list__item > a")
			.map((_, el) => $(el).text().trim())
			.get(),
		publicationDate: $("li.c-article-identifiers__item > a > time").text().trim(),
		abstract: $("div.c-article-body > div.c-article-section__content--standfirst > p")
			.text()
			.trim(),
		fullText,
	};
};

export const router = {
	nature,
};
