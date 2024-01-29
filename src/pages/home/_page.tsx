import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Suspense } from "react";

import { Separator } from "@/components/ui/separator";
import { createFakeContentItems } from "@/db/factories";
import type { ContentItem } from "@/db/schema";
import { Server } from "@/hooks/useServer";

import { LargeCard, MediumCard, SmallCard } from "./_components/card";

export interface HeaderProps {
	title: string;
}

const Header = ({ title }: HeaderProps) => {
	return (
		<h2 className="pb-2 text-2xl font-bold first:ml-4">
			{title} <ChevronRightIcon className="inline" />
		</h2>
	);
};

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
		<div className="container grid grid-cols-4 gap-x-2 *:pb-2 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
			<div className="col-span-2">
				<Header title="Featured" />
				{featuredContentItem && <LargeCard contentItem={featuredContentItem} />}
			</div>
			<div className="col-span-1">
				<div className="space-y-4">
					{contentItems.map((contentItem: ContentItem) => (
						<>
							<Header title="Popular" />
							<MediumCard key={contentItem.id} contentItem={contentItem} />
							<Separator />
						</>
					))}
				</div>
			</div>
			<div className="col-span-1">
				<div className="space-y-4">
					{contentItems.map((contentItem: ContentItem) => (
						<>
							<Header title="Recent" />
							<SmallCard key={contentItem.id} contentItem={contentItem} />
							<Separator />
						</>
					))}
				</div>
			</div>
		</div>
	);
};

export const HomePage = () => {
	return (
		<Suspense>
			<Server>
				<SearchPage />
			</Server>
		</Suspense>
	);
};
