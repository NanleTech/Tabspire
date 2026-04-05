import { useMemo, useState } from "react";
import { type MoodId, moodOptions } from "../../data/mood-verse-library";
import { usePersistedState } from "../../hooks/use-persisted-state";
import type { Scripture } from "../../types";
import DayEventBanner from "../day-event-banner";
import {
	AnchorCard,
	FeatureCard,
	GlassCard,
	ModeContainer,
	ModeIntro,
	WisdomCard,
} from "../mode-view-shared";
import { WorkPrioritiesCard } from "../work-priorities/priorities-card";
import type { TPriorityTag } from "../work-priorities/type";
import { useWorkPriorities } from "../work-priorities/use-work-priorities";

interface WorkModeViewProps {
	scripture: Scripture | null;
	onPlay: () => void;
	onRefresh: () => void;
	onOpenDevotional: () => void;
	maxPriorities: number;
}

interface GoalItem {
	id: string;
	title: string;
	current: number;
	target: number;
}

type JournalEntriesByDate = Record<string, string>;

type NudgeContext = "deep_work" | "meeting" | "admin";

interface WorkNudge {
	id: string;
	title: string;
	text: string;
	reference: string;
	action: string;
	contexts: NudgeContext[];
}

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
];

const contextByTag: Record<TPriorityTag, NudgeContext> = {
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
	const prioritiesApi = useWorkPriorities(maxPriorities);
	const [simpleMood] = usePersistedState<MoodId>("tabspire_simple_mood", "peaceful");
	const [goals] = usePersistedState<GoalItem[]>("tabspire_full_goals", [
		{ id: "g1", title: "Focus blocks completed", current: 1, target: 3 },
		{ id: "g2", title: "Meaningful outreach messages", current: 0, target: 2 },
		{ id: "g3", title: "Strategic decisions closed", current: 0, target: 2 },
	]);
	const [journalEntries, setJournalEntries] = usePersistedState<JournalEntriesByDate>(
		"tabspire_simple_journal_entries",
		{},
	);
	const [showPrioritiesFullscreen, setShowPrioritiesFullscreen] = useState(false);
	const [isJournalOpen, setIsJournalOpen] = useState(false);
	const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);

	const simpleMoodMeta = moodOptions.find((mood) => mood.id === simpleMood) || moodOptions[0];
	const totalGoalsCurrent = goals.reduce((sum, goal) => sum + goal.current, 0);
	const totalGoalsTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
	const goalsCompletionRate =
		totalGoalsTarget > 0 ? Math.round((totalGoalsCurrent / totalGoalsTarget) * 100) : 0;

	const handleMoodSelect = (moodId: MoodId) => {
		localStorage.setItem("tabspire_simple_mood", moodId);
		setIsMoodModalOpen(false);
	};

	const date = new Date();
	const dateLabel = date.toLocaleDateString(undefined, {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	});
	const dayKey = date.toISOString().slice(0, 10);
	const todayEntry = journalEntries[dayKey] || "";
	const entryDates = useMemo(
		() =>
			Object.keys(journalEntries)
				.filter((entryDate) => (journalEntries[entryDate] || "").trim().length > 0)
				.sort((a, b) => b.localeCompare(a)),
		[journalEntries],
	);

	const nudgeContext: NudgeContext = contextByTag[prioritiesApi.nudgeTag];
	const todayNudge = pickNudgeForDay(nudgeContext, dayKey);

	const { priorities, completedCount, totalFocusedSeconds, formatDurationSummary, focusMode } =
		prioritiesApi;

	return (
		<ModeContainer>
			{focusMode && !showPrioritiesFullscreen && (
				<div className="pointer-events-none fixed inset-0 z-10 bg-black/40 transition-opacity" />
			)}
			<ModeIntro title="Keep going, afternoon session" subtitle={dateLabel} />
			<AnchorCard
				scripture={scripture}
				fallbackText="Whatever you do, work at it with all your heart, as working for the Lord, not for human masters."
				fallbackReference="Colossians 3:23"
				anchorLabel={`Work anchor · ${simpleMoodMeta.label}`}
				accentClassName="border-emerald-200/20 bg-emerald-500/10"
				onPlay={onPlay}
				onRefresh={onRefresh}
				onOpenDevotional={onOpenDevotional}
			/>
			<div className="mb-2 flex justify-center">
				<button
					type="button"
					onClick={() => setIsMoodModalOpen(true)}
					className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-3 py-1 text-[11px] font-medium text-white/80 hover:bg-black/45"
				>
					<span className="opacity-80">Mood check-in:</span>
					<span>{simpleMoodMeta.emoji}</span>
					<span className="capitalize">{simpleMoodMeta.label}</span>
				</button>
			</div>

			<DayEventBanner date={date} />

			<FeatureCard
				title="Journal"
				subtitle={
					todayEntry.trim()
						? "Today's journal is saved locally."
						: "Capture what God is highlighting today."
				}
				metric={todayEntry.trim() ? "Saved" : "Not captured"}
				onClick={() => setIsJournalOpen(true)}
				className="border-violet-300/25 bg-violet-500/10"
			/>

			<GlassCard className="border-blue-300/20 bg-blue-500/10">
				<div className="mb-1.5 flex items-center justify-between gap-2">
					<p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue-100/90">
						Goals this week
					</p>
					<p className="text-[11px] font-semibold text-blue-100/85">
						{goalsCompletionRate}% complete
					</p>
				</div>
				<p className="text-xs text-white/70">
					{totalGoalsCurrent}/{totalGoalsTarget} total progress across {goals.length} goals
				</p>
			</GlassCard>

			<FeatureCard
				title="Today&apos;s priorities"
				subtitle={
					priorities.length === 0
						? "No priorities added yet. Click to add your first focus."
						: undefined
				}
				metric={
					priorities.length > 0
						? `${completedCount} of ${priorities.length} done${
								totalFocusedSeconds > 0
									? ` · ${formatDurationSummary(totalFocusedSeconds)} focused`
									: ""
							}`
						: undefined
				}
				onClick={() => setShowPrioritiesFullscreen(true)}
				className="border-emerald-300/25 bg-emerald-500/10"
			/>

			{isMoodModalOpen && (
				<div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm">
					<div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-[#070b14] shadow-2xl">
						<div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
							<div>
								<h2 className="text-sm font-semibold text-white md:text-base">Mood check-in</h2>
								<p className="text-[11px] text-white/60 md:text-xs">
									Choose today&apos;s posture for your anchor.
								</p>
							</div>
							<button
								type="button"
								onClick={() => setIsMoodModalOpen(false)}
								className="rounded-xl border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/80 md:text-sm"
							>
								Close
							</button>
						</div>
						<div className="p-4">
							<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
								{moodOptions.map((mood) => {
									const active = simpleMood === mood.id;
									return (
										<button
											key={mood.id}
											type="button"
											onClick={() => handleMoodSelect(mood.id)}
											className={`rounded-xl border px-3 py-2 text-left text-xs transition duration-200 md:text-sm ${
												active
													? "border-emerald-300/70 bg-emerald-400/20 text-white shadow-[0_0_0_1px_rgba(167,243,208,0.35),0_8px_20px_rgba(16,185,129,0.25)]"
													: "border-white/20 bg-white/[0.04] text-white/80 hover:border-white/40 hover:bg-white/[0.08]"
											}`}
										>
											<span className="mr-1.5">{mood.emoji}</span>
											{mood.label}
										</button>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			)}

			{isJournalOpen && (
				<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-2 backdrop-blur-sm md:p-5">
					<div className="flex h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#070b14] shadow-2xl">
						<div className="flex h-14 items-center justify-between border-b border-white/10 px-4 md:px-6">
							<div>
								<h2 className="text-base font-semibold text-white md:text-lg">Journal</h2>
								<p className="text-[11px] text-white/55 md:text-xs">
									Saved locally on this device by date.
								</p>
							</div>
							<button
								type="button"
								onClick={() => setIsJournalOpen(false)}
								className="rounded-xl border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/80 md:text-sm"
							>
								Close
							</button>
						</div>
						<div className="grid min-h-0 flex-1 gap-0 md:grid-cols-[240px,1fr]">
							<aside className="min-h-0 overflow-y-auto border-b border-white/10 bg-black/20 p-3 md:border-b-0 md:border-r">
								<p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/55">
									Entry dates
								</p>
								<div className="space-y-1.5">
									{entryDates.length === 0 ? (
										<p className="text-xs text-white/55">No saved entries yet.</p>
									) : (
										entryDates.map((entryDate) => (
											<div
												key={entryDate}
												className={`rounded-lg border px-2.5 py-1.5 text-xs ${
													entryDate === dayKey
														? "border-violet-300/40 bg-violet-300/10 text-violet-100"
														: "border-white/15 bg-white/[0.03] text-white/80"
												}`}
											>
												{new Date(`${entryDate}T00:00:00`).toLocaleDateString()}
											</div>
										))
									)}
								</div>
							</aside>
							<div className="min-h-0 overflow-y-auto p-3 md:p-5">
								<p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-violet-200 md:text-sm">
									Today - {new Date(`${dayKey}T00:00:00`).toLocaleDateString()}
								</p>
								<textarea
									value={todayEntry}
									onChange={(event) =>
										setJournalEntries((prev) => ({
											...prev,
											[dayKey]: event.target.value,
										}))
									}
									placeholder="What is God highlighting for you today?"
									className="h-[45dvh] w-full resize-none rounded-xl border border-white/20 bg-black/25 px-3 py-2 text-sm text-white placeholder:text-white/45 focus:border-violet-300/50 focus:outline-none md:h-[58dvh]"
								/>
								<p className="mt-2 text-xs text-white/55">
									Auto-saved to local storage as you type.
								</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{showPrioritiesFullscreen && (
				<div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-3 py-6 backdrop-blur-sm">
					<div className="w-full max-w-3xl">
						<WorkPrioritiesCard
							api={prioritiesApi}
							maxPriorities={maxPriorities}
							isFullscreen
							dateLabel={dateLabel}
							onCloseFullscreen={() => setShowPrioritiesFullscreen(false)}
						/>
					</div>
				</div>
			)}

			<WisdomCard
				text={todayNudge.text}
				reference={todayNudge.reference}
				className="border-emerald-300/25 bg-emerald-500/10"
			/>
		</ModeContainer>
	);
};

export default WorkModeView;
