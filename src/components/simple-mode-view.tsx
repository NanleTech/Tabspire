import { useMemo, useState } from "react";
import Confetti from "react-confetti";
import { createPortal } from "react-dom";
import { getMoodVerseForDay, type MoodId, moodOptions } from "../data/mood-verse-library";
import { usePersistedState } from "../hooks/use-persisted-state";
import { useWindowSize } from "../hooks/use-window-size";
import type { Scripture } from "../types";
import { AnchorCard, FeatureCard, GlassCard, ModeContainer, ModeIntro } from "./mode-view-shared";

interface SimpleModeViewProps {
	scripture: Scripture | null;
	onPlay: () => void;
	onRefresh: () => void;
	onOpenDevotional: () => void;
}

interface HabitItem {
	id: string;
	label: string;
	done: boolean;
}

type JournalEntriesByDate = Record<string, string>;

const defaultHabits: HabitItem[] = [
	{ id: "h1", label: "Read scripture before starting work", done: false },
	{ id: "h2", label: "Pray for wisdom in key decisions", done: false },
	{ id: "h3", label: "Encourage one person today", done: false },
];

const SimpleModeView: React.FC<SimpleModeViewProps> = ({
	scripture,
	onPlay,
	onRefresh,
	onOpenDevotional,
}) => {
	const dateLabel = new Date().toLocaleDateString(undefined, {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	const [selectedMood, setSelectedMood] = usePersistedState<MoodId>(
		"tabspire_simple_mood",
		"peaceful",
	);
	const [journalEntries, setJournalEntries] = usePersistedState<JournalEntriesByDate>(
		"tabspire_simple_journal_entries",
		{},
	);
	const [isJournalOpen, setIsJournalOpen] = useState(false);
	const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
	const [showMoodBurst, setShowMoodBurst] = useState(false);
	const { width, height } = useWindowSize();
	const [habits, setHabits] = usePersistedState<HabitItem[]>(
		"tabspire_simple_habits",
		defaultHabits,
	);

	const dayKey = new Date().toISOString().slice(0, 10);
	const todayEntry = journalEntries[dayKey] || "";
	const entryDates = useMemo(
		() =>
			Object.keys(journalEntries)
				.filter((date) => (journalEntries[date] || "").trim().length > 0)
				.sort((a, b) => b.localeCompare(a)),
		[journalEntries],
	);
	const completedHabits = habits.filter((item) => item.done).length;
	const moodVerse = getMoodVerseForDay(selectedMood);
	const moodScripture: Scripture = { text: moodVerse.text, reference: moodVerse.reference };
	const anchorScripture = scripture?.text?.trim() ? scripture : moodScripture;
	const selectedMoodMeta = moodOptions.find((mood) => mood.id === selectedMood) || moodOptions[0];

	const toggleHabit = (id: string) => {
		setHabits((prev) =>
			prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
		);
	};

	const handleMoodSelect = (moodId: MoodId) => {
		setSelectedMood(moodId);
		if (moodId === "grateful" || moodId === "hopeful") {
			setShowMoodBurst(true);
			window.setTimeout(() => setShowMoodBurst(false), 1400);
		}
		setIsMoodModalOpen(false);
	};

	return (
		<ModeContainer>
			<ModeIntro title="Breathe, receive, begin" subtitle={dateLabel} />
			<AnchorCard
				scripture={anchorScripture}
				fallbackText="Now faith is confidence in what we hope for and assurance about what we do not see."
				fallbackReference="Hebrews 11:1"
				anchorLabel={`Simple anchor · ${selectedMoodMeta.label}`}
				accentClassName="border-violet-200/25 bg-violet-500/10"
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

			<GlassCard>
				<div className="mb-2.5 flex items-center justify-between">
					<h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-white/70 md:text-sm">
						Faith habits
					</h3>
					<p className="text-xs font-semibold text-violet-200/80">
						{completedHabits} of {habits.length} complete
					</p>
				</div>
				<div className="space-y-1.5">
					{habits.map((habit) => (
						<button
							key={habit.id}
							type="button"
							onClick={() => toggleHabit(habit.id)}
							className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left"
						>
							<span
								className={`h-4 w-4 rounded-md border ${habit.done ? "border-violet-300/80 bg-violet-300/40" : "border-white/35"}`}
							/>
							<span
								className={`text-sm ${habit.done ? "text-white/50 line-through" : "text-white/90"}`}
							>
								{habit.label}
							</span>
						</button>
					))}
				</div>
			</GlassCard>

			<FeatureCard
				title="Journal"
				subtitle={
					todayEntry.trim()
						? "Today's journal is saved locally."
						: "Capture what God is highlighting today."
				}
				metric={todayEntry.trim() ? "Saved" : "Not captured"}
				onClick={() => setIsJournalOpen(true)}
				className="border-violet-300/20 bg-violet-500/10"
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
													? "border-violet-300/70 bg-violet-400/20 text-white shadow-[0_0_0_1px_rgba(196,181,253,0.35),0_8px_20px_rgba(139,92,246,0.25)]"
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
										entryDates.map((date) => (
											<div
												key={date}
												className={`rounded-lg border px-2.5 py-1.5 text-xs ${
													date === dayKey
														? "border-violet-300/40 bg-violet-300/10 text-violet-100"
														: "border-white/15 bg-white/[0.03] text-white/80"
												}`}
											>
												{new Date(`${date}T00:00:00`).toLocaleDateString()}
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
			{showMoodBurst &&
				width > 0 &&
				height > 0 &&
				createPortal(
					<Confetti
						width={width}
						height={height}
						recycle={false}
						numberOfPieces={140}
						gravity={0.22}
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

export default SimpleModeView;
