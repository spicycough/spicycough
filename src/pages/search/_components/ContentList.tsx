import { ChevronRightIcon } from "@radix-ui/react-icons";
import type { PropsWithChildren } from "react";

import { ContentItemCard } from "@/components/content-item/ContentItemCard";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { ContentItem } from "@/db/schema";

export const ContentList = ({ contentItems }: { contentItems: ContentItem[] }) => {
	const isEmpty = contentItems.length === 0;
	if (isEmpty) {
		return (
			<div className="h-full rounded-md border">
				<div className="h-24 text-center">No results.</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4">
			<Header title="Most Recent" />
			<div className="grid h-full w-full grid-cols-1 gap-4">
				{contentItems.map((contentItem: ContentItem) => (
					<ContentItemCard key={contentItem.id} item={contentItem} rowSpan={1} colSpan={1} />
				))}
			</div>
		</div>
	);
};

export interface HeaderProps {
	title: string;
}

const Header = ({ title }: HeaderProps) => {
	return (
		<h2 className="mb-4 text-2xl font-bold">
			{title} <ChevronRightIcon className="inline" />
		</h2>
	);
};

interface ThumbnailsProps {
	permalink: string;
	alt?: string;
}

export const Thumbnail = ({ permalink, alt }: ThumbnailsProps) => {
	return (
		<AspectRatio ratio={150 / 100}>
			<img
				alt={alt ?? "Article thumbnail"}
				className="max-h-auto h-[100px] w-[150px] max-w-full"
				src={permalink}
			/>
		</AspectRatio>
	);
};

export const Thumbnails = ({ children }: PropsWithChildren) => (
	<div className="grid grid-cols-2 gap-4">{children}</div>
);
