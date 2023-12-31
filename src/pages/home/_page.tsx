import { ContentItemCard } from "@/components/content-item/ContentItemCard";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDatabase } from "@/db/useDatabase";
import { sql } from "drizzle-orm";
import type { ContentItem } from "@/db/schema";
import { useDatabaseQuery } from "@/hooks/useDatabaseQuery";
import { useMemo } from "react";

export const HomePage = () => {
	return (
		<div>
			<Featured />
		</div>
	);
};

export const Featured = () => {
	const { db, schema } = useDatabase();

	const { data } = useDatabaseQuery<ContentItem[]>(() =>
		db
			.select()
			.from(schema.contentItems)
			.orderBy(sql`RANDOM()`)
			.limit(1)
			.execute(),
	);

	const featuredContentItem = useMemo(() => data?.[0], [data]);

	return (
		<div>
			<ScrollArea>
				<Separator />
				<ContentItemCard item={featuredContentItem as ContentItem} />
			</ScrollArea>
		</div>
	);
};
