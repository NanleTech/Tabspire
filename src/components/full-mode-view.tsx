import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { createPortal } from "react-dom";
import { getMoodVerseForDay, type MoodId, moodOptions } from "../data/mood-verse-library";
import { usePersistedState } from "../hooks/use-persisted-state";
import { useWindowSize } from "../hooks/use-window-size";
import type { Scripture } from "../types";
import { AnchorCard, GlassCard, ModeContainer, ModeIntro } from "./mode-view-shared";

interface FullModeViewProps {
	scripture: Scripture | null;
	onPlay: () => void;
	onRefresh: () => void;
	onOpenDevotional: () => void;
	onOpenGoals: () => void;
}

interface GoalItem {
	id: string;
	title: string;
	current: number;
	target: number;
}

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
}) => {
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
	const overviewGoals = goals.slice(0, 2);
	const moodVerse = getMoodVerseForDay(selectedMood);
	const moodScripture: Scripture = { text: moodVerse.text, reference: moodVerse.reference };
	const anchorScripture = scripture?.text?.trim() ? scripture : moodScripture;

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
	};

	return (
		<ModeContainer>
			<ModeIntro title="Lead with clarity and execution" subtitle={dateLabel} />
			<AnchorCard
				scripture={anchorScripture}
				fallbackText="Commit your work to the Lord, and your plans will be established."
				fallbackReference="Proverbs 16:3"
				anchorLabel="Full anchor · Excellence"
				accentClassName="border-blue-200/25 bg-blue-500/10"
				onPlay={onPlay}
				onRefresh={onRefresh}
				onOpenDevotional={onOpenDevotional}
			/>

			<GlassCard className="text-left">
				<div className="mb-2.5 flex items-center justify-between">
					<h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-white/70 md:text-sm">
						Mood-based encouragement
					</h3>
					<p className="text-xs text-white/60">Choose how you feel now</p>
				</div>
				<div className="relative mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
					{moodOptions.map((mood) => {
						const isActive = selectedMood === mood.id;
						return (
							<button
								key={mood.id}
								type="button"
								onClick={() => handleMoodSelect(mood.id)}
								className={`rounded-xl border px-3 py-2 text-left text-xs transition duration-200 md:text-sm ${
									isActive
										? "scale-[1.02] border-blue-300/60 bg-blue-300/20 text-white shadow-[0_0_0_1px_rgba(147,197,253,0.3),0_8px_20px_rgba(59,130,246,0.2)]"
										: "border-white/15 bg-white/[0.03] text-white/80 hover:-translate-y-[1px] hover:border-white/30 hover:bg-white/[0.07]"
								}`}
							>
								<span className="mr-1.5">{mood.emoji}</span>
								{mood.label}
							</button>
						);
					})}
				</div>
			</GlassCard>

			<GlassCard className="border-blue-300/20 bg-blue-500/10 text-left">
				<div className="mb-2.5 flex items-center justify-between gap-3">
					<h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-100 md:text-sm">
						Goals workspace
					</h3>
					<p className="text-xs font-semibold text-blue-100/90">{completionRate}% complete</p>
				</div>
				<div className="mb-2 grid grid-cols-3 gap-2">
					<div className="rounded-xl border border-white/15 bg-white/[0.04] px-2.5 py-2">
						<p className="text-[10px] uppercase tracking-[0.08em] text-white/55">Goals</p>
						<p className="text-sm font-semibold text-white/90">{goals.length}</p>
					</div>
					<div className="rounded-xl border border-white/15 bg-white/[0.04] px-2.5 py-2">
						<p className="text-[10px] uppercase tracking-[0.08em] text-white/55">Progress</p>
						<p className="text-sm font-semibold text-white/90">{totalCurrent}</p>
					</div>
					<div className="rounded-xl border border-white/15 bg-white/[0.04] px-2.5 py-2">
						<p className="text-[10px] uppercase tracking-[0.08em] text-white/55">Target</p>
						<p className="text-sm font-semibold text-white/90">{totalTarget}</p>
					</div>
				</div>
				<div className="space-y-1.5">
					{overviewGoals.map((goal) => (
						<div
							key={goal.id}
							className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
						>
							<p className="truncate text-sm text-white/90">{goal.title}</p>
							<p className="text-xs text-white/65">
								{goal.current}/{goal.target}
							</p>
						</div>
					))}
				</div>
				<button
					type="button"
					onClick={onOpenGoals}
					className="mt-3 rounded-xl border border-blue-300/45 bg-blue-300/20 px-3.5 py-1.5 text-xs font-semibold text-blue-100 transition hover:bg-blue-300/30 md:text-sm"
				>
					See full goal dashboard →
				</button>
			</GlassCard>
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
