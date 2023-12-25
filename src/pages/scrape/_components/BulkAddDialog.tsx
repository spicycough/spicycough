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
import type { NewContentItemQueue } from "@/db/schema/contentItems";
import { useDatabase } from "@/db/useDatabase";
import { useCallback, type PropsWithChildren, type FormEvent } from "react";
import { toast } from "sonner";

export const BulkAddDialog = ({ children }: PropsWithChildren) => {
	const { db, schema } = useDatabase();

	const submit = useCallback((event: FormEvent<HTMLDivElement>) => {
		event.preventDefault();

		const textarea = event.currentTarget.querySelector("textarea");
		const urls = textarea?.value.split("\n").filter(Boolean) ?? [];

		const records: NewContentItemQueue[] = urls.map((url: string) => ({ sourceUrl: url }));
		db.insert(schema.contentItemQueue)
			.values(records)
			.execute()
			.then((items) => {
				toast.success(`Added ${items.rowsAffected} items to queue.`);
			})
			.catch((error) => {
				toast.error(error.message);
			});

		return null;
	}, []);

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] md:h-[360px] md:max-w-[680px]" onSubmit={submit}>
				<DialogHeader>
					<DialogTitle>Add urls</DialogTitle>
					<DialogDescription>Copy/paste urls, one per line.</DialogDescription>
				</DialogHeader>
				<Textarea name="urls" id="urls" placeholder="Enter urls, one per line" />
				<DialogFooter className="">
					<Button type="submit" className="dark:bg-green-800 dark:text-white">
						Add to queue
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
