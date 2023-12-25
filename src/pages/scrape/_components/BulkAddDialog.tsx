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
import { type PropsWithChildren, type FormEvent } from "react";

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
			<DialogContent className="sm:max-w-[425px] md:h-[360px] md:max-w-[680px]">
				<form onSubmit={submit}>
					<DialogHeader>
						<DialogTitle>Add urls</DialogTitle>
						<DialogDescription>Copy/paste urls, one per line.</DialogDescription>
					</DialogHeader>
					<Textarea required id="urls" name="urls" placeholder="Enter urls, one per line" />
					<DialogFooter className="">
						<Button type="submit" className="dark:bg-green-800 dark:text-white">
							Add to queue
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
