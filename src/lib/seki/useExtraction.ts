import * as cheerio from "cheerio";
import type { Metadata } from "./types";

const extractTitle = (_$: cheerio.CheerioAPI) => {
	const $ = _$;

	return (
		$("title").text() ||
		$("meta[name='title']").attr("content") ||
		document.title ||
		($("h1").length > 0 ? $("h1").text() : "") ||
		""
	);
};

const extractImage = (_$: cheerio.CheerioAPI) => {
	const $ = _$;

	return (
		$("meta[property='og:image']").attr("content") ||
		$("meta[name='twitter:image']").attr("content") ||
		$("meta[itemprop='image']").attr("content") ||
		$("meta[name='image']").attr("content") ||
		""
	);
};

const extractAuthors = (_$: cheerio.CheerioAPI) => {
	const $ = _$;

	return (
		$("meta[name='author']").attr("content") ||
		$("meta[property='article:author']").attr("content") ||
		$("meta[name='twitter:creator']").attr("content") ||
		$("meta[name='twitter:site']").attr("content") ||
		$("meta[property='og:site_name']").attr("content") ||
		""
	);
};

const extractTags = (_$: cheerio.CheerioAPI) => {
	const $ = _$;

	const tags =
		$("meta[name='keywords']").attr("content") ||
		$("meta[property='article:tag']").attr("content") ||
		$("meta[name='news_keywords']").attr("content") ||
		$("meta[name='sailthru.tags']").attr("content") ||
		$("meta[name='parsely-tags']").attr("content") ||
		"";

	const allCommaAndSpaces = /[, ]+/;
	return tags.split(allCommaAndSpaces).filter((tag) => tag.trim() !== "");
};

const extractPublicationDate = (_$: cheerio.CheerioAPI) => {
	const $ = _$;

	const date =
		$("meta[name='date']").attr("content") ||
		$("meta[property='article:published_time']").attr("content") ||
		$("meta[name='article:published_time']").attr("content") ||
		$("meta[name='dc.date']").attr("content") ||
		$("meta[name='dc.date.issued']").attr("content") ||
		$("meta[name='pubdate']").attr("content") ||
		$("time[itemprop='datePublished']").attr("datetime") ||
		$("time[pubdate]").attr("datetime") ||
		$("meta[property='og:article:published_time']").attr("content") ||
		$("meta[name='parsely-pub-date']").attr("content") ||
		"";

	const standardizedDate = new Date(date);

	return standardizedDate?.toString() !== "Invalid Date" ? standardizedDate.toISOString() : null;
};

const extractReadTime = (_$: cheerio.CheerioAPI, options = { wordsPerMinute: 100 }) => {
	const $ = _$;

	const content = $("article").text();
	const anyWhiteSpace = /\s+/;
	const wordCount = content.trim().split(anyWhiteSpace).length;
	const readTimeInMinutes = Math.ceil(wordCount / options.wordsPerMinute);
	return readTimeInMinutes;
};

const extractDescription = (_$: cheerio.CheerioAPI) => {
	const $ = _$;

	return (
		$("meta[name='description']").attr("content") ||
		$("meta[property='og:description']").attr("content") ||
		$("meta[name='twitter:description']").attr("content") ||
		$("meta[name='dc.description']").attr("content") ||
		$("meta[name='summary']").attr("content") ||
		$("article p").first().text() ||
		""
	);
};

const extractAbstract = (_$: cheerio.CheerioAPI) => {
	const $ = _$;

	return (
		$("meta[name='abstract']").attr("content") ||
		$("meta[property='og:abstract']").attr("content") ||
		$("meta[name='twitter:abstract']").attr("content") ||
		$("meta[name='dc.abstract']").attr("content") ||
		$("meta[name='abstract']").attr("content") ||
		$("article p").first().text() ||
		""
	);
};

export const useExtraction = async (html: string): Promise<Metadata> => {
	const $ = cheerio.load(html, { recognizeSelfClosing: true });

	return {
		image: extractImage($),
		title: extractTitle($),
		author: extractAuthors($),
		publicationDate: extractPublicationDate($),
		description: extractDescription($),
		abstract: extractAbstract($),
		tags: extractTags($),
		readTime: extractReadTime($),
	};
};
