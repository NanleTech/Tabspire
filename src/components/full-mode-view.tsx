import { useEffect, useMemo, useState } from "react";
import Confetti from "react-confetti";
import { createPortal } from "react-dom";
import { getMoodVerseForDay, type MoodId, moodOptions } from "../data/mood-verse-library";
import { usePersistedState } from "../hooks/use-persisted-state";
import { useWindowSize } from "../hooks/use-window-size";
import type { Scripture } from "../types";
import DayEventBanner from "./day-event-banner";
import { AnchorCard, FeatureCard, GlassCard, ModeContainer, ModeIntro } from "./mode-view-shared";
import { WorkPrioritiesCard } from "./work-priorities/priorities-card";
import { useWorkPriorities } from "./work-priorities/use-work-priorities";

interface FullModeViewProps {
	scripture: Scripture | null;
	onPlay: () => void;
	onRefresh: () => void;
	onOpenDevotional: () => void;
	onOpenGoals: () => void;
	maxPriorities: number;
}

interface GoalItem {
	id: string;
	title: string;
	current: number;
	target: number;
}

type JournalEntriesByDate = Record<string, string>;

const defaultGoals: GoalItem[] = [
	{ id: "g1", title: "Focus blocks completed", current: 1, target: 3 },
	{ id: "g2", title: "Meaningful outreach messages", current: 0, target: 2 },
	{ id: "g3", title: "Strategic decisions closed", current: 0, target: 2 },
];

const FullModeView: React.FC<FullModeViewProps> = ({
	scripture,
	onPlay,
	onRefresh,
	onOpenDevotional,
	onOpenGoals,
	maxPriorities,
}) => {
	const prioritiesApi = useWorkPriorities(maxPriorities);
	const dateLabel = new Date().toLocaleDateString(undefined, {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	});
	const [goals] = usePersistedState<GoalItem[]>("tabspire_full_goals", defaultGoals);
	const [selectedMood, setSelectedMood] = usePersistedState<MoodId>(
		"tabspire_full_mood",
		"peaceful",
	);
	const [showMoodBurst, setShowMoodBurst] = useState(false);
	const { width, height } = useWindowSize();
	const totalCurrent = goals.reduce((sum, goal) => sum + goal.current, 0);
	const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
	const completionRate = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;
	const moodVerse = getMoodVerseForDay(selectedMood);
	const moodScripture: Scripture = { text: moodVerse.text, reference: moodVerse.reference };
	const anchorScripture = scripture?.text?.trim() ? scripture : moodScripture;
	const selectedMoodMeta = moodOptions.find((mood) => mood.id === selectedMood) || moodOptions[0];

	const [journalEntries, setJournalEntries] = usePersistedState<JournalEntriesByDate>(
		"tabspire_simple_journal_entries",
		{},
	);
	const todayKey = new Date().toISOString().slice(0, 10);
	const rawTodayJournal = journalEntries[todayKey] || "";
	const todayJournal = rawTodayJournal.trim();
	const hasTodayJournal = todayJournal.length > 0;
	const journalPreview =
		hasTodayJournal && todayJournal.length > 220 ? `${todayJournal.slice(0, 220)}…` : todayJournal;

	const [isJournalOpen, setIsJournalOpen] = useState(false);
	const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
	const [showPrioritiesFullscreen, setShowPrioritiesFullscreen] = useState(false);
	const entryDates = useMemo(
		() =>
			Object.keys(journalEntries)
				.filter((entryDate) => (journalEntries[entryDate] || "").trim().length > 0)
				.sort((a, b) => b.localeCompare(a)),
		[journalEntries],
	);

	const {
		priorities,
		completedCount: completedPriorities,
		totalFocusedSeconds,
		formatDurationSummary,
		focusMode,
	} = prioritiesApi;
	const totalPriorities = priorities.length;

	useEffect(() => {
		if (!showMoodBurst) return;
		const timer = window.setTimeout(() => setShowMoodBurst(false), 1400);
		return () => window.clearTimeout(timer);
	}, [showMoodBurst]);

	const handleMoodSelect = (moodId: MoodId) => {
		setSelectedMood(moodId);
		if (moodId === "grateful" || moodId === "hopeful") {
			setShowMoodBurst(true);
		}
		setIsMoodModalOpen(false);
	};

	return (
		<ModeContainer>
			{focusMode && !showPrioritiesFullscreen && (
				<div className="pointer-events-none fixed inset-0 z-10 bg-black/40 transition-opacity" />
			)}
			<ModeIntro title="Lead with clarity and execution" subtitle={dateLabel} />
			<AnchorCard
				scripture={anchorScripture}
				fallbackText="Commit your work to the Lord, and your plans will be established."
				fallbackReference="Proverbs 16:3"
				anchorLabel={`Full anchor · ${selectedMoodMeta.label}`}
				accentClassName="border-blue-200/25 bg-blue-500/10"
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
					<span>{selectedMoodMeta.emoji}</span>
					<span className="capitalize">{selectedMoodMeta.label}</span>
				</button>
			</div>

			<DayEventBanner />

			<button type="button" onClick={() => setIsJournalOpen(true)} className="w-full text-left">
				<GlassCard className="border-violet-300/25 bg-violet-500/10 text-left">
					<div className="mb-1.5 flex items-center justify-between gap-2">
						<p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-100/90">
							Journal
						</p>
						<span className="text-[11px] font-medium text-violet-100/80">
							{hasTodayJournal ? "Saved" : "Not captured"}
						</span>
					</div>
					<p className="text-xs text-white/70">
						{hasTodayJournal
							? journalPreview
							: "Capture what God is highlighting today in your journal."}
					</p>
				</GlassCard>
			</button>

			<FeatureCard
				title="Today&apos;s priorities"
				subtitle={
					totalPriorities === 0
						? "No priorities added yet. Click to add your first focus."
						: undefined
				}
				metric={
					totalPriorities > 0
						? `${completedPriorities} of ${totalPriorities} done${
								totalFocusedSeconds > 0
									? ` · ${formatDurationSummary(totalFocusedSeconds)} focused`
									: ""
							}`
						: undefined
				}
				onClick={() => setShowPrioritiesFullscreen(true)}
				className="border-emerald-300/25 bg-emerald-500/10 text-left"
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
									const active = selectedMood === mood.id;
									return (
										<button
											key={mood.id}
											type="button"
											onClick={() => handleMoodSelect(mood.id)}
											className={`rounded-xl border px-3 py-2 text-left text-xs transition duration-200 md:text-sm ${
												active
													? "border-blue-300/70 bg-blue-400/20 text-white shadow-[0_0_0_1px_rgba(147,197,253,0.35),0_8px_20px_rgba(59,130,246,0.25)]"
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
													entryDate === todayKey
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
									Today - {new Date(`${todayKey}T00:00:00`).toLocaleDateString()}
								</p>
								<textarea
									value={journalEntries[todayKey] || ""}
									onChange={(event) =>
										setJournalEntries((prev) => ({
											...prev,
											[todayKey]: event.target.value,
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

			<FeatureCard
				title="Goals"
				subtitle="Tap to view and edit your goals dashboard."
				metric={`${completionRate}% complete`}
				onClick={onOpenGoals}
				className="border-blue-300/20 bg-blue-500/10 text-left"
			/>
			{showMoodBurst &&
				width > 0 &&
				height > 0 &&
				createPortal(
					<Confetti
						width={width}
						height={height}
						recycle={false}
						numberOfPieces={160}
						gravity={0.24}
						style={{
							position: "fixed",
							inset: 0,
							pointerEvents: "none",
							zIndex: 9999,
						}}
					/>,
					document.body,
				)}
		</ModeContainer>
	);
};

export default FullModeView;
