/**
 * Browser API abstraction layer for cross-browser compatibility.
 * Chrome uses the `chrome.*` namespace, Firefox uses `browser.*` with Promises.
 * This module normalizes both to a Promise-based API.
 */

declare const browser: typeof chrome | undefined;

const api = typeof chrome !== "undefined" ? chrome : browser;

if (!api) {
	throw new Error("Browser extension APIs not available");
}

const withRuntimeError = (reject: (reason?: unknown) => void): boolean => {
	if (chrome.runtime.lastError) {
		reject(new Error(chrome.runtime.lastError.message));
		return true;
	}
	return false;
};

export const browserAPI = {
	storage: {
		local: {
			get: (keys?: string | string[] | Record<string, unknown> | null): Promise<Record<string, unknown>> => {
				if (api.storage?.local?.get) {
					return new Promise((resolve, reject) => {
						api.storage.local.get(keys ?? null, (items) => {
							if (withRuntimeError(reject)) return;
							resolve(items as Record<string, unknown>);
						});
					});
				}
				return Promise.resolve({});
			},
			set: (items: Record<string, unknown>): Promise<void> => {
				if (api.storage?.local?.set) {
					return new Promise((resolve, reject) => {
						api.storage.local.set(items, () => {
							if (withRuntimeError(reject)) return;
							resolve();
						});
					});
				}
				return Promise.resolve();
			},
			remove: (keys: string | string[]): Promise<void> => {
				if (api.storage?.local?.remove) {
					return new Promise((resolve, reject) => {
						api.storage.local.remove(keys, () => {
							if (withRuntimeError(reject)) return;
							resolve();
						});
					});
				}
				return Promise.resolve();
			},
		},
	},

	bookmarks: {
		getTree: (): Promise<chrome.bookmarks.BookmarkTreeNode[]> => {
			if (api.bookmarks?.getTree) {
				return new Promise((resolve, reject) => {
					api.bookmarks.getTree((nodes) => {
						if (withRuntimeError(reject)) return;
						resolve(nodes);
					});
				});
			}
			return Promise.resolve([]);
		},
	},

	history: {
		search: (query: chrome.history.HistoryQuery): Promise<chrome.history.HistoryItem[]> => {
			if (api.history?.search) {
				return new Promise((resolve, reject) => {
					api.history.search(query, (results) => {
						if (withRuntimeError(reject)) return;
						resolve(results);
					});
				});
			}
			return Promise.resolve([]);
		},
	},

	tabs: {
		create: (props: chrome.tabs.CreateProperties): Promise<chrome.tabs.Tab> => {
			if (api.tabs?.create) {
				return new Promise((resolve, reject) => {
					api.tabs.create(props, (tab) => {
						if (withRuntimeError(reject)) return;
						resolve(tab);
					});
				});
			}
			return Promise.resolve({} as chrome.tabs.Tab);
		},
		update: (tabId: number | undefined, props: chrome.tabs.UpdateProperties): Promise<chrome.tabs.Tab> => {
			if (api.tabs?.update) {
				return new Promise((resolve, reject) => {
					if (typeof tabId === "number") {
						api.tabs.update(tabId, props, (tab) => {
							if (withRuntimeError(reject)) return;
							resolve(tab as chrome.tabs.Tab);
						});
						return;
					}
					api.tabs.update(props, (tab) => {
						if (withRuntimeError(reject)) return;
						resolve(tab as chrome.tabs.Tab);
					});
				});
			}
			return Promise.resolve({} as chrome.tabs.Tab);
		},
	},

	clipboard: {
		writeText: (text: string): Promise<void> => {
			if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
				return navigator.clipboard.writeText(text);
			}
			// Fallback for environments without clipboard API
			return Promise.resolve();
		},
	},

	runtime: {
		getManifest: (): chrome.runtime.Manifest => {
			if (api.runtime?.getManifest) {
				return api.runtime.getManifest();
			}
			return {} as chrome.runtime.Manifest;
		},
		getURL: (path: string): string => {
			if (api.runtime?.getURL) {
				return api.runtime.getURL(path);
			}
			return path;
		},
	},
};
