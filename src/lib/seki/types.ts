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

export const Hostnames = {
	NATURE: "nature.com",
} as const;

export type Hostnames = (typeof Hostnames)[keyof typeof Hostnames];
