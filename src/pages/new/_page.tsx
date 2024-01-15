import { trpcReact } from "@/client";
import { Server } from "@/hooks/useServer";
import { EditContentItem } from "./_components/EditContentItem";
import { EmptyQueue } from "./_components/EmptyQueue";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export const NewContentItemPage = () => {
	return (
		<Suspense>
			<Server>
				<main className="container flex flex-grow py-4">
					<Queue />
				</main>
			</Server>
		</Suspense>
	);
};

const Queue = () => {
	const { isLoading, data: contentItems } = trpcReact.contentItem.list.useQuery();
	if (isLoading) return <Skeleton className="h-20 w-20" />;
	if (!contentItems || !contentItems[0]) return <EmptyQueue />;

	return <EditContentItem contentItem={contentItems[0]} />;
};
