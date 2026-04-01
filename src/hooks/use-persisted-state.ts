import { useState, useEffect, useCallback } from "react";

export function usePersistedState<T>(
	key: string,
	defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
	const [state, setState] = useState<T>(() => {
		try {
			const stored = localStorage.getItem(key);
			if (stored === null) return defaultValue;
			return JSON.parse(stored) as T;
		} catch {
			return defaultValue;
		}
	});

	const setPersistedState = useCallback(
		(value: T | ((prev: T) => T)) => {
			setState((prev) => {
				const newValue = typeof value === "function" ? (value as (prev: T) => T)(prev) : value;
				try {
					localStorage.setItem(key, JSON.stringify(newValue));
				} catch (error) {
					console.warn(`Failed to persist state for key "${key}":`, error);
				}
				return newValue;
			});
		},
		[key],
	);

	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === key && e.newValue !== null) {
				try {
					setState(JSON.parse(e.newValue) as T);
				} catch {
					// Ignore invalid JSON
				}
			}
		};
		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, [key]);

	return [state, setPersistedState];
}
