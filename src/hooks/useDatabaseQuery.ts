import { useEffect, useState } from "react";

/**
 * Custom hook for executing a database query.
 * @param queryFn - A function that returns the database query.
 */
export const useDatabaseQuery = <T>(queryFn: () => Promise<T>) => {
	const [data, setData] = useState<T | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);

				const result = await queryFn();
				setData(result);

				setIsLoading(false);
			} catch (err: unknown) {
				setError(err instanceof Error ? err : new Error("An unknown error occurred"));

				setIsLoading(false);
			}
		};

		fetchData();
	}, [queryFn]);

	return { data, error, isLoading };
};
