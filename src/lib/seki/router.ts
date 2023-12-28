import * as cheerio from "cheerio";
import type { RouteContext, ParsedData } from "./types";
import { match } from "ts-pattern";

type Section = {
	title: string;
	content: string[];
};

const nature = ({ response }: RouteContext): ParsedData => {
	const $ = cheerio.load(response.body, { recognizeSelfClosing: true });

	const sections = [];
	let currentSection = {} as Section;
	const fullText = $(
		".c-article-body > .main-content :is(section, h1, h2, h3, h4, h5, h6, p, ul, li, ol, blockquote, table, figure, figcaption, img)",
	)
		.map((_, el) => {
			return match(el.tagName)
				.with("p", () => currentSection.content.push($(el).text().trim())) // Handle bold, italic, etc
				.with("ul", () => currentSection.content.push(`- ${$(el).text().trim()}`)) // Unsure if this is correct
				.with("li", () => currentSection.content.push(`- ${$(el).text().trim()}`))
				.with("ol", () => currentSection.content.push(`1. ${$(el).text().trim()}`))
				.with("h1", () => currentSection.content.push(`# ${$(el).text().trim()}`))
				.with("h2", () => currentSection.content.push(`## ${$(el).text().trim()}`))
				.with("h3", () => currentSection.content.push(`### ${$(el).text().trim()}`))
				.with("h4", () => currentSection.content.push(`#### ${$(el).text().trim()}`))
				.with("h5", () => currentSection.content.push(`##### ${$(el).text().trim()}`))
				.with("h6", () => currentSection.content.push(`###### ${$(el).text().trim()}`))
				.with("blockquote", () => currentSection.content.push(`> ${$(el).text().trim()}`))
				.with("section", () => {
					const text = $(el).text().trim();
					currentSection.title = text;
					sections.push(currentSection);
					currentSection = {} as Section;
				});
		})
		.get()
		.join("\n");

	console.log("TEXTUAL", fullText);
	if (fullText.length === 0) {
		throw new Error("No full text found");
	}

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
