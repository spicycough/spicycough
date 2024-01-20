import type { ContentItem, NewContentItem } from "@/db/schema";
import * as cheerio from "cheerio";

type NonmetadataFields = Omit<
	NewContentItem,
	"id" | "kind" | "slug" | "permalink" | "createdAt" | "updatedAt"
>;

type SelectorFunction = ($: cheerio.CheerioAPI) => string | string[];

type Selectors = Record<keyof NonmetadataFields, cheerio.Cheerio<cheerio.Element> | null>;

const EMPTY_SELECTORS: Selectors = {
	title: null,
	authors: null,
	publishedAt: null,
	imageUrl: null,
	abstract: null,
	fullText: null,
};

const DEFAULT_SELECTORS: Selectors = {
	title: $("title"),
	authors: $("meta[name='author']"),
	publishedAt: $("meta[name='date']"),
	imageUrl: $("meta[property='og:image']"),
	abstract: $("meta[name='description']"),
	fullText: $("article"),
};

const NATURE = {
	hostname: "nature.com",
	selectors: {
		title: ($) => [$("h1").text()],
		authors: null,
	},
};
