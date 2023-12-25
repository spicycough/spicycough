import { type ComponentPropsWithoutRef } from "react";

import { StagingQueue } from "./StagingQueue";
import { DetailsView } from "./DetailsView";

import { cn } from "@/lib/utils";
import { ActionsBar } from "./ActionsBar";

export const ContentItemPage = ({ className }: ComponentPropsWithoutRef<"div">) => {
	return (
		<div
			className={cn(
				"flex h-full flex-col rounded-lg border border-radiance-400 border-opacity-50 bg-gradient-to-b from-twilight-800 to-twilight-900 p-4",
				className,
			)}
		>
			<DetailsView className="" />
			<div className="flex w-full flex-col justify-end">
				<StagingQueue className="border">
					<ActionsBar />
				</StagingQueue>
			</div>
		</div>
	);
};
