/**
 * Extracts the domain from a given URL, removing the 'www' prefix if present.
 * It works with different URL formats, including those with http, https,
 * and with or without the 'www' prefix.
 */
export const getDomainFromUrl = (url: string): string => {
	const hostname = new URL(url).hostname;
	return hostname.replace(/^www\./, "");
};
