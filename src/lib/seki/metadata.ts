import type { NewContentItem } from "@/db/schema";
import * as cheerio from "cheerio";

export const parseMetadata = async (
	html: string,
): Promise<Omit<NewContentItem, "permalink" | "slug">> => {
	const $ = cheerio.load(html, { recognizeSelfClosing: true });

	return {
		imageUrl: getImage($),
		title: getTitle($),
		authors: getAuthors($) ?? [],
		publishedAt: getPublicationAt($),
		abstract: getAbstract($),
	};
};

const getTitle = (_$: cheerio.CheerioAPI) => {
	const $ = _$;

	return (
		$("h1.c-article-title").text() ||
		$("title").text() ||
		$("meta[name='title']").attr("content") ||
		document.title ||
		($("h1").length > 0 ? $("h1").text() : "") ||
		""
	);
};

const getImage = (_$: cheerio.CheerioAPI) => {
	const $ = _$;

	return (
		$("meta[property='og:image']").attr("content") ||
		$("meta[name='twitter:image']").attr("content") ||
		$("meta[itemprop='image']").attr("content") ||
		$("meta[name='image']").attr("content") ||
		""
	);
};

const getAuthors = (_$: cheerio.CheerioAPI): string[] => {
	const $ = _$;

	return (
		$("li.c-article-author-list__item > a").text() ||
		$("meta[name='author']").attr("content") ||
		$("meta[property='article:author']").attr("content") ||
		$("meta[name='twitter:creator']").attr("content") ||
		$("meta[name='twitter:site']").attr("content") ||
		$("meta[property='og:site_name']").attr("content") ||
		""
	).split(",");
};

const getTags = (_$: cheerio.CheerioAPI) => {
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

const getPublicationAt = (_$: cheerio.CheerioAPI): Date => {
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

	return standardizedDate?.toString() !== "Invalid Date" ? standardizedDate : new Date();
};

const getReadTime = (_$: cheerio.CheerioAPI, options = { wordsPerMinute: 100 }) => {
	const $ = _$;

	const content = $("article").text();
	const anyWhiteSpace = /\s+/;
	const wordCount = content.trim().split(anyWhiteSpace).length;
	const readTimeInMinutes = Math.ceil(wordCount / options.wordsPerMinute);
	return readTimeInMinutes;
};

const getDescription = (_$: cheerio.CheerioAPI) => {
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

const getAbstract = (_$: cheerio.CheerioAPI) => {
	const $ = _$;

	return (
		$(`article section[data-title="Abstract"] p`).text() ||
		$("meta[name='abstract']").attr("content") ||
		$("meta[property='og:abstract']").attr("content") ||
		$("meta[name='twitter:abstract']").attr("content") ||
		$("meta[name='dc.abstract']").attr("content") ||
		$("meta[name='abstract']").attr("content") ||
		$("article p").first().text() ||
		""
	);
};
