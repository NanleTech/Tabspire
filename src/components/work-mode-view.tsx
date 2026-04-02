import { useEffect, useState } from "react";
import { usePersistedState } from "../hooks/use-persisted-state";
import type { Scripture } from "../types";
import { AnchorCard, GlassCard, ModeContainer, ModeIntro } from "./mode-view-shared";

interface WorkModeViewProps {
	scripture: Scripture | null;
	onPlay: () => void;
	onRefresh: () => void;
	onOpenDevotional: () => void;
	maxPriorities: number;
}

type PriorityTag = "Deep work" | "Meeting" | "Admin";

interface PriorityItem {
	id: string;
	title: string;
	tag: PriorityTag;
	done: boolean;
	timerDuration?: number; // in minutes
	timerElapsed?: number; // in seconds
	isTimerRunning?: boolean;
}

type NudgeContext = "deep_work" | "meeting" | "admin";

interface WorkNudge {
	id: string;
	title: string;
	text: string;
	reference: string;
	action: string;
	contexts: NudgeContext[];
}

const defaultPriorities: PriorityItem[] = [
	{
		id: "p1",
		title: "Finish Q2 budget report for CFO review",
		tag: "Deep work",
		done: true,
		timerDuration: 60,
		timerElapsed: 0,
		isTimerRunning: false,
	},
	{
		id: "p2",
		title: "1:1 with Sarah — performance feedback",
		tag: "Meeting",
		done: false,
		timerDuration: 30,
		timerElapsed: 0,
		isTimerRunning: false,
	},
	{
		id: "p3",
		title: "Reply to outstanding client emails",
		tag: "Admin",
		done: false,
		timerDuration: 15,
		timerElapsed: 0,
		isTimerRunning: false,
	},
];

const wisdomChips = [
	{ label: "For meetings", text: "Plans fail for lack of counsel", ref: "Prov 15:22" },
	{ label: "For decisions", text: "Commit your work to the Lord", ref: "Prov 16:3" },
	{ label: "For pressure", text: "Do not grow weary in doing good", ref: "Gal 6:9" },
];

const workNudges: WorkNudge[] = [
	{
		id: "n1",
		title: "A thought for your 1:1 this afternoon",
		text: "A gentle answer turns away wrath, but a harsh word stirs up anger.",
		reference: "Proverbs 15:1",
		action: "Speak with grace today",
		contexts: ["meeting"],
	},
	{
		id: "n2",
		title: "Before your deep work block",
		text: "Whatever you do, work at it with all your heart, as working for the Lord.",
		reference: "Colossians 3:23",
		action: "Guard your focus window",
		contexts: ["deep_work"],
	},
	{
		id: "n3",
		title: "For your admin tasks",
		text: "Whoever can be trusted with very little can also be trusted with much.",
		reference: "Luke 16:10",
		action: "Treat small tasks with excellence",
		contexts: ["admin"],
	},
	{
		id: "n4",
		title: "A leadership reminder",
		text: "Let each of you look not only to his own interests, but also to the interests of others.",
		reference: "Philippians 2:4",
		action: "Listen with intent",
		contexts: ["meeting", "admin"],
	},
	{
		id: "n5",
		title: "When pressure rises",
		text: "If any of you lacks wisdom, let him ask of God, who gives generously.",
		reference: "James 1:5",
		action: "Pray before deciding",
		contexts: ["deep_work", "meeting", "admin"],
	},
];

const tagClassByName: Record<string, string> = {
	"Deep work": "border-blue-300/50 bg-blue-400/10 text-blue-200",
	Meeting: "border-amber-300/50 bg-amber-400/10 text-amber-200",
	Admin: "border-violet-300/50 bg-violet-400/10 text-violet-200",
};

const contextByTag: Record<PriorityTag, NudgeContext> = {
	"Deep work": "deep_work",
	Meeting: "meeting",
	Admin: "admin",
};

const pickNudgeForDay = (context: NudgeContext, dayKey: string): WorkNudge => {
	const candidates = workNudges.filter((nudge) => nudge.contexts.includes(context));
	if (candidates.length === 0) return workNudges[0];

	const seed = `${dayKey}-${context}`;
	let hash = 0;
	for (let index = 0; index < seed.length; index += 1) {
		hash = (hash << 5) - hash + seed.charCodeAt(index);
		hash |= 0;
	}

	return candidates[Math.abs(hash) % candidates.length];
};

const WorkModeView: React.FC<WorkModeViewProps> = ({
	scripture,
	onPlay,
	onRefresh,
	onOpenDevotional,
	maxPriorities,
}) => {
	const [priorities, setPriorities] = usePersistedState<PriorityItem[]>(
		"tabspire_work_priorities",
		defaultPriorities,
	);
	const [newPriorityTitle, setNewPriorityTitle] = useState("");
	const [newPriorityTag, setNewPriorityTag] = useState<PriorityTag>("Deep work");
	const [newPriorityDuration, setNewPriorityDuration] = useState(25); // default 25 minutes
	const [focusMode, setFocusMode] = useState(false);
	const [activePriorityId, setActivePriorityId] = useState<string | null>(null);
	const [showPrioritiesFullscreen, setShowPrioritiesFullscreen] = useState(false);

	const completedCount = priorities.filter((item) => item.done).length;

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
			},
		]);

		setNewPriorityTitle("");
		setNewPriorityDuration(25);
	};

	const handleStartTimer = (id: string) => {
		// Stop all other running timers
		setPriorities((prev) =>
			prev.map((item) => ({
				...item,
				isTimerRunning: item.id === id ? true : false,
			})),
		);
		setActivePriorityId(id);
		setFocusMode(true);
	};

	const handlePauseTimer = (id: string) => {
		setPriorities((prev) =>
			prev.map((item) => (item.id === id ? { ...item, isTimerRunning: false } : item)),
		);
	};

	const handleResetTimer = (id: string) => {
		setPriorities((prev) =>
			prev.map((item) =>
				item.id === id ? { ...item, timerElapsed: 0, isTimerRunning: false } : item,
			),
		);
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	// Timer effect
	useEffect(() => {
		const interval = setInterval(() => {
			setPriorities((prev) =>
				prev.map((item) => {
					if (!item.isTimerRunning) return item;

					const maxSeconds = (item.timerDuration || 0) * 60;
					const nextElapsed = (item.timerElapsed || 0) + 1;

					// Timer completed
					if (nextElapsed >= maxSeconds) {
						// Play notification sound
						const audio = new Audio(
							"data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGnOT0xXAsBC14y/DYjTwJE2S57OihUBIIOpPc8s92LQQecsrv2pNBCg9csurmqlYUCUSZ4PK7bywEJHPI79aOPgoPWrLq5K5YFApBlt3wp3ErBCAAAA==",
						);
						audio.play().catch(() => {});

						// Show browser notification if permission granted
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

	// Request notification permission on mount
	useEffect(() => {
		if ("Notification" in window && Notification.permission === "default") {
			Notification.requestPermission();
		}
	}, []);
	const date = new Date();
	const dateLabel = date.toLocaleDateString(undefined, {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	});
	const dayKey = date.toISOString().slice(0, 10);
	const primaryTask = priorities.find((item) => !item.done) || priorities[0];
	const nudgeContext: NudgeContext = primaryTask ? contextByTag[primaryTask.tag] : "deep_work";
	const todayNudge = pickNudgeForDay(nudgeContext, dayKey);

	const renderPrioritiesCard = (isFullscreen: boolean) => {
		const listHeightClass = isFullscreen ? "max-h-[60vh]" : "max-h-40";

		return (
			<GlassCard>
				<div className="mb-2.5 flex items-center justify-between">
					<h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-white/70 md:text-sm">
						Today&apos;s {maxPriorities} priorities
					</h3>
					<div className="flex items-center gap-2">
						{focusMode && (
							<button
								type="button"
								onClick={() => setFocusMode(false)}
								className="rounded-lg border border-amber-300/40 bg-amber-300/15 px-2 py-0.5 text-xs font-semibold text-amber-200"
							>
								🎯 Exit Focus
							</button>
						)}
						<button
							type="button"
							onClick={() => setShowPrioritiesFullscreen(!isFullscreen)}
							className="hidden rounded-lg border border-white/30 bg-black/30 px-2 py-0.5 text-xs font-semibold text-white/80 hover:bg-black/50 sm:inline-flex"
						>
							{isFullscreen ? "Close" : "Full view"}
						</button>
						<p className="text-xs font-semibold text-emerald-300/90 md:text-sm">
							{completedCount} of {priorities.length} done
						</p>
					</div>
				</div>
				<div className={`space-y-1 ${listHeightClass} overflow-y-auto pr-1`}>
					{priorities.map((priority) => {
						const isActive = priority.isTimerRunning;
						const isFocusedTask = focusMode && activePriorityId === priority.id;
						const isHidden = focusMode && activePriorityId !== priority.id;
						const timerProgress = priority.timerDuration
							? ((priority.timerElapsed || 0) / (priority.timerDuration * 60)) * 100
							: 0;
						const remainingSeconds = priority.timerDuration
							? priority.timerDuration * 60 - (priority.timerElapsed || 0)
							: 0;

						if (isHidden) return null;

						return (
							<div
								key={priority.id}
								className={`rounded-xl border px-3 py-2 md:px-3.5 transition-all ${
									isFocusedTask
										? "border-amber-300/60 bg-amber-500/10 shadow-lg"
										: isActive
											? "border-blue-300/40 bg-blue-500/5"
											: "border-white/10 bg-white/[0.03]"
								}`}
							>
								<div className="flex items-start justify-between gap-2">
									<div className="flex flex-1 items-start gap-3">
										<button
											type="button"
											onClick={() => handleTogglePriority(priority.id)}
											aria-label={`Mark ${priority.title} as ${priority.done ? "incomplete" : "complete"}`}
											className={`mt-0.5 h-4 w-4 flex-shrink-0 rounded-md border transition ${
												priority.done
													? "border-emerald-300/80 bg-emerald-300/30"
													: "border-white/30 bg-transparent hover:border-white/50"
											}`}
										/>
										<div className="flex-1">
											<p
												className={`text-sm md:text-base ${
													priority.done ? "text-white/45 line-through" : "text-white/90"
												}`}
											>
												{priority.title}
											</p>
											{priority.timerDuration && (
												<div className="mt-2 space-y-1">
													<div className="flex items-center gap-2">
														<div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
															<div
																className="h-full rounded-full bg-emerald-300/70 transition-all"
																style={{ width: `${timerProgress}%` }}
															/>
														</div>
														<span className="tabular-nums text-xs font-medium text-white/70">
															{formatTime(remainingSeconds)}
														</span>
													</div>
													<div className="flex gap-1">
														{!isActive ? (
															<button
																type="button"
																onClick={() => handleStartTimer(priority.id)}
																className="rounded-md border border-emerald-300/30 bg-emerald-300/10 px-2 py-0.5 text-xs text-emerald-200 hover:bg-emerald-300/20"
															>
																▶ Start
															</button>
														) : (
															<button
																type="button"
																onClick={() => handlePauseTimer(priority.id)}
																className="rounded-md border border-amber-300/30 bg-amber-300/10 px-2 py-0.5 text-xs text-amber-200 hover:bg-amber-300/20"
															>
																⏸ Pause
															</button>
														)}
														<button
															type="button"
															onClick={() => handleResetTimer(priority.id)}
															className="rounded-md border border-white/20 bg-white/5 px-2 py-0.5 text-xs text-white/60 hover:bg-white/10"
														>
															↺ Reset
														</button>
													</div>
												</div>
											)}
										</div>
									</div>
									<div className="flex flex-shrink-0 items-start gap-1.5">
										<span
											className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
												tagClassByName[priority.tag] || "border-white/20 bg-white/10 text-white/70"
											}`}
										>
											{priority.tag}
										</span>
										<button
											type="button"
											onClick={() => handleDeletePriority(priority.id)}
											aria-label={`Remove ${priority.title}`}
											className="rounded-md border border-white/20 px-1.5 py-0.5 text-[11px] text-white/60 transition hover:bg-white/10 hover:text-white"
										>
											×
										</button>
									</div>
								</div>
							</div>
						);
					})}
					{priorities.length < maxPriorities && (
						<div className="flex flex-col gap-2 rounded-xl border border-dashed border-white/25 bg-white/[0.02] p-2.5">
							<input
								type="text"
								value={newPriorityTitle}
								onChange={(event) => setNewPriorityTitle(event.target.value)}
								onKeyDown={(event) => {
									if (event.key === "Enter") handleAddPriority();
								}}
								placeholder="Add a priority..."
								className="min-w-0 flex-1 rounded-lg border border-white/15 bg-black/30 px-2.5 py-1.5 text-xs text-white placeholder:text-white/45 focus:border-emerald-300/40 focus:outline-none"
							/>
							<div className="grid gap-2 sm:grid-cols-3">
								<select
									value={newPriorityTag}
									onChange={(event) => setNewPriorityTag(event.target.value as PriorityTag)}
									className="rounded-lg border border-white/15 bg-black/30 px-2.5 py-1.5 text-xs text-white focus:border-emerald-300/40 focus:outline-none"
								>
									<option value="Deep work">Deep work</option>
									<option value="Meeting">Meeting</option>
									<option value="Admin">Admin</option>
								</select>
								<div className="flex items-center gap-1.5">
									<input
										type="number"
										min="1"
										max="180"
										value={newPriorityDuration}
										onChange={(event) => setNewPriorityDuration(Number(event.target.value) || 25)}
										className="w-full rounded-lg border border-white/15 bg-black/30 px-2.5 py-1.5 text-xs text-white focus:border-emerald-300/40 focus:outline-none"
									/>
									<span className="text-xs text-white/60">min</span>
								</div>
								<button
									type="button"
									onClick={handleAddPriority}
									disabled={!newPriorityTitle.trim()}
									className="rounded-lg border border-emerald-300/35 bg-emerald-300/15 px-3 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-300/25 disabled:cursor-not-allowed disabled:opacity-50"
								>
									Add
								</button>
							</div>
						</div>
					)}
				</div>
			</GlassCard>
		);
	};

	return (
		<ModeContainer>
			<ModeIntro title="Keep going, afternoon session" subtitle={dateLabel} />
			<AnchorCard
				scripture={scripture}
				fallbackText="Whatever you do, work at it with all your heart, as working for the Lord, not for human masters."
				fallbackReference="Colossians 3:23"
				anchorLabel="Work anchor · Diligence"
				accentClassName="border-emerald-200/20 bg-emerald-500/10"
				onPlay={onPlay}
				onRefresh={onRefresh}
				onOpenDevotional={onOpenDevotional}
			/>

			{renderPrioritiesCard(false)}

			{showPrioritiesFullscreen && (
				<div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-3 py-6 backdrop-blur-sm">
					<div className="w-full max-w-3xl">{renderPrioritiesCard(true)}</div>
				</div>
			)}

			<GlassCard className="border-amber-300/20 bg-amber-500/10">
				<p className="mb-1.5 text-xs font-semibold text-amber-200 md:text-sm">{todayNudge.title}</p>
				<p className="text-base italic leading-relaxed text-white/90 md:text-xl">
					“{todayNudge.text}”
				</p>
				<p className="mt-1 text-xs text-amber-100/70 md:text-sm">
					{todayNudge.reference} · {todayNudge.action}
				</p>
			</GlassCard>

			<div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-3">
				{wisdomChips.map((chip) => (
					<GlassCard
						key={chip.label}
						className="mb-0 rounded-2xl border-white/10 bg-black/20 p-3.5 text-left"
					>
						<p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/55">
							{chip.label}
						</p>
						<p className="mt-1 text-sm font-medium leading-snug text-white/85 md:text-base">
							{chip.text}
						</p>
						<p className="mt-1 text-xs text-white/50">{chip.ref}</p>
					</GlassCard>
				))}
			</div>
		</ModeContainer>
	);
};

export default WorkModeView;
