import type { ContentItem } from "@/db/schema/contentItems";
import { createFakeContentItems } from "@/db/factories";
import { useEffect, useState } from "react";
import { ContentList } from "./_components/ContentList";

export const SearchPage = () => {
	const [contentItems, setContentItems] = useState<ContentItem[]>([]);

	useEffect(() => {
		const fakeContentItems = createFakeContentItems(10);
		setContentItems(fakeContentItems);
	}, []);

	return (
		<div className="w-full">
			<ContentList contentItems={contentItems} />
		</div>
	);
};
