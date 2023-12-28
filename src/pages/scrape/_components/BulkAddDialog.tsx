import { type PropsWithChildren, type FormEvent } from "react";

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
	const submit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.target as HTMLFormElement);
		const body = formData.get("urls")?.toString();
		console.debug("Request body:", body);

		return await fetch("/api/queue", {
			method: "POST",
			body: formData,
		});
	};

	return (
		<Dialog>
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
						<Button type="submit" className="dark:bg-green-800 dark:text-white">
							Add to queue
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
