export interface ContentSelectors {
	title: string[];
	authors: string[];
	publicationDate: string[];
	abstract: string[];
	fullText: string[];
}

export interface ExtractedValue {
	fullText: string;
	image: string;
	title: string;
	authors: string[];
	publicationDate: string;
	description: string;
	abstract: string;
	tags: string[];
	readTime: number;
}

export interface ExtractResult<Value extends keyof ExtractedValue = keyof ExtractedValue> {
	selector: string;
	value: ExtractedValue[Value] | undefined;
}

export type ExtractResults<Value extends keyof ExtractedValue = keyof ExtractedValue> =
	ExtractResult<Value>[];

export const Hostnames = {
	NATURE: "nature.com",
} as const;

export type Hostnames = (typeof Hostnames)[keyof typeof Hostnames];
