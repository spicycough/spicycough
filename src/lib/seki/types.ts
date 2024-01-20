import { Hostnames } from "./constants";

import type { ExtendedOptionsOfTextResponseBody, Response } from "got-scraping";

export type RouteContext = {
	response: Response<string>;
};

export type ScrapeOptions = ExtendedOptionsOfTextResponseBody;

export type ParsingFunction = (context: RouteContext) => ParsedData;

export type ParsedData = {
	title: string;
	authors: string;
	publicationDate: string;
	abstract: string;
	fullText: string;
};

export type Metadata = {
	image: string;
	title: string;
	author: string;
	publicationDate: string | null;
	description: string;
	abstract: string;
	tags: string[];
	readTime: number;
};

export type Content = {
	abstract: string;
	fullText: string;
};

export type ContentSelectors = {
	title: string[];
	authors: string[];
	publicationDate: string[];
	abstract: string[];
	fullText: string[];
};

export type ParsedResponse = {
	data: ParsedData;
	response: Response<string>;
};

export type Hostnames = (typeof Hostnames)[keyof typeof Hostnames];
