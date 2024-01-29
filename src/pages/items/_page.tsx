import { trpcReact } from "@/client";
import type { NanoId } from "@/db/types";

export interface ContentItemPageProps {
	contentItemId: NanoId;
}

export function ContentItemPage({ contentItemId }: ContentItemPageProps) {
	const { data: contentItem } = trpcReact.contentItem.byId.useQuery(contentItemId);

	if (!contentItem) {
		return null;
	}

	return (
		<div className="container flex flex-col">
			<h2>{contentItem.title}</h2>
		</div>
	);
}
