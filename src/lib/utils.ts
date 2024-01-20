import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const slugify = (str: string) => str.toLowerCase().replace(/\s+/g, "-");

export function takeFirst<T>(array: Array<T | null>): T | null {
	return array.find((element) => !!element || typeof element === "undefined") ?? null;
}

export function eagerFind<T, U>(array: T[], func: (item: T) => U | null): U | null {
	for (const item of array) {
		const result = func(item);
		if (result !== null) {
			return result;
		}
	}
	return null;
}
