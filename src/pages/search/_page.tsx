import { useEffect, useState } from "react";

import { createFakeContentItems } from "@/db/factories";
import type { ContentItem } from "@/db/schema";

import { ContentList } from "./_components/ContentList";
import { ContentItemCard } from "@/components/content-item/ContentItemCard";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

export const SearchPage = () => {
	const [contentItems, setContentItems] = useState<ContentItem[]>([]);
	const [featuredContentItem, setFeaturedContentItem] = useState<ContentItem>();

	useEffect(() => {
		const contentItems = createFakeContentItems(10);

		const featured = contentItems.pop()!;
		setContentItems(contentItems);
		setFeaturedContentItem(featured);
	}, []);

	return (
		<div className="grid h-dvh max-h-dvh min-h-dvh grid-cols-4 gap-4 px-24">
			<div className="col-span-2 mx-auto">
				<Header title="Featured" />
				<div className="space-y-4 p-4">
					<Separator />
					<img src={featuredContentItem?.imageUrl ?? ""} />
					<ContentItemCard item={featuredContentItem} />
					<Carousel>
						<CarouselContent>
							{contentItems.map((contentItem: ContentItem) => (
								<CarouselItem className="md:basis-1/2 lg:basis-1/3">
									<img src={contentItem?.imageUrl ?? ""} />
									<Separator />
									{contentItem.title}
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				</div>
			</div>

			<div className="col-span-1 mx-auto">
				<Header title="Popular" />
				<ScrollArea className="space-y-4 overflow-y-scroll p-4">
					{contentItems.map((contentItem: ContentItem) => (
						<>
							<Separator />
							<ContentItemCard key={contentItem.id} item={contentItem} />
						</>
					))}
				</ScrollArea>
			</div>

			<div className="col-span-1 mx-auto">
				<Header title="Recent" />
				<ScrollArea className="space-y-4 p-4">
					{contentItems.map((contentItem: ContentItem) => (
						<>
							<Separator />
							<ContentItemCard key={contentItem.id} item={contentItem} withAbstract={false} />
						</>
					))}
				</ScrollArea>
			</div>
		</div>
	);
};

export type HeaderProps = {
	title: string;
};

const Header = ({ title }: HeaderProps) => {
	return (
		<h2 className="mb-4 text-2xl font-bold">
			{title} <ChevronRightIcon className="inline" />
		</h2>
	);
};
