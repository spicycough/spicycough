import type { ContentItemStaging } from "@/db/schema/contentItems";
import { useDatabase } from "@/db/useDatabase";
import { useCallback, useEffect, useState } from "react";

export const useQueue = () => {
	const { db, schema } = useDatabase();

	const [data, setData] = useState<ContentItemStaging[]>([]);
	const [rowSelection, setRowSelection] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetch = useCallback(async () => {
		await db
			.select()
			.from(schema.contentItemStaging)
			.orderBy((item) => item.sourceUrl)
			.execute()
			.then((items) => setData(items))
			.catch((err) => setError(err))
			.finally(() => {
				setIsLoading(false);
			});
	}, [db, data]);

	useEffect(() => {
		fetch();
	}, []);

	return { data, error, isLoading, rowSelection, setRowSelection };
};
