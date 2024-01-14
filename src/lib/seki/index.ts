import * as cheerio from "cheerio";
import { gotScraping, type Response } from "got-scraping";
import { convert, type HtmlToTextOptions } from "html-to-text";

import { type ScrapeOptions, type ParsedData } from "./types";
import { parseMetadata } from "./metadata";

type UseScrape = {
	url: URL;
	options?: ScrapeOptions;
	onSuccess?: () => void;
};

export const useScrape = async ({
	url,
	options,
}: UseScrape): Promise<{ data: ParsedData; response: Response<string> }> => {
	const response = await gotScraping(url.href, options);

	const $ = cheerio.load(response.body, { recognizeSelfClosing: true });

	const opts: HtmlToTextOptions = {
		wordwrap: 80,
		baseElements: {
			selectors: ["section"],
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
			maxInputLength: 1 << 24, // 16_777_216
		},
		selectors: [
			{ selector: "*", format: "inline", options: { trimEmptyLines: true, ignoreHref: true } },
			{
				selector: "a",
				format: "inlineString",
				options: { string: "", ignoreHref: true, trimEmptyLines: true },
			},
			{ selector: "article", format: "block" },
			{ selector: "aside", format: "block" },
			{ selector: "b", format: "inlineSurround", options: { prefix: "**", suffix: "**" } },
			{ selector: "blockquote", format: "blockquote", options: { trimEmptyLines: true } },
			{ selector: "br", format: "inlineString", options: { string: "", trailingLineBreaks: 1 } },
			{ selector: "code", format: "inlineSurround", options: { prefix: "`", suffix: "`" } },
			{ selector: "del", format: "inlineSurround", options: { prefix: "~~", suffix: "~~" } },
			{ selector: "div", format: "block", options: { trimEmptyLines: true } },
			{ selector: "dl", format: "definitionList" },
			{ selector: "em", format: "inlineSurround", options: { prefix: "*", suffix: "*" } },
			{ selector: "figure", format: "block" },
			{ selector: "figcaption", format: "block" },
			{ selector: "footer", format: "block" },
			{ selector: "form", format: "block" },
			{ selector: "h1", format: "inlineSurround", options: { level: 1, prefix: "#" } },
			{ selector: "h2", format: "inlineSurround", options: { level: 2, prefix: "##" } },
			{ selector: "h3", format: "inlineSurround", options: { level: 3, prefix: "###" } },
			{ selector: "h4", format: "inlineSurround", options: { level: 4, prefix: "####" } },
			{ selector: "h5", format: "inlineSurround", options: { level: 5, prefix: "#####" } },
			{ selector: "h6", format: "inlineSurround", options: { level: 6, prefix: "######" } },
			{ selector: "header", format: "block" },
			{ selector: "hr", format: "blockString", options: { string: "----" } },
			{ selector: "i", format: "inlineSurround", options: { prefix: "*", suffix: "*" } },
			{ selector: "img", format: "skip" },
			{ selector: "kbd", format: "inlineTag" },
			{ selector: "main", format: "block" },
			{ selector: "nav", format: "block" },
			{ selector: "ol", format: "orderedList", options: { interRowLineBreaks: 1 } },
			{ selector: "p", format: "inlineString" },
			{ selector: "picture", format: "inline" },
			{ selector: "pre", format: "pre" },
			{ selector: "s", format: "inlineSurround", options: { prefix: "~~", suffix: "~~" } },
			{ selector: "section", format: "block" },
			{ selector: "source", format: "skip" },
			{ selector: "span", format: "block" },
			{ selector: "strong", format: "inlineSurround", options: { prefix: "**", suffix: "**" } },
			{ selector: "sub", format: "inlineTag" },
			{ selector: "sup", format: "inlineTag" },
			{ selector: "table", format: "dataTable" },
			{ selector: "ul", format: "unorderedList", options: { marker: "-", interRowLineBreaks: 1 } },
			{ selector: "wbr", format: "wbr" },
		],
		whitespaceCharacters: " \t\r\n\f\u200b",
	};

	const metadata = await parseMetadata(response.body);
	const fullText = convert(response.body, opts);

	const parsedData: ParsedData = {
		title: metadata.title,
		authors: metadata.author,
		publicationDate: metadata.publicationDate ?? "",
		abstract: "",
		fullText,
	};

	return { data: parsedData, response };
};
