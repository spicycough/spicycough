import { useCallback } from "react";
import { useList } from "@uidotdev/usehooks";

type Callbacks = {
	onSuccess?: () => void;
	onFailure?: (err: Error) => void;
	onFinish?: () => void;
};

type CreateEndpoint = (url: string, callbacks: Callbacks) => void;

type BulkCreateEndpoint = (urls: string, callbacks: Callbacks) => void;
type BulkRefreshEndpoint = (ids: string, callbacks: Callbacks) => void;
type BulkDeleteEndpoint = (ids: string, callbacks: Callbacks) => void;

type FetchAllEndpoint = (callbacks: Callbacks) => void;
type RefreshAllEndpoint = (callbacks: Callbacks) => void;
type DeleteAllEndpoint = (callbacks: Callbacks) => void;

export const useContentItems = () => {
	const [list, { set, push, removeAt, insertAt, updateAt, clear }] = useList();

	const bulkCreate: BulkCreateEndpoint = useCallback(
		async (urls: string, { onSuccess, onFailure, onFinish }: Callbacks) => {
			console.log(`useContentItems.bulkCreate`);

			try {
				const resp = await fetch("/api/content-items", {
					method: "POST",
					body: JSON.stringify({ urls: urls.split(",") }),
				});
				if (!resp.ok) throw new Error(await resp.text());

				if (onSuccess) onSuccess();
			} catch (err) {
				if (onFailure && err instanceof Error) onFailure(err);
			}

			if (onFinish) onFinish();
		},
		[],
	);

	const create: CreateEndpoint = useCallback(
		async (url: string, callbacks: Callbacks) => {
			console.log(`useContentItems.create`);
			bulkCreate(url, callbacks);
		},
		[bulkCreate],
	);

	const bulkRefresh: BulkRefreshEndpoint = useCallback(
		async (ids: string, { onSuccess, onFailure, onFinish }: Callbacks) => {
			console.log(`useContentItems.bulkRefresh`);

			try {
				const resp = await fetch(`/api/content-items/${ids}`, { method: "POST" });
				if (!resp.ok) throw new Error(await resp.text());

				if (onSuccess) onSuccess();
			} catch (err) {
				if (onFailure && err instanceof Error) onFailure(err);
			}
			if (onFinish) onFinish();
		},
		[],
	);

	const bulkDelete: BulkDeleteEndpoint = useCallback(
		async (ids: string, { onSuccess, onFailure, onFinish }) => {
			console.log(`useContentItems.bulkDelete`);

			try {
				const resp = await fetch(`/api/content-items/${ids}`, { method: "DELETE" });
				if (!resp.ok) throw new Error(await resp.text());

				if (onSuccess) onSuccess();
			} catch (err) {
				if (onFailure && err instanceof Error) onFailure(err);
			}
			if (onFinish) onFinish();
		},
		[],
	);

	const fetchAll: FetchAllEndpoint = useCallback(
		async ({ onSuccess, onFailure, onFinish }: Callbacks) => {
			console.log(`useContentItems.fetchAll`);

			try {
				const resp = await fetch("/api/content-items", { method: "GET" });
				if (!resp.ok) throw new Error(await resp.text());

				if (onSuccess) onSuccess();
			} catch (err) {
				if (onFailure && err instanceof Error) onFailure(err);
			}

			if (onFinish) onFinish();
		},
		[],
	);

	const refreshAll: RefreshAllEndpoint = useCallback(
		async ({ onSuccess, onFailure, onFinish }: Callbacks) => {
			console.log(`useContentItems.refreshAll`);

			try {
				const resp = await fetch("/api/content-items", { method: "POST" });
				if (!resp.ok) throw new Error(await resp.text());

				if (onSuccess) onSuccess();
			} catch (err) {
				if (onFailure && err instanceof Error) onFailure(err);
			}
			if (onFinish) onFinish();
		},
		[],
	);

	const deleteAll: DeleteAllEndpoint = useCallback(async ({ onSuccess, onFailure, onFinish }) => {
		console.log(`useContentItems.deleteAll`);

		try {
			const resp = await fetch("/api/content-items", { method: "DELETE" });
			if (!resp.ok) throw new Error(await resp.text());

			if (onSuccess) onSuccess();
		} catch (err) {
			if (onFailure && err instanceof Error) onFailure(err);
		}
		if (onFinish) onFinish();
	}, []);

	return { fetch, create, bulkCreate, bulkDelete, bulkRefresh, fetchAll, deleteAll, refreshAll };
};
