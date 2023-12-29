import React, {
	createContext,
	useState,
	useCallback,
	useEffect,
	useMemo,
	type PropsWithChildren,
} from "react";

import { useDatabase } from "@/db/useDatabase";
import type { ContentItemStaging } from "@/db/schema/contentItems";

export type UseQueue = {
	data: ContentItemStaging[];
	error: Error | null;
	isLoading: boolean;
	selected: ContentItemStaging | null;
	setSelected: React.Dispatch<React.SetStateAction<ContentItemStaging | null>>;
};

const defaultQueueState: UseQueue = {
	data: [],
	error: null,
	isLoading: false,
	selected: null,
	setSelected: () => {},
};

export const QueueContext = createContext<UseQueue>(defaultQueueState);

export const QueueProvider = ({ children }: PropsWithChildren) => {
	const { db, schema } = useDatabase();
	const [data, setData] = useState<ContentItemStaging[]>([]);
	const [selected, setSelected] = useState<ContentItemStaging | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchQueueData = useCallback(async () => {
		setIsLoading(true);
		try {
			const items = await db
				.select()
				.from(schema.contentItemStaging)
				.orderBy((item) => item.permalink)
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
	}, []);

	const contextValue = useMemo(
		() => ({
			data,
			error,
			isLoading,
			selected,
			setSelected,
		}),
		[data, error, isLoading, selected],
	);

	return <QueueContext.Provider value={contextValue}>{children}</QueueContext.Provider>;
};
