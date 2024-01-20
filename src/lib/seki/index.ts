import * as cheerio from "cheerio";
import { gotScraping, type Response } from "got-scraping";
import { convert, type HtmlToTextOptions } from "html-to-text";

import type { NewContentItem } from "@/db/schema";
import { parseMetadata } from "./metadata";
import { type ScrapeOptions } from "./types";

type UseScrape = {
	url: URL;
	options?: ScrapeOptions;
	onSuccess?: () => void;
};

const MAX_INPUT_LENGTH = 1 << 24; // 16_777_216

export const useScrape = async ({
	url,
	options,
}: UseScrape): Promise<{
	data: Omit<NewContentItem, "permalink" | "slug">;
	response: Response<string>;
}> => {
	const response = await gotScraping(url.href, options);

	const opts: HtmlToTextOptions = {
		wordwrap: 80,
		preserveNewlines: true,
		baseElements: {
			selectors: [".main-content > section"],
			orderBy: "occurrence",
			returnDomByDefault: true,
		},
		// decodeEntities: true,
		// encodeCharacters: {
		// 	"!": "&excl;",
		// 	"#": "&num;",
		// 	"(": "&lpar;",
		// 	")": "&rpar;",
		// 	"*": "&ast;",
		// 	"+": "&plus;",
		// 	"-": "&#45;", // hyphen-minus
		// 	".": "&period;",
		// 	"[": "&lbrack;",
		// 	"\\": "&bsol;",
		// 	"]": "&rbrack;",
		// 	_: "&lowbar;",
		// 	"`": "&grave;",
		// 	"{": "&lbrace;",
		// 	"}": "&rbrace;",
		// },
		formatters: {},
		limits: {
			ellipsis: "...",
			maxBaseElements: undefined,
			maxChildNodes: undefined,
			maxDepth: undefined,
			maxInputLength: MAX_INPUT_LENGTH,
		},
		selectors: [
			// { selector: "*", format: "inline", options: { trimEmptyLines: true, ignoreHref: true } },
			{
				selector: "a",
				format: "skip",
				options: { string: "", ignoreHref: true, trimEmptyLines: true },
			},
			{ selector: "article", format: "block" },
			{ selector: "aside", format: "block" },
			{ selector: "b", format: "inlineSurround", options: { prefix: "**", suffix: "**" } },
			{ selector: "blockquote", format: "blockquote", options: { trimEmptyLines: true } },
			{ selector: "br", format: "inlineString", options: { string: "", trailingLineBreaks: 3 } },
			{ selector: "code", format: "inlineSurround", options: { prefix: "`", suffix: "`" } },
			{ selector: "del", format: "inlineSurround", options: { prefix: "~~", suffix: "~~" } },
			{ selector: "div", format: "block", options: { trimEmptyLines: true } },
			{ selector: "dl", format: "definitionList" },
			{ selector: "em", format: "inlineSurround", options: { prefix: "*", suffix: "*" } },
			{ selector: "figure", format: "block" },
			{ selector: "figcaption", format: "block" },
			{ selector: "footer", format: "block" },
			{ selector: "form", format: "block" },
			{
				selector: "h1",
				format: "inlineSurround",
				options: { level: 1, prefix: "#", suffix: " ", trailingLineBreaks: 3 },
			},
			{
				selector: "h2",
				format: "inlineSurround",
				options: { level: 2, prefix: "##", suffix: " ", trailingLineBreaks: 3 },
			},
			{
				selector: "h3",
				format: "inlineSurround",
				options: { level: 3, prefix: "###", suffix: " ", trailingLineBreaks: 3 },
			},
			{
				selector: "h4",
				format: "inlineSurround",
				options: { level: 4, prefix: "####", suffix: " ", trailingLineBreaks: 3 },
			},
			{
				selector: "h5",
				format: "inlineSurround",
				options: { level: 5, prefix: "#####", suffix: " ", trailingLineBreaks: 3 },
			},
			{
				selector: "h6",
				format: "inlineSurround",
				options: { level: 6, prefix: "######", suffix: " ", trailingLineBreaks: 3 },
			},
			{ selector: "header", format: "block" },
			{ selector: "hr", format: "blockString", options: { string: "----" } },
			{ selector: "i", format: "inlineSurround", options: { prefix: "*", suffix: "*" } },
			{ selector: "img", format: "skip" },
			{ selector: "kbd", format: "inlineTag" },
			{ selector: "main", format: "block" },
			{ selector: "nav", format: "block" },
			{ selector: "ol", format: "orderedList", options: { interRowLineBreaks: 1 } },
			{ selector: "p", format: "block" },
			{ selector: "picture", format: "inline" },
			{ selector: "pre", format: "pre" },
			{ selector: "s", format: "inlineSurround", options: { prefix: "~~", suffix: "~~" } },
			{ selector: "section", format: "block" },
			{ selector: "source", format: "skip" },
			{ selector: "span", format: "block" },
			{ selector: "strong", format: "inlineSurround", options: { prefix: "**", suffix: "**" } },
			{ selector: "sub", format: "inlineString" },
			{ selector: "sup", format: "inlineString" },
			{ selector: "table", format: "dataTable" },
			{ selector: "ul", format: "unorderedList", options: { marker: "-", interRowLineBreaks: 1 } },
			{ selector: "wbr", format: "wbr" },
		],
		whitespaceCharacters: " \t\r\n\f\u200b",
	};

	const metadata = await parseMetadata(response.body);

	const $ = cheerio.load(response.body, { recognizeSelfClosing: true });
	// const fullTextHtml = $("");

	const fullText = convert(response.body, opts);

	return {
		data: {
			fullText,
			...metadata,
		},
		response,
	};
};
