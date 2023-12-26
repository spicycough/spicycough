import { type ComponentPropsWithoutRef } from "react";

import { StagingQueue } from "./StagingQueue";
import { DetailsView } from "./DetailsView";

import { cn } from "@/lib/utils";
import { ActionsBar } from "./ActionsBar";
import { QueueProvider } from "../_hooks/QueueContext";

export const ContentItemPage = ({ className }: ComponentPropsWithoutRef<"div">) => {
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
