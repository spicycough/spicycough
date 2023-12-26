import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { MagicWandIcon, TextAlignBottomIcon } from "@radix-ui/react-icons";
import type { ComponentPropsWithoutRef } from "react";
import { type UseQueue } from "../_hooks/useQueue";

export const DetailsView = ({
	className,
	queue,
}: ComponentPropsWithoutRef<"div"> & { queue: UseQueue }) => {
	const { selected } = queue;

	console.log(selected);

	const headerStyle = "font-bold text-white";

	return (
		<div className={cn("max-h-full gap-3 overflow-y-scroll pt-6", className)}>
			<ResizablePanelGroup direction="horizontal" className="pb-3">
				<ResizablePanel className="flex flex-col rounded-lg pl-3">
					<div className="flex space-x-2 align-middle">
						<TextAlignBottomIcon />
						<h2 className={headerStyle}>Abstract</h2>
					</div>
					<div className="overflow-y-scroll py-6 pr-6">
						<p>{selected?.fullText}</p>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle={true} />
				<ResizablePanel className="flex flex-col overflow-y-scroll rounded-lg pl-3">
					<div className="flex space-x-2 align-middle">
						<MagicWandIcon />
						<h2 className={headerStyle}>Summary</h2>
					</div>
					<p className="py-6 pr-6">{selected?.abstract}</p>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
};
