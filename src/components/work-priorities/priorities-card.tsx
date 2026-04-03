import type { FC } from "react";
import { GlassCard } from "../mode-view-shared";
import { tagClassByName, timerPresets } from "./constants";
import type { TWorkPrioritiesApi } from "./use-work-priorities";

type TWorkPrioritiesCardProps = {
	api: TWorkPrioritiesApi;
	maxPriorities: number;
	isFullscreen: boolean;
	dateLabel: string;
	onCloseFullscreen: () => void;
};

const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const WorkPrioritiesCard: FC<TWorkPrioritiesCardProps> = ({
	api,
	maxPriorities,
	isFullscreen,
	dateLabel,
	onCloseFullscreen,
}) => {
	const {
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
	} = api;

	const listHeightClass = isFullscreen ? "max-h-[60vh]" : "max-h-40";

	return (
		<GlassCard className={isFullscreen || focusMode ? "relative z-20" : ""}>
			<div
				className={`mb-2.5 flex items-center justify-between ${
					isFullscreen ? "sticky top-0 z-20 bg-[#070b14]/95 pb-2" : ""
				}`}
			>
				<h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-white/70 md:text-sm">
					Today&apos;s {maxPriorities} priorities
					{isFullscreen && (
						<span className="ml-2 text-[11px] font-normal text-white/50">{dateLabel}</span>
					)}
				</h3>
				<div className="flex items-center gap-2">
					{priorities.length > 0 && (
						<button
							type="button"
							onClick={handleClearAllPriorities}
							className="rounded-lg border border-white/25 bg-black/30 px-2 py-0.5 text-[11px] font-medium text-white/70 hover:bg-black/50"
						>
							Clear all
						</button>
					)}
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
						onClick={() => (isFullscreen ? onCloseFullscreen() : undefined)}
						className="hidden rounded-lg border border-white/30 bg-black/30 px-2 py-0.5 text-xs font-semibold text-white/80 hover:bg-black/50 sm:inline-flex"
					>
						{isFullscreen ? "Close" : "Full view"}
					</button>
					<p className="text-xs font-semibold text-emerald-300/90 md:text-sm">
						{completedCount} of {priorities.length} done
					</p>
				</div>
			</div>
			{totalFocusedSeconds > 0 && (
				<p className="mb-1 text-[11px] text-white/65">
					Focused today: {formatDurationSummary(totalFocusedSeconds)}
					{nudgeTag && ` · Mostly ${nudgeTag}`}
				</p>
			)}
			<div className="mb-1 flex flex-wrap gap-1.5 text-[11px] text-white/75">
				{timerPresets.map((preset) => (
					<button
						key={preset.id}
						type="button"
						onClick={() => handleAddPreset(preset.id)}
						className="rounded-full border border-emerald-300/35 bg-emerald-300/10 px-2.5 py-0.5 font-medium hover:bg-emerald-300/20"
					>
						{preset.label}
					</button>
				))}
			</div>
			<div className={`space-y-1 ${listHeightClass} overflow-y-auto pr-1`}>
				{priorities.map((priority) => {
					const isActive = priority.isTimerRunning;
					const isFocusedTask = focusMode && activePriorityId === priority.id;
					const isSelected = activePriorityId === priority.id;
					const timerProgress = priority.timerDuration
						? ((priority.timerElapsed || 0) / (priority.timerDuration * 60)) * 100
						: 0;
					const remainingSeconds = priority.timerDuration
						? priority.timerDuration * 60 - (priority.timerElapsed || 0)
						: 0;

					return (
						<div
							key={priority.id}
							ref={(el) => {
								priorityRefs.current[priority.id] = el;
							}}
							className={`rounded-xl border px-3 py-2 md:px-3.5 transition-all ${
								isFocusedTask
									? "border-amber-300/60 bg-amber-500/10 shadow-lg"
									: isActive
										? "border-blue-300/40 bg-blue-500/5"
										: isSelected
											? "border-emerald-300/50 bg-emerald-500/5"
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
										{priority.softDeadline && (
											<div className="mt-1 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/30 px-2 py-0.5 text-[11px] text-white/70">
												<span>⏰ Before {priority.softDeadline}</span>
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
								onChange={(event) => setNewPriorityTag(event.target.value as typeof newPriorityTag)}
								className="rounded-lg border border-white/15 bg-black/30 px-2.5 py-1.5 text-xs text-white focus:border-emerald-300/40 focus:outline-none"
							>
								<option value="Deep work">Deep work</option>
								<option value="Meeting">Meeting</option>
								<option value="Admin">Admin</option>
							</select>
							<div className="flex flex-col gap-1.5">
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
								<div className="flex items-center gap-1.5">
									<input
										type="time"
										value={newPriorityDeadline}
										onChange={(event) => setNewPriorityDeadline(event.target.value)}
										className="w-full rounded-lg border border-white/15 bg-black/30 px-2.5 py-1.5 text-xs text-white focus:border-emerald-300/40 focus:outline-none"
									/>
									<span className="text-xs text-white/60">⏰</span>
								</div>
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
