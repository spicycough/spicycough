import { type PropsWithChildren, type FormEvent, useState } from "react";

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
import { useQueue } from "../_hooks/useQueue";
import { ReloadIcon } from "@radix-ui/react-icons";

export const BulkAddDialog = ({ children }: PropsWithChildren) => {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { refresh } = useQueue();

	const submit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		const formData = new FormData(e.target as HTMLFormElement);

		return await fetch("/api/queue", {
			method: "POST",
			body: formData,
		})
			.then((res) => {
				console.debug("Response:", res);
				if (res.ok) {
					setOpen(false);
					refresh();
				}
			})
			.catch((err) => {
				console.error("Error:", err);
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="container flex flex-col sm:max-w-[425px] md:h-[360px] md:max-w-[680px]">
				<form className="flex h-full flex-col" onSubmit={submit}>
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
							disabled={isLoading}
							className="dark:bg-green-800 dark:text-white"
						>
							{!isLoading ? "Add to queue" : <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
