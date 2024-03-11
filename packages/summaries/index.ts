import { summarize } from "./src/summaries";
import { getPageContent, nhm } from "./src/utils";

export const createSummary = async (url: string) => {
	const sections = await getPageContent(url);
	const pageContent = nhm.translate(sections.join("\n\n"));
	return await summarize({ text: pageContent });
};

// const _url = "https://theconversation.com/mounting-research-shows-that-covid-19-leaves-its-mark-on-the-brain-including-with-significant-drops-in-iq-scores-224216";

type LiteratureItem = {};
