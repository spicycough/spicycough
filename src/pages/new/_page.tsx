import { Server } from "@/hooks/useServer";

import type { ContentItem } from "@/db/schema";
import { useState } from "react";
import { EditContentItem } from "./_components/EditContentItem";

export const NewContentItemPage = () => {
	const [selected, setSelected] = useState<ContentItem | null>(null);

	return (
		<Server>
			<main className="container flex flex-grow py-4">
				<div className="flex flex-auto flex-col justify-between rounded-lg border-gray-800 border-opacity-50 bg-gradient-to-b from-twilight-800 to-twilight-900 p-4">
					<EditContentItem />
				</div>
			</main>
		</Server>
	);
};
