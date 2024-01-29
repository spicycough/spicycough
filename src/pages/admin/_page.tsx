import React from "react";

import { createFakeContentItems } from "@/db/factories";
import type { ContentItem } from "@/db/schema";
import { Server } from "@/hooks/useServer";

import { ContentItemTable } from "./_components/content-item-table";

export const AdminPage = () => {
	const [contentItems, setContentItems] = React.useState<ContentItem[]>([]);

	React.useEffect(() => {
		const contentItems = createFakeContentItems(10);
		setContentItems(contentItems);
	}, []);

	return (
		<React.Suspense>
			<Server>
				<ContentItemTable contentItems={contentItems} />
			</Server>
		</React.Suspense>
	);
};
