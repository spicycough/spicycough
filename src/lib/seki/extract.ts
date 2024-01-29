import * as cheerio from "cheerio";
import { convert } from "html-to-text";

import type { ExtractResults } from "./types";

const REGEX_COMMAS_AND_SPACES = /[, ]+/;
const REGEX_ANY_WHITESPACE = /\s+/;
const MAX_INPUT_LENGTH = 1 << 24; // 16_777_216

const fullText = (html: string) => {
	const fullText = convert(html, {
		baseElements: {
			selectors: ["article"],
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
			// { selector: "table", format: "dataTable" },
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
		// formatters: {},
	});

	return fullText;
};

const title = ($: cheerio.CheerioAPI): ExtractResults => {
	const selectors: ExtractResults = [
		{ selector: "title", value: $("title").text() },
		{ selector: "meta[name='title']", value: $("meta[name='title']").attr("content") },
		{
			selector: "meta[property='og:title']",
			value: $("meta[property='og:title']").attr("content"),
		},
		{
			selector: "meta[name='twitter:title']",
			value: $("meta[name='twitter:title']").attr("content"),
		},
		{
			selector: "meta[name='dc.title']",
			value: $("meta[name='dc.title']").attr("content"),
		},
		{ selector: "meta[name='title']", value: $("meta[name='title']").attr("content") },
	];

	return selectors;
};

const authors = ($: cheerio.CheerioAPI): ExtractResults<"authors"> => {
	const selectors = [
		{
			selector: "meta[name='author']",
			value: $("meta[name='author']").map((_, el) => $(el).attr("content")),
		},
		{
			selector: "meta[name='dc.creator']",
			value: $("meta[name='dc.creator']").map((_, el) => $(el).attr("content")),
		},
		{
			selector: "meta[property='article:author']",
			value: $("meta[property='article:author']").map((_, el) => $(el).attr("content")),
		},
		{
			selector: "meta[name='twitter:creator']",
			value: $("meta[name='twitter:creator']").map((_, el) => $(el).attr("content")),
		},
		{
			selector: "meta[name='twitter:site']",
			value: $("meta[name='twitter:site']").map((_, el) => $(el).attr("content")),
		},
		{
			selector: "meta[property='og:site_name']",
			value: $("meta[property='og:site_name']").map((_, el) => $(el).attr("content")),
		},
	];

	return selectors;
};

const publishedAt = ($: cheerio.CheerioAPI): ExtractResults<"publicationDate"> => {
	const selectors = [
		{ selector: "meta[name='date']", value: $("meta[name='date']").attr("content") },
		{
			selector: "meta[property='article:published_time']",
			value: $("meta[property='article:published_time']").attr("content"),
		},
		{
			selector: "meta[name='article:published_time']",
			value: $("meta[name='article:published_time']").attr("content"),
		},
		{ selector: "meta[name='dc.date']", value: $("meta[name='dc.date']").attr("content") },
		{
			selector: "meta[name='dc.date.issued']",
			value: $("meta[name='dc.date.issued']").attr("content"),
		},
		{ selector: "meta[name='pubdate']", value: $("meta[name='pubdate']").attr("content") },
		{
			selector: "time[itemprop='datePublished']",
			value: $("time[itemprop='datePublished']").attr("datetime"),
		},
		{ selector: "time[pubdate]", value: $("time[pubdate]").attr("datetime") },
		{
			selector: "meta[property='og:article:published_time']",
			value: $("meta[property='og:article:published_time']").attr("content"),
		},
		{
			selector: "meta[name='parsely-pub-date']",
			value: $("meta[name='parsely-pub-date']").attr("content"),
		},
	];

	return selectors;
};

const abstract = ($: cheerio.CheerioAPI): ExtractResults<"abstract"> => {
	const selectors = [
		{ selector: "meta[name='abstract']", value: $("meta[name='abstract']").attr("content") },
		{
			selector: "meta[property='og:abstract']",
			value: $("meta[property='og:abstract']").attr("content"),
		},
		{
			selector: "meta[name='twitter:abstract']",
			value: $("meta[name='twitter:abstract']").attr("content"),
		},
		{
			selector: "meta[name='dc.abstract']",
			value: $("meta[name='dc.abstract']").attr("content"),
		},
		{ selector: "meta[name='abstract']", value: $("meta[name='abstract']").attr("content") },
		{ selector: "article p", value: $("article p").first().text() },
	];

	return selectors;
};

const imageUrl = ($: cheerio.CheerioAPI) => {
	const selectors: ExtractResults = [
		{
			selector: "meta[property='og:image']",
			value: $("meta[property='og:image']").attr("content"),
		},
		{
			selector: "meta[name='twitter:image']",
			value: $("meta[name='twitter:image']").attr("content"),
		},
		{ selector: "meta[itemprop='image']", value: $("meta[itemprop='image']").attr("content") },
		{ selector: "meta[name='image']", value: $("meta[name='image']").attr("content") },
		{ selector: "article img", value: $("article img").first().attr("src") },
	];

	return selectors;
};

// TODO: add field to db schema
const keywords = ($: cheerio.CheerioAPI) => {
	const selectors: ExtractResults = [
		{
			selector: "meta[name='keywords']",
			value: $("meta[name='keywords']").attr("content"),
		},
		{
			selector: "meta[property='article:tag']",
			value: $("meta[property='article:tag']").attr("content"),
		},
		{
			selector: "meta[name='news_keywords']",
			value: $("meta[name='news_keywords']").attr("content"),
		},
		{
			selector: "meta[name='sailthru.tags']",
			value: $("meta[name='sailthru.tags']").attr("content"),
		},
		{
			selector: "meta[name='parsely-tags']",
			value: $("meta[name='parsely-tags']").attr("content"),
		},
	];

	return selectors.map(({ selector }) =>
		selector.split(REGEX_COMMAS_AND_SPACES).filter((tag) => tag.trim() !== ""),
	);
};

// TODO: this probably shouldn't be an extractor function
const readTime = ($: cheerio.CheerioAPI): number => {
	const content = $("article").text();

	const wordCount = content.trim().split(REGEX_ANY_WHITESPACE).length;
	const readTimeInMinutes = Math.ceil(wordCount / 100);

	return readTimeInMinutes;
};

export { abstract, authors, fullText, imageUrl, keywords, publishedAt, readTime, title };
