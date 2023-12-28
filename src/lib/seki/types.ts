import { Hostnames } from "./constants";

import type { ExtendedOptionsOfTextResponseBody, Response } from "got-scraping";

export type RouteContext = {
	response: Response<string>;
};

export type ScrapeOptions = ExtendedOptionsOfTextResponseBody;

export type ParsingFunction = (context: RouteContext) => ParsedData;

export type ParsedData = {
	title: string;
	authors: string[];
	publicationDate: string;
	abstract: string;
	fullText: string;
};

export type ParsedResponse = {
	data: ParsedData;
	response: Response<string>;
};

export type Hostnames = (typeof Hostnames)[keyof typeof Hostnames];
