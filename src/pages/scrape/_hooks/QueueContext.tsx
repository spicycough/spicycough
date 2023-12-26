import React, {
	createContext,
	useState,
	useCallback,
	useEffect,
	useMemo,
	type PropsWithChildren,
} from "react";
import type { ContentItemStaging } from "@/db/schema/contentItems";
import type { RowSelectionState } from "@tanstack/react-table";
import { useDatabase } from "@/db/useDatabase";

export type UseQueue = {
	data: ContentItemStaging[];
	error: Error | null;
	isLoading: boolean;
	rowSelection: RowSelectionState;
	setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
	selected: ContentItemStaging | null;
	setSelected: React.Dispatch<React.SetStateAction<ContentItemStaging | null>>;
};

const defaultQueueState: UseQueue = {
	data: [],
	error: null,
	isLoading: false,
	rowSelection: {},
	setRowSelection: () => {},
	selected: null,
	setSelected: () => {},
};

export const QueueContext = createContext<UseQueue>(defaultQueueState);

export const QueueProvider = ({ children }: PropsWithChildren) => {
	const { db, schema } = useDatabase();
	const [data, setData] = useState<ContentItemStaging[]>([]);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [selected, setSelected] = useState<ContentItemStaging | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchQueueData = useCallback(async () => {
		setIsLoading(true);
		try {
			const items = await db
				.select()
				.from(schema.contentItemStaging)
				.orderBy((item) => item.sourceUrl)
				.execute();
			setData(items);
		} catch (err) {
			console.error("Failed to fetch queue data:", err);
			setError(err instanceof Error ? err : new Error("Error fetching queue data"));
		} finally {
			setIsLoading(false);
		}
	}, [db, schema]);

	useEffect(() => {
		fetchQueueData();
	}, [fetchQueueData]);

	const contextValue = useMemo(
		() => ({
			data,
			error,
			isLoading,
			rowSelection,
			setRowSelection,
			selected,
			setSelected,
		}),
		[data, error, isLoading, rowSelection, selected],
	);

	return <QueueContext.Provider value={contextValue}>{children}</QueueContext.Provider>;
};
