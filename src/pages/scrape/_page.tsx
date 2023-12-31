import { type ComponentPropsWithoutRef, useEffect } from "react";

import { cn } from "@/lib/utils";

import { QueueProvider } from "./_hooks/QueueContext";
import { StagingQueue } from "./_components/StagingQueue";
import { DetailsView } from "./_components/DetailsView";
import { ActionsBar } from "./_components/ActionsBar";

export const ContentItemPage = ({ className }: ComponentPropsWithoutRef<"div">) => {
	// Submits on open
	useEffect(() => {
		const formData = new FormData();
		formData.set("urls", "https://www.nature.com/articles/s41577-023-00904-7");

		fetch("/api/queue", {
			method: "POST",
			body: formData,
		});
	}, []);

	return (
		<QueueProvider>
			<div
				className={cn(
					"flex max-h-full min-h-full flex-col rounded-lg border border-radiance-400 border-opacity-50 bg-gradient-to-b from-twilight-800 to-twilight-900 p-4",
					className,
				)}
			>
				<DetailsView className="max-h-full flex-grow" />
				<div className="flex flex-col">
					<StagingQueue className="border">
						<ActionsBar />
					</StagingQueue>
				</div>
			</div>
		</QueueProvider>
	);
};
