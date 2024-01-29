import { type ExtendedOptionsOfTextResponseBody, gotScraping } from "got-scraping";

import { extractByParagraph } from "./content";
import { extractMetadata } from "./metadata";

type ExtractOpts = ExtendedOptionsOfTextResponseBody;

const useExtract = async (url: string, opts?: ExtractOpts) => {
	const response = await gotScraping(url, opts);

	const metadata = await extractMetadata({ html: response.body, url: url });
	const content = await extractByParagraph(response.body);

	return {
		response,
		metadata,
		content,
	};
};

export { useExtract };
