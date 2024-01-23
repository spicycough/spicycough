import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

import { trpcReact } from "@/client";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const DeleteAllButton = ({ className, children, ...props }: ButtonProps) => {
	const utils = trpcReact.useUtils();

	const {
		mutate: deleteAllContentItems,
		isPending,
		data,
	} = trpcReact.contentItem.clear.useMutation({
		onMutate: () => {},
		onSuccess: () => {
			toast.success("Success", {
				description: `Deleted all`,
				position: "top-right",
			});
		},
		onError: (err) => {
			toast.error("Error", {
				description: err instanceof Error ? err.message : "Unknown error",
				position: "top-right",
			});
		},
		onSettled: () => {
			utils.contentItem.invalidate();
		},
	});

	return (
		<TooltipProvider delayDuration={350}>
			<Tooltip>
				<TooltipTrigger asChild>
					<span tabIndex={0}>
						<Button
							className={cn("rounded-md dark:bg-destructive ", className)}
							disabled={!!data || isPending}
							onClick={(e) => {
								e.stopPropagation();
								deleteAllContentItems();
							}}
							{...props}
						>
							{!isPending ? children : <ReloadIcon className="animate-spin" />}
						</Button>
					</span>
				</TooltipTrigger>
				<TooltipContent>Nothing to delete</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
