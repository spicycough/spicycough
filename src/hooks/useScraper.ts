import { scrape, type ScrapeOptions } from "@seki";

export const useScraper = () => {
	return async (url: string, options: ScrapeOptions = {}) => {
		const isValidUrl = getIsValidUrl(url);
		if (!isValidUrl) return { error: "Invalid url" };

		try {
			return await scrape(url, options);
		} catch (error: unknown) {
			return { error: (error as Error).message || "An error occurred during scraping." };
		}
	};
};

/**
 * Validates if a string is a valid URL.
 * @param url - The string to validate as URL.
 * @returns True if valid URL, else false.
 */
const getIsValidUrl = (url: string) => {
	try {
		new URL(url);
		return true;
	} catch (err) {
		return false;
	}
};
