import { useRef, type ComponentPropsWithoutRef } from "react";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import { StagingQueue } from "./StagingQueue";
import { DetailsView } from "./DetailsView";

import { cn } from "@/lib/utils";
import { ActionsBar } from "./ActionsBar";
import type { ImperativePanelGroupHandle, ImperativePanelHandle } from "react-resizable-panels";

export const ContentItemPage = ({ className }: ComponentPropsWithoutRef<"div">) => {
	return (
		<ResizablePanelGroup direction="vertical">
			<div
				className={cn(
					"flex h-full flex-col rounded-lg bg-gradient-to-b from-twilight-800 to-twilight-900 p-4",
					className,
				)}
			>
				<ResizablePanel className="">
					<DetailsView className="" />
				</ResizablePanel>
				<ResizableHandle withHandle={true} />
				<div className="flex flex-col justify-end">
					<div className="border-x border-b">
						<StagingQueue className="h-full border-b" />
						<ActionsBar />
					</div>
				</div>
			</div>
		</ResizablePanelGroup>
	);
};
