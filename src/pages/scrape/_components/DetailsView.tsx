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
		<div className={cn("flex h-full gap-3 pt-6", className)}>
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel className={"rounded-lg pl-3"}>
					<div className="flex space-x-2 align-middle">
						<TextAlignBottomIcon />
						<h2 className={headerStyle}>Abstract</h2>
					</div>
					<div className="overflow-y-scroll">
						<p>{selected?.fullText}</p>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle={true} />
				<ResizablePanel className={"flex overflow-y-scroll rounded-lg pl-3"}>
					<div className="flex space-x-2 align-middle">
						<MagicWandIcon />
						<h2 className={headerStyle}>Summary</h2>
					</div>
					<div className="overflow-y-scroll">
						<p>{selected?.abstract}</p>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
};
