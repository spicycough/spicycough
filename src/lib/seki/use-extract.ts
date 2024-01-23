import * as cheerio from "cheerio";
import { type ExtendedOptionsOfTextResponseBody, gotScraping } from "got-scraping";
import { convert, type HtmlToTextOptions } from "html-to-text";

import type { NewContentItem } from "@/db/schema";
import { takeFirst } from "@/lib/utils";

const REGEX_COMMAS_AND_SPACES = /[, ]+/;
const REGEX_ANY_WHITESPACE = /\s+/;
const MAX_INPUT_LENGTH = 1 << 24; // 16_777_216

const Errors = {
	NO_ABSTRACT: "No abstract found",
	NO_AUTHORS: "No authors found",
	NO_FULL_TEXT: "No full text found",
	NO_IMAGE_URL: "No image url found",
	NO_KEYWORDS: "No keywords found",
	NO_PUBLISHED_AT: "No publication date found",
	NO_TITLE: "No title found",
} as const;

export type ExtractOpts = ExtendedOptionsOfTextResponseBody;

interface SelectorOverrides {
	fullText: string[];
	abstract: string[];
	title: string[];
	authors: string[];
	publishedAt: string[];
	imageUrl: string[];
}

const useExtract = async (url: URL | string, selectors?: SelectorOverrides, opts?: ExtractOpts) => {
	const response = await gotScraping(url, opts);

	const $ = cheerio.load(response.body, { recognizeSelfClosing: true });

	const content = {
		fullText: fullText(response.body, selectors?.fullText),
		abstract: abstract($, selectors?.abstract),
	};

	const metadata = {
		title: title($, selectors?.title),
		authors: authors($, selectors?.authors),
		publishedAt: publishedAt($, selectors?.publishedAt),
		imageUrl: imageUrl($, selectors?.imageUrl),
	};

	return {
		response,
		$,
		content,
		metadata,
	};
};

const fullText = (html: string, extra?: string[]) => {
	const opts: HtmlToTextOptions = {
		baseElements: {
			selectors: [...(extra ? extra : []), ".main-content > section"],
			orderBy: "occurrence",
			returnDomByDefault: true,
		},
		decodeEntities: true,
		preserveNewlines: true,
		whitespaceCharacters: " \t\r\n\f\u200b",
		wordwrap: 80,
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
				options: { ignoreHref: true, trimEmptyLines: true },
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
				options: { level: 1, prefix: "#", trailingLineBreaks: 3 },
			},
			{
				selector: "h2",
				format: "inlineSurround",
				options: { level: 2, prefix: "##", trailingLineBreaks: 3 },
			},
			{
				selector: "h3",
				format: "inlineSurround",
				options: { level: 3, prefix: "###", trailingLineBreaks: 3 },
			},
			{
				selector: "h4",
				format: "inlineSurround",
				options: { level: 4, prefix: "####", trailingLineBreaks: 3 },
			},
			{
				selector: "h5",
				format: "inlineSurround",
				options: { level: 5, prefix: "#####", trailingLineBreaks: 3 },
			},
			{
				selector: "h6",
				format: "inlineSurround",
				options: { level: 6, prefix: "######", trailingLineBreaks: 3 },
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
		encodeCharacters: {
			"!": "&excl;",
			"#": "&num;",
			"(": "&lpar;",
			")": "&rpar;",
			"*": "&ast;",
			"+": "&plus;",
			"-": "&#45;", // hyphen-minus
			".": "&period;",
			"[": "&lbrack;",
			"\\": "&bsol;",
			"]": "&rbrack;",
			_: "&lowbar;",
			"`": "&grave;",
			"{": "&lbrace;",
			"}": "&rbrace;",
		},
		formatters: {},
	};

	const fullText = convert(html, opts);
	if (!fullText) {
		throw new Error(Errors.NO_FULL_TEXT);
	}

	return fullText satisfies NewContentItem["fullText"];
};

const title = ($: cheerio.CheerioAPI, extra?: string[]) => {
	const selectors = [
		...(extra ? extra : []),
		$("title").text(),
		$("meta[name='title']").attr("content"),
		document.title,
	];

	const title = takeFirst(selectors);
	if (!title) {
		throw new Error(Errors.NO_TITLE);
	}

	return title satisfies NewContentItem["title"];
};

const authors = ($: cheerio.CheerioAPI, extra?: string[]) => {
	const selectors = [
		...(extra ? extra : []),
		$("meta[name='author']").attr("content"),
		$("meta[property='article:author']").attr("content"),
		$("meta[name='twitter:creator']").attr("content"),
		$("meta[name='twitter:site']").attr("content"),
		$("meta[property='og:site_name']").attr("content"),
	];

	const authors = takeFirst(selectors)?.split(",");
	if (!authors || authors.length === 0) {
		throw new Error(Errors.NO_AUTHORS);
	}

	return authors satisfies NewContentItem["authors"];
};

const publishedAt = ($: cheerio.CheerioAPI, extra?: string[]) => {
	const selectors = [
		...(extra ? extra : []),
		$("meta[name='date']").attr("content"),
		$("meta[property='article:published_time']").attr("content"),
		$("meta[name='article:published_time']").attr("content"),
		$("meta[name='dc.date']").attr("content"),
		$("meta[name='dc.date.issued']").attr("content"),
		$("meta[name='pubdate']").attr("content"),
		$("time[itemprop='datePublished']").attr("datetime"),
		$("time[pubdate]").attr("datetime"),
		$("meta[property='og:article:published_time']").attr("content"),
		$("meta[name='parsely-pub-date']").attr("content"),
	];

	const date = takeFirst(selectors);
	if (!date) {
		throw new Error(Errors.NO_PUBLISHED_AT);
	}

	const standardizedDate = new Date(date);
	if (!isNaN(standardizedDate.getTime())) {
		throw new Error(Errors.NO_PUBLISHED_AT);
	}

	return standardizedDate satisfies NewContentItem["publishedAt"];
};

const abstract = ($: cheerio.CheerioAPI, extra?: string[]) => {
	const selectors = [
		...(extra ? extra : []),
		$(`article section[data-title="Abstract"] p`).text(),
		$("meta[name='abstract']").attr("content"),
		$("meta[property='og:abstract']").attr("content"),
		$("meta[name='twitter:abstract']").attr("content"),
		$("meta[name='dc.abstract']").attr("content"),
		$("meta[name='abstract']").attr("content"),
		$("article p").first().text(),
	];

	const abstract = takeFirst(selectors);
	if (!abstract) {
		throw new Error(Errors.NO_ABSTRACT);
	}

	return abstract satisfies NewContentItem["abstract"];
};

const imageUrl = ($: cheerio.CheerioAPI, extra?: string[]) => {
	const selectors = [
		...(extra ? extra : []),
		$("meta[property='og:image']").attr("content"),
		$("meta[name='twitter:image']").attr("content"),
		$("meta[itemprop='image']").attr("content"),
		$("meta[name='image']").attr("content"),
	];
	const imageUrl = takeFirst(selectors);
	if (!imageUrl) {
		throw new Error(Errors.NO_IMAGE_URL);
	}

	return imageUrl satisfies NewContentItem["imageUrl"];
};

// TODO: add field to db schema
const keywords = ($: cheerio.CheerioAPI, extra?: string[]): string[] => {
	const selectors = [
		...(extra ? extra : []),
		$("meta[name='keywords']").attr("content"),
		$("meta[property='article:tag']").attr("content"),
		$("meta[name='news_keywords']").attr("content"),
		$("meta[name='sailthru.tags']").attr("content"),
		$("meta[name='parsely-tags']").attr("content"),
	];

	const keywords = takeFirst(selectors);
	if (!keywords) {
		throw new Error(Errors.NO_KEYWORDS);
	}

	return keywords.split(REGEX_COMMAS_AND_SPACES).filter((tag) => tag.trim() !== "");
};

// TODO: this probably shouldn't be an extractor function
const readTime = ($: cheerio.CheerioAPI): number => {
	const content = $("article").text();

	const wordCount = content.trim().split(REGEX_ANY_WHITESPACE).length;
	const readTimeInMinutes = Math.ceil(wordCount / 100);

	return readTimeInMinutes;
};

export {
	abstract,
	authors,
	fullText,
	imageUrl,
	keywords,
	publishedAt,
	readTime,
	title,
	useExtract,
};
