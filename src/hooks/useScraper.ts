import { scrape } from "@spicycrawler/src/main";

export const useScraper = () => {
	return async (url: string) => await scrape(url);
};
