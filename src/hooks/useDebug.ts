import { writeFile } from "fs";

export const useDebug = () => {
	// Creates filename based on current timestamp
	const fn = new Date().toISOString().replace(/:/g, "-") + ".md";

	const write = (data: string, filename: string = fn) => {
		if (process.env.PROD) {
			return;
		}

		writeFile(filename, data, (err) => {
			if (err) {
				return console.error(err);
			}
		});

		console.debug(`Writing to ${filename}`);
	};

	return { write };
};
