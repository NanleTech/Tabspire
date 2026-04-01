import { useState } from "react";
import { usePersistedState } from "../hooks/use-persisted-state";
import { GlassCard, ModeContainer, ModeIntro } from "./mode-view-shared";

interface GoalItem {
	id: string;
	title: string;
	current: number;
	target: number;
}

interface GoalsDashboardViewProps {
	onBack: () => void;
}

const defaultGoals: GoalItem[] = [
	{ id: "g1", title: "Focus blocks completed", current: 1, target: 3 },
	{ id: "g2", title: "Meaningful outreach messages", current: 0, target: 2 },
	{ id: "g3", title: "Strategic decisions closed", current: 0, target: 2 },
];

const GoalsDashboardView: React.FC<GoalsDashboardViewProps> = ({ onBack }) => {
	const [goals, setGoals] = usePersistedState<GoalItem[]>("tabspire_full_goals", defaultGoals);
	const [newGoalTitle, setNewGoalTitle] = useState("");
	const [newGoalTarget, setNewGoalTarget] = useState(1);

	const totalCurrent = goals.reduce((sum, goal) => sum + goal.current, 0);
	const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
	const completionRate = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

	const updateGoalProgress = (id: string, delta: number) => {
		setGoals((prev) =>
			prev.map((goal) => {
				if (goal.id !== id) return goal;
				const nextCurrent = Math.max(0, Math.min(goal.target, goal.current + delta));
				return { ...goal, current: nextCurrent };
			}),
		);
	};

	const removeGoal = (id: string) => {
		setGoals((prev) => prev.filter((goal) => goal.id !== id));
	};

	const addGoal = () => {
		const title = newGoalTitle.trim();
		if (!title) return;
		setGoals((prev) => [
			...prev,
			{ id: `${Date.now()}`, title, current: 0, target: Math.max(1, newGoalTarget) },
		]);
		setNewGoalTitle("");
		setNewGoalTarget(1);
	};

	const insightText =
		completionRate >= 80
			? "Strong momentum. Keep your pace and close the day with gratitude."
			: completionRate >= 40
				? "Solid progress. Protect your next focus block from distractions."
				: "Start with one meaningful win and build momentum from there.";

	return (
		<ModeContainer>
			<div className="mb-2 flex items-center justify-between">
				<ModeIntro title="Full mode dashboard" subtitle="Track and close your goals with clarity" />
				<button
					type="button"
					onClick={onBack}
					className="rounded-xl border border-white/25 bg-black/20 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-black/30"
				>
					← Back
				</button>
			</div>

			<GlassCard>
				<div className="mb-2.5 flex items-center justify-between">
					<h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-white/70 md:text-sm">Goal dashboard</h3>
					<p className="text-xs font-semibold text-blue-200/90">{completionRate}% complete</p>
				</div>
				<div className="space-y-2">
					{goals.map((goal) => {
						const percentage = goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0;
						return (
							<div key={goal.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
								<div className="mb-2 flex items-center justify-between gap-2">
									<p className="min-w-0 break-words text-sm text-white/90">{goal.title}</p>
									<button
										type="button"
										onClick={() => removeGoal(goal.id)}
										className="rounded-md border border-white/20 px-1.5 py-0.5 text-[11px] text-white/60 hover:bg-white/10"
									>
										×
									</button>
								</div>
								<div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/10">
									<div className="h-full rounded-full bg-blue-300/80" style={{ width: `${percentage}%` }} />
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-1.5">
										<button
											type="button"
											onClick={() => updateGoalProgress(goal.id, -1)}
											className="rounded-md border border-white/20 px-2 py-0.5 text-xs"
										>
											-
										</button>
										<span className="text-xs text-white/70">{goal.current}/{goal.target}</span>
										<button
											type="button"
											onClick={() => updateGoalProgress(goal.id, 1)}
											className="rounded-md border border-white/20 px-2 py-0.5 text-xs"
										>
											+
										</button>
									</div>
									<span className="text-xs text-blue-200/80">{percentage}%</span>
								</div>
							</div>
						);
					})}
				</div>
				<div className="mt-2.5 flex flex-col gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.02] p-2.5 sm:flex-row sm:items-center">
					<input
						type="text"
						value={newGoalTitle}
						onChange={(event) => setNewGoalTitle(event.target.value)}
						placeholder="Add a new goal..."
						className="min-w-0 flex-1 rounded-lg border border-white/15 bg-black/30 px-2.5 py-1.5 text-xs text-white placeholder:text-white/45 focus:border-blue-300/40 focus:outline-none"
					/>
					<input
						type="number"
						min={1}
						value={newGoalTarget}
						onChange={(event) => setNewGoalTarget(Number(event.target.value) || 1)}
						className="w-full rounded-lg border border-white/15 bg-black/30 px-2.5 py-1.5 text-xs text-white focus:border-blue-300/40 focus:outline-none sm:w-20"
					/>
					<button
						type="button"
						onClick={addGoal}
						disabled={!newGoalTitle.trim()}
						className="rounded-lg border border-blue-300/35 bg-blue-300/15 px-3 py-1.5 text-xs font-semibold text-blue-100 transition hover:bg-blue-300/25 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Add
					</button>
				</div>
			</GlassCard>

			<div className="grid gap-2.5 sm:grid-cols-3">
				<GlassCard className="mb-0 p-3.5 text-left">
					<p className="text-xs uppercase tracking-[0.08em] text-white/55">Active goals</p>
					<p className="mt-1 text-lg font-semibold text-white/90">{goals.length}</p>
				</GlassCard>
				<GlassCard className="mb-0 p-3.5 text-left">
					<p className="text-xs uppercase tracking-[0.08em] text-white/55">Steps completed</p>
					<p className="mt-1 text-lg font-semibold text-white/90">{totalCurrent}</p>
				</GlassCard>
				<GlassCard className="mb-0 p-3.5 text-left">
					<p className="text-xs uppercase tracking-[0.08em] text-white/55">Total target</p>
					<p className="mt-1 text-lg font-semibold text-white/90">{totalTarget}</p>
				</GlassCard>
			</div>

			<GlassCard className="border-blue-300/20 bg-blue-500/10">
				<h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-blue-100 md:text-sm">Weekly AI-style insight</h3>
				<p className="text-sm text-white/85">{insightText}</p>
			</GlassCard>
		</ModeContainer>
	);
};

export default GoalsDashboardView;
