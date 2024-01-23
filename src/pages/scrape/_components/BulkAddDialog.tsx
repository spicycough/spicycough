import { ReloadIcon } from "@radix-ui/react-icons";
import { type FormEvent, type PropsWithChildren, useState } from "react";
import { toast } from "sonner";

import { trpcReact } from "@/client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export const BulkAddDialog = ({ children }: PropsWithChildren) => {
	const [open, setOpen] = useState(false);

	const { mutate, data, isPending } = trpcReact.contentItem.create.useMutation({
		onMutate: async () => {
			setOpen(false);
		},
		onSuccess: async (_, { urls }) => {
			toast.success("Success", {
				description: `Created ${urls.length} content items`,
				position: "top-right",
			});
		},
		onError: async (err) => {
			toast.error("Error", {
				description: err instanceof Error ? err.message : "Unknown error",
				position: "top-right",
			});
		},
		onSettled: async () => {},
	});

	const submit = async (e: FormEvent<HTMLFormElement>) => {
		const formData = new FormData(e.target as HTMLFormElement);
		const urls = formData.get("urls") as string;

		return mutate({ urls: urls.split("\n") });
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="container flex flex-col sm:max-w-[425px] md:h-[360px] md:max-w-[680px]">
				<form
					className="flex h-full flex-col"
					onSubmit={(e) => {
						e.preventDefault();
						submit(e);
					}}
				>
					<DialogHeader className="pb-4">
						<DialogTitle>Add urls</DialogTitle>
						<DialogDescription>Copy/paste urls, one per line.</DialogDescription>
					</DialogHeader>
					<Textarea
						required
						id="urls"
						name="urls"
						placeholder="Enter urls, one per line"
						className="flex-1"
					/>
					<DialogFooter className="pt-4">
						<Button
							type="submit"
							size="default"
							disabled={!!data || isPending}
							className="dark:bg-green-800 dark:text-white"
						>
							{!isPending ? "Add to queue" : <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
