import { P, isMatching } from "ts-pattern";

declare module "ts-pattern" {
	interface Pattern<T> {
		some: <P extends Pattern<T>>(pattern: P) => Pattern<T>;
	}
}

export const some = <T, P extends P.Pattern<T>>(pattern: P) => {
	const match = isMatching(pattern);
	return P.when((value: T[]): value is T[] => Array.isArray(value) && value.some(match));
};
