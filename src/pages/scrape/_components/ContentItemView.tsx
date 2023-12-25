import type { ComponentPropsWithoutRef } from "react";
import { Separator } from "@/components/ui/separator";
import { useQueue } from "../_hooks/useQueue";
import { cn } from "@/lib/utils";

export const View = ({ className }: ComponentPropsWithoutRef<"div">) => {
	const { rowSelection } = useQueue();

	return (
		<div className={cn("grid h-full grid-cols-[1fr,min-content,1fr] gap-3 pt-6", className)}>
			<div className="overflow-y-scroll rounded-lg p-1 pl-3">
				<h2 className="font-bold text-white opacity-100">Abstract</h2>
			</div>
			<Separator orientation="vertical" className="h-full self-stretch" />
			<div className="overflow-y-scroll rounded-lg p-1 pl-3">
				<h2 className="font-bold text-white">Summary</h2>
				<p>AI Summary</p>
			</div>
		</div>
	);
};
