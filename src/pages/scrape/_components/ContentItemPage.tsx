import type { ComponentPropsWithoutRef } from "react";
import { Separator } from "@/components/ui/separator";
import { Queue } from "./ContentItemQueue";
import { View } from "./ContentItemView";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ListStartIcon } from "lucide-react";
import { BulkAddDialog } from "./BulkAddDialog";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

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
					<View className="" />
				</ResizablePanel>
				<ResizableHandle withHandle={true} />
				<ResizablePanel className="">
					<div className="flex flex-col justify-end">
						<div className="border-x border-b">
							<Queue className="h-full" />
						</div>

						<div className="flex w-full justify-end space-x-4 border-x border-b pr-4">
							<Separator orientation="vertical" />
							<div className="p-2">
								<BulkAddDialog>
									<Button
										variant="outline"
										size="default"
										className="rounded-lg dark:bg-warmth-500 dark:text-midnight-800"
									>
										<ListStartIcon className="size-4" />
									</Button>
								</BulkAddDialog>
							</div>
						</div>
					</div>
				</ResizablePanel>
			</div>
		</ResizablePanelGroup>
	);
};
