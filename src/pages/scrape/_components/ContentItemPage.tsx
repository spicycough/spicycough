import type { ComponentPropsWithoutRef } from "react";
import { Separator } from "@/components/ui/separator";
import { Queue } from "./ContentItemQueue";
import { View } from "./ContentItemView";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

export const ContentItemPage = ({ className }: ComponentPropsWithoutRef<"div">) => {
	return (
		<div
			className={cn(
				"p flex h-full flex-col rounded-lg bg-gradient-to-b from-twilight-800 to-twilight-900 p-4",
				className,
			)}
		>
			<View className="flex-1" />

			<div className="min-h-1/5 flex-0 h-1/3">
				<Queue className="h-full border" />
			</div>

			<div className="flex w-full justify-end space-x-4 border-x pr-4">
				<Separator orientation="vertical" />
				<div className="p-2">
					<Button variant="outline" size="default">
						<PlusIcon className="size-4" />
					</Button>
				</div>
				<Separator orientation="vertical" />
				<div className="p-2">
					<Button variant="outline" size="default">
						<PlusIcon className="size-4" />
					</Button>
				</div>
			</div>
			<div className="">
				<Separator />
			</div>
		</div>
	);
};
