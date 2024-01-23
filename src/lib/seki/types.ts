export interface Metadata {
	image: string;
	title: string;
	author: string;
	publicationDate: string | null;
	description: string;
	abstract: string;
	tags: string[];
	readTime: number;
}

export interface Content {
	abstract: string;
	fullText: string;
}

export interface ContentSelectors {
	title: string[];
	authors: string[];
	publicationDate: string[];
	abstract: string[];
	fullText: string[];
}

export const Hostnames = {
	NATURE: "nature.com",
} as const;

export type Hostnames = (typeof Hostnames)[keyof typeof Hostnames];
