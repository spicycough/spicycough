import type { ComponentPropsWithoutRef, PropsWithChildren, ReactNode } from "react";

import { MagicWandIcon, TextAlignBottomIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import { useQueue } from "../_hooks/useQueue";

type PanelProps = PropsWithChildren<{
	title: string;
	icon?: ReactNode;
}>;

const Panel = ({ title, icon, children }: PanelProps) => {
	return (
		<ResizablePanel
			defaultSize={50}
			minSize={3}
			className="flex flex-col space-y-3 rounded-lg px-6 pb-3 pt-6"
		>
			<div className="flex items-center space-x-3 align-text-top">
				{icon}
				<h2 className="font-bold uppercase text-white">{title}</h2>
			</div>
			<div className="overflow-y-scroll pr-6">{children}</div>
		</ResizablePanel>
	);
};

export const DetailsView = ({ className }: ComponentPropsWithoutRef<"div">) => {
	const { selected } = useQueue();

	return (
		<div className={cn("flex flex-col border-x border-t pt-3", className)}>
			<ResizablePanelGroup direction="horizontal" className="flex-1">
				<Panel title="All" icon={<TextAlignBottomIcon />}>
					<p>{selected?.fullText}</p>
				</Panel>
				<ResizableHandle withHandle={true} />
				<ResizablePanel defaultSize={50} className="flex flex-col rounded-lg">
					<ResizablePanelGroup direction="vertical">
						<Panel title="Abstract" icon={<MagicWandIcon />}>
							<p className="">{selected?.abstract}</p>
						</Panel>
						<ResizableHandle withHandle={true} />
						<Panel title="Summary" icon={<MagicWandIcon />}>
							<p className="">{selected?.abstract}</p>
						</Panel>
					</ResizablePanelGroup>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
};
