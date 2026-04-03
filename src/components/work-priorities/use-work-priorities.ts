import type { MutableRefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePersistedState } from "../../hooks/use-persisted-state";
import { defaultPriorities, timerPresets } from "./constants";
import type { TPriorityItem, TPriorityTag } from "./type";

const STORAGE_KEY = "tabspire_work_priorities";

export type TWorkPrioritiesApi = {
	priorities: TPriorityItem[];
	completedCount: number;
	focusMode: boolean;
	setFocusMode: (value: boolean) => void;
	activePriorityId: string | null;
	newPriorityTitle: string;
	setNewPriorityTitle: (value: string) => void;
	newPriorityTag: TPriorityTag;
	setNewPriorityTag: (value: TPriorityTag) => void;
	newPriorityDuration: number;
	setNewPriorityDuration: (value: number) => void;
	newPriorityDeadline: string;
	setNewPriorityDeadline: (value: string) => void;
	totalFocusedSeconds: number;
	nudgeTag: TPriorityTag;
	formatDurationSummary: (seconds: number) => string;
	handleClearAllPriorities: () => void;
	handleTogglePriority: (id: string) => void;
	handleDeletePriority: (id: string) => void;
	handleAddPriority: () => void;
	handleAddPreset: (presetId: string) => void;
	handleStartTimer: (id: string) => void;
	handlePauseTimer: (id: string) => void;
	handleResetTimer: (id: string) => void;
	priorityRefs: MutableRefObject<Record<string, HTMLDivElement | null>>;
};

export function useWorkPriorities(maxPriorities: number): TWorkPrioritiesApi {
	const [priorities, setPriorities] = usePersistedState<TPriorityItem[]>(
		STORAGE_KEY,
		defaultPriorities,
	);
	const [newPriorityTitle, setNewPriorityTitle] = useState("");
	const [newPriorityTag, setNewPriorityTag] = useState<TPriorityTag>("Deep work");
	const [newPriorityDuration, setNewPriorityDuration] = useState(25);
	const [newPriorityDeadline, setNewPriorityDeadline] = useState("");
	const [focusMode, setFocusMode] = useState(false);
	const [activePriorityId, setActivePriorityId] = useState<string | null>(null);
	const priorityRefs = useRef<Record<string, HTMLDivElement | null>>({});

	const completedCount = priorities.filter((item) => item.done).length;

	const handleClearAllPriorities = () => {
		if (priorities.length === 0) return;
		setPriorities([]);
		setActivePriorityId(null);
		setFocusMode(false);
	};

	const handleTogglePriority = (id: string) => {
		setPriorities((prev) =>
			prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
		);
	};

	const handleDeletePriority = (id: string) => {
		setPriorities((prev) => prev.filter((item) => item.id !== id));
	};

	const handleAddPriority = () => {
		const title = newPriorityTitle.trim();
		if (!title || priorities.length >= maxPriorities) return;

		setPriorities((prev) => [
			...prev,
			{
				id: `${Date.now()}`,
				title,
				tag: newPriorityTag,
				done: false,
				timerDuration: newPriorityDuration,
				timerElapsed: 0,
				isTimerRunning: false,
				softDeadline: newPriorityDeadline || undefined,
			},
		]);

		setNewPriorityTitle("");
		setNewPriorityDuration(25);
		setNewPriorityDeadline("");
	};

	const handleAddPreset = (presetId: string) => {
		const preset = timerPresets.find((p) => p.id === presetId);
		if (!preset || priorities.length >= maxPriorities) return;

		setPriorities((prev) => [
			...prev,
			{
				id: `${Date.now()}-${preset.id}`,
				title: preset.title,
				tag: preset.tag,
				done: false,
				timerDuration: preset.minutes,
				timerElapsed: 0,
				isTimerRunning: false,
			},
		]);
	};

	const handleStartTimer = useCallback(
		(id: string) => {
			setPriorities((prev) =>
				prev.map((item) => ({
					...item,
					isTimerRunning: item.id === id,
				})),
			);
			setActivePriorityId(id);
			setFocusMode(true);

			const target = priorityRefs.current[id];
			if (target) {
				target.scrollIntoView({ behavior: "smooth", block: "center" });
			}
		},
		[setPriorities],
	);

	const handlePauseTimer = useCallback(
		(id: string) => {
			setPriorities((prev) =>
				prev.map((item) => (item.id === id ? { ...item, isTimerRunning: false } : item)),
			);
		},
		[setPriorities],
	);

	const handleResetTimer = useCallback(
		(id: string) => {
			setPriorities((prev) =>
				prev.map((item) =>
					item.id === id ? { ...item, timerElapsed: 0, isTimerRunning: false } : item,
				),
			);
		},
		[setPriorities],
	);

	const formatDurationSummary = (seconds: number) => {
		const totalMinutes = Math.round(seconds / 60);
		if (totalMinutes <= 0) return "0m";
		if (totalMinutes < 60) return `${totalMinutes}m`;
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
	};

	const tagTimeSeconds: Record<TPriorityTag, number> = {
		"Deep work": 0,
		Meeting: 0,
		Admin: 0,
	};
	priorities.forEach((item) => {
		const elapsed = item.timerElapsed || 0;
		if (item.tag in tagTimeSeconds) {
			(tagTimeSeconds[item.tag] as number) += elapsed;
		}
	});

	const totalFocusedSeconds = Object.values(tagTimeSeconds).reduce(
		(sum, seconds) => sum + seconds,
		0,
	);

	const primaryTask = priorities.find((item) => !item.done) || priorities[0];

	let nudgeTag: TPriorityTag = "Deep work";
	const maxTagEntry = (Object.entries(tagTimeSeconds) as Array<[TPriorityTag, number]>).reduce<{
		tag: TPriorityTag | null;
		seconds: number;
	}>(
		(acc, [tag, seconds]) => {
			if (seconds > acc.seconds) return { tag, seconds };
			return acc;
		},
		{ tag: null, seconds: 0 },
	);
	if (maxTagEntry.tag && maxTagEntry.seconds > 0) {
		nudgeTag = maxTagEntry.tag;
	} else if (primaryTask) {
		nudgeTag = primaryTask.tag;
	} else {
		nudgeTag = "Deep work";
	}

	useEffect(() => {
		const interval = setInterval(() => {
			setPriorities((prev) =>
				prev.map((item) => {
					if (!item.isTimerRunning) return item;

					const maxSeconds = (item.timerDuration || 0) * 60;
					const nextElapsed = (item.timerElapsed || 0) + 1;

					if (nextElapsed >= maxSeconds) {
						const audio = new Audio(
							"data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGnOT0xXAsBC14y/DYjTwJE2S57OihUBIIOpPc8s92LQQecsrv2pNBCg9csurmqlYUCUSZ4PK7bywEJHPI79aOPgoPWrLq5K5YFApBlt3wp3ErBCAAAA==",
						);
						audio.play().catch(() => {});

						if ("Notification" in window && Notification.permission === "granted") {
							new Notification("Timer Complete!", {
								body: `${item.title} timer has finished`,
								icon: "/icons/icon-192x192.png",
							});
						}

						return { ...item, timerElapsed: maxSeconds, isTimerRunning: false };
					}

					return { ...item, timerElapsed: nextElapsed };
				}),
			);
		}, 1000);

		return () => clearInterval(interval);
	}, [setPriorities]);

	useEffect(() => {
		if ("Notification" in window && Notification.permission === "default") {
			Notification.requestPermission();
		}
	}, []);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null;
			if (
				!target ||
				target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.tagName === "SELECT" ||
				target.isContentEditable
			) {
				return;
			}

			if (event.key === "j" || event.key === "ArrowDown") {
				event.preventDefault();
				if (priorities.length === 0) return;
				const visible = priorities;
				const currentIndex = visible.findIndex((p) => p.id === activePriorityId);
				const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % visible.length;
				setActivePriorityId(visible[nextIndex].id);
				const targetEl = priorityRefs.current[visible[nextIndex].id];
				if (targetEl) {
					targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
				}
				return;
			}

			if (event.key === "k" || event.key === "ArrowUp") {
				event.preventDefault();
				if (priorities.length === 0) return;
				const visible = priorities;
				const currentIndex = visible.findIndex((p) => p.id === activePriorityId);
				const nextIndex = currentIndex <= 0 ? visible.length - 1 : currentIndex - 1;
				setActivePriorityId(visible[nextIndex].id);
				const targetEl = priorityRefs.current[visible[nextIndex].id];
				if (targetEl) {
					targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
				}
				return;
			}

			if (event.key === " " || event.key === "Spacebar") {
				event.preventDefault();
				if (!activePriorityId) return;
				const current = priorities.find((p) => p.id === activePriorityId);
				if (!current) return;
				if (current.isTimerRunning) {
					handlePauseTimer(activePriorityId);
				} else {
					handleStartTimer(activePriorityId);
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [priorities, activePriorityId, handlePauseTimer, handleStartTimer]);

	return {
		priorities,
		completedCount,
		focusMode,
		setFocusMode,
		activePriorityId,
		newPriorityTitle,
		setNewPriorityTitle,
		newPriorityTag,
		setNewPriorityTag,
		newPriorityDuration,
		setNewPriorityDuration,
		newPriorityDeadline,
		setNewPriorityDeadline,
		totalFocusedSeconds,
		nudgeTag,
		formatDurationSummary,
		handleClearAllPriorities,
		handleTogglePriority,
		handleDeletePriority,
		handleAddPriority,
		handleAddPreset,
		handleStartTimer,
		handlePauseTimer,
		handleResetTimer,
		priorityRefs,
	};
}
