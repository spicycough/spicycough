import { type ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

import { QueueProvider } from "./_hooks/QueueContext";
import { StagingQueue } from "./_components/StagingQueue";
import { DetailsView } from "./_components/DetailsView";
import { ActionsBar } from "./_components/ActionsBar";

export const ContentItemPage = ({ className }: ComponentPropsWithoutRef<"div">) => {
	return (
		<QueueProvider>
			<div
				className={cn(
					"container flex flex-1 flex-col rounded-lg border border-gray-800 border-opacity-50 bg-gradient-to-b from-twilight-800 to-twilight-900 p-4 pt-4",
					className,
				)}
			>
				<DetailsView className="flex-auto" />
				<div className="flex-none space-y-4">
					<StagingQueue className="border" />
					<ActionsBar />
				</div>
			</div>
		</QueueProvider>
	);
};
