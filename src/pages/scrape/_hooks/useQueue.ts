import type { ContentItemStaging } from "@/db/schema/contentItems";
import { useDatabase } from "@/db/useDatabase";
import type { RowSelectionState } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";

export type UseQueue = {
	data: ContentItemStaging[];
	error: Error | null;
	isLoading: boolean;
	rowSelection: RowSelectionState;
	setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
	selected: ContentItemStaging | null;
	setSelected: React.Dispatch<React.SetStateAction<ContentItemStaging | null>>;
};

export const useQueue = (): UseQueue => {
	const { db, schema } = useDatabase();

	const [data, setData] = useState<ContentItemStaging[]>([]);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [selected, setSelected] = useState<ContentItemStaging | null>(null);
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

	return { data, error, isLoading, rowSelection, setRowSelection, selected, setSelected };
};
