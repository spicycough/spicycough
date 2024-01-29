import { default as ms, type Rules } from "metascraper";
import authorRules from "metascraper-author";
import dateRules from "metascraper-date";
import descriptionRules from "metascraper-description";
import imageRules from "metascraper-image";
import langRules from "metascraper-lang";
import logoRules from "metascraper-logo";
import logoFaviconRules from "metascraper-logo-favicon";
import publisherRules from "metascraper-publisher";
import readabilityRules from "metascraper-readability";
import titleRules from "metascraper-title";
import urlRules from "metascraper-url";
import { match } from "ts-pattern";

const Metadata = {
	AUTHOR: "author",
	DATA: "date",
	DESCRIPTION: "description",
	IMAGE: "image",
	LANG: "lang",
	LOGO: "logo",
	LOGO_FAVICON: "logoFavicon",
	PUBLISHER: "publisher",
	READABILITY: "readability",
	TITLE: "title",
	URL: "url",
} as const;

const metadata = Object.values(Metadata);

type Metadata = (typeof Metadata)[keyof typeof Metadata];

interface ExtractContentsOpts {
	html: string;
	url: string;
	fields?: Metadata[];
}

const getRules = (fields: Metadata[] = metadata) => {
	const rules: Rules[] = [];

	fields.map((field) => {
		match(field)
			.with(Metadata.AUTHOR, () => rules.push(authorRules()))
			.with(Metadata.DATA, () => rules.push(dateRules({ datePublished: true, dateModified: true })))
			.with(Metadata.DESCRIPTION, () => rules.push(descriptionRules()))
			.with(Metadata.IMAGE, () => rules.push(imageRules()))
			.with(Metadata.LANG, () => rules.push(langRules()))
			.with(Metadata.LOGO, () => rules.push(logoRules()))
			.with(Metadata.LOGO_FAVICON, () => rules.push(logoFaviconRules()))
			.with(Metadata.PUBLISHER, () => rules.push(publisherRules()))
			.with(Metadata.READABILITY, () => rules.push(readabilityRules()))
			.with(Metadata.TITLE, () => rules.push(titleRules()))
			.with(Metadata.URL, () => rules.push(urlRules()))
			.exhaustive();
	});

	return rules;
};

export const extractMetadata = async ({ html, url, fields }: ExtractContentsOpts) => {
	const rules = getRules(fields);
	const metascraper = ms(rules);
	return await metascraper({ url, html });
};
