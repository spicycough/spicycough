import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { type ContentItem } from "@/db/schema/contentItems";
import { cn } from "@/lib/utils";
import { EnterFullScreenIcon, Share2Icon } from "@radix-ui/react-icons";

type ContentItemListProps = {
	className?: string;
	items: ContentItem[];
};

export const ContentItemList = ({ className, items, ...props }: ContentItemListProps) => {
	return (
		<ScrollArea>
			<div
				className={cn("min-w-4/5 flex flex-col items-center space-y-4 p-4 pt-0", className)}
				{...props}
			>
				{items.map((item) => (
					<ContentItemCard key={item.id} item={item} />
				))}
			</div>
		</ScrollArea>
	);
};

const Sep = () => <Separator orientation="vertical" className="mx-1 h-4/5" />;

export const ContentItemCard = ({ item }: { item: ContentItem }) => {
	return (
		<button
			key={item.id}
			className={cn(
				"flex w-full items-start rounded-xl border text-left text-sm transition-all hover:bg-accent",
			)}
		>
			<div className="flex w-full">
				<img className="aspect-square rounded-lg" src="https://unsplash.it/200" alt="" />
				<div className="w-full flex-1 bg-gradient-to-l from-twilight-700 to-muted">
					<div className="flex p-3">
						<div className="flex-1 space-y-3">
							<h1 className="text-4xl font-semibold">{item.title}</h1>
							<h1>{item.abstract}</h1>
						</div>
						<div className="min-w-1/5 flex flex-nowrap">
							<div className="w-full">
								<Button variant="ghost" size="icon">
									<Share2Icon className="size-4" />
									<span className="sr-only">Share</span>
								</Button>
								<Button variant="ghost" size="icon">
									<EnterFullScreenIcon className="size-4" />
									<span className="sr-only">Full-screen</span>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</button>
	);
};
