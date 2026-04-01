import { useMemo, useState } from "react";
import type { Devotional } from "../types";
import {
	cleanDevotionalContent,
	extractBibleReadingPlan,
	createContentPreview,
	createBibleGatewayUrl,
} from "../utils/string_utils";

interface DevotionalModernProps {
	devotional: Devotional;
	fontStyle: string;
	fontSize: number;
	isDarkMode: boolean;
	onPlay?: () => void;
	isPlaying?: boolean;
	disabled?: boolean;
	onBack: () => void;
}

const topicPlans: Record<string, string[]> = {
	anointing: ["1 Samuel 16", "Isaiah 61", "Luke 4", "Acts 10", "1 John 2"],
	faith: ["Hebrews 11", "Romans 10", "James 2", "Mark 9", "Matthew 17"],
	purpose: ["Jeremiah 1", "Ephesians 2", "Romans 8", "Proverbs 16", "Colossians 3"],
	wisdom: ["Proverbs 1", "James 1", "Proverbs 3", "Ecclesiastes 3", "Proverbs 16"],
};

const sanitizePlainText = (raw: string) =>
	raw
		.replace(/<[^>]*>/g, " ")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/\s+/g, " ")
		.trim();

const DevotionalModern: React.FC<DevotionalModernProps> = ({
	devotional,
	fontStyle,
	fontSize,
	isDarkMode,
	onPlay,
	isPlaying = false,
	disabled = false,
	onBack,
}) => {
	const [tab, setTab] = useState<"devotional" | "reading-plan">("devotional");
	const [expanded, setExpanded] = useState(false);
	const [planMode, setPlanMode] = useState<"auto" | "whole-bible" | "book" | "topic">("auto");
	const [selectedBook, setSelectedBook] = useState("John");
	const [topicInput, setTopicInput] = useState("anointing");

	const content = useMemo(() => {
		const cleanedContent = cleanDevotionalContent(devotional.content);
		const { plan, cleanedContent: devotionalOnly } = extractBibleReadingPlan(cleanedContent);
		const rawText = sanitizePlainText(devotional.content);
		const bestContent =
			devotionalOnly.length >= 260 ? devotionalOnly : rawText.length > devotionalOnly.length ? rawText : devotionalOnly;
		const preview = createContentPreview(bestContent, 320);
		return {
			readingPlan: plan,
			fullDevotional: bestContent,
			previewText: preview.preview,
			hasMore: bestContent.length > preview.preview.length + 10 || preview.hasMore,
		};
	}, [devotional.content]);

	const readingPassages = useMemo(() => {
		if (!content.readingPlan) return [] as string[];
		return content.readingPlan
			.replace("Bible Reading Plan:", "")
			.split(/[,;]/)
			.map((item) => item.trim())
			.filter(Boolean);
	}, [content.readingPlan]);

	const generatedReadingPlan = useMemo(() => {
		if (planMode === "auto" && readingPassages.length > 0) return readingPassages;
		if (planMode === "whole-bible") {
			return ["Genesis 1-3", "Psalm 1", "Matthew 1", "Acts 1"];
		}
		if (planMode === "book") {
			return [`${selectedBook} 1`, `${selectedBook} 2`, `${selectedBook} 3`, `${selectedBook} 4`];
		}
		const topicKey = topicInput.trim().toLowerCase();
		return topicPlans[topicKey] || ["Psalm 23", "Isaiah 41", "Romans 8", "John 15"];
	}, [planMode, readingPassages, selectedBook, topicInput]);

	return (
		<div className="mx-auto w-full max-w-3xl animate-fade-in overflow-x-hidden px-2 pb-14 pt-1 text-white md:pb-10">
			<section className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/[0.14] via-white/[0.06] to-black/30 p-4 shadow-[0_20px_48px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-5">
				<div className="mb-3 flex items-center justify-between gap-3">
					<button
						type="button"
						onClick={onBack}
						className="rounded-xl border border-white/25 bg-black/20 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-black/30"
					>
						← Back to verse
					</button>
					<div className="flex items-center gap-2">
						{onPlay && (
							<button
								type="button"
								onClick={onPlay}
								disabled={disabled}
								className="rounded-xl border border-emerald-200/40 bg-emerald-300/15 px-3 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-300/25 disabled:opacity-50"
							>
								{isPlaying ? "⏹ Stop" : "▶ Listen"}
							</button>
						)}
					</div>
				</div>

				<div className="rounded-2xl border border-white/15 bg-black/20 p-3 text-center md:p-4">
					<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-200/80">
						Daily devotional
					</p>
					<h1 className="mt-1 text-lg font-semibold text-white md:text-xl" style={{ fontFamily: fontStyle }}>
						{devotional.title}
					</h1>
					<p className="mt-1 text-xs text-white/60 md:text-sm">{devotional.date}</p>
					{devotional.reference && (
						<p className="mt-1.5 text-xs font-medium text-emerald-200/90 md:text-sm">{devotional.reference}</p>
					)}
				</div>

				<div className="mt-4 grid grid-cols-2 gap-1 rounded-xl border border-white/20 bg-black/25 p-1">
					<button
						type="button"
						onClick={() => setTab("devotional")}
						className={`rounded-lg px-3 py-2 text-xs font-semibold transition md:text-sm ${
							tab === "devotional" ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
						}`}
					>
						Devotional
					</button>
					<button
						type="button"
						onClick={() => setTab("reading-plan")}
						className={`rounded-lg px-3 py-2 text-xs font-semibold transition md:text-sm ${
							tab === "reading-plan" ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
						}`}
					>
						Reading Plan
					</button>
				</div>

				<div className="mt-4 rounded-2xl border border-white/15 bg-black/25 p-4 text-left md:p-5">
					{tab === "devotional" ? (
						<>
							<p
								className="whitespace-pre-wrap text-sm leading-relaxed text-white/90 md:text-base"
								style={{ fontFamily: fontStyle, fontSize: `${fontSize * 0.9}rem` }}
							>
								{expanded ? content.fullDevotional : content.previewText}
							</p>
							{content.hasMore && (
								<button
									type="button"
									onClick={() => setExpanded((value) => !value)}
									className="mt-3 rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/85 transition hover:bg-white/20"
								>
									{expanded ? "Show preview" : "Read full Triump30 devotional"}
								</button>
							)}
							{devotional.url && (
								<a
									href={devotional.url}
									target="_blank"
									rel="noopener noreferrer"
									className="mt-3 inline-flex rounded-lg border border-emerald-200/35 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-300/20"
								>
									View on Triump30 ↗
								</a>
							)}
						</>
					) : (
						<div className="space-y-3">
							<div className="grid gap-2 sm:grid-cols-2">
								<select
									value={planMode}
									onChange={(event) => setPlanMode(event.target.value as "auto" | "whole-bible" | "book" | "topic")}
									className="rounded-lg border border-white/20 bg-black/35 px-2.5 py-2 text-xs text-white md:text-sm"
								>
									<option value="auto">Use Triump30 plan (if available)</option>
									<option value="whole-bible">Read entire Bible plan</option>
									<option value="book">Focus on one Bible book</option>
									<option value="topic">Goal/topic based plan</option>
								</select>
								{planMode === "book" ? (
									<select
										value={selectedBook}
										onChange={(event) => setSelectedBook(event.target.value)}
										className="rounded-lg border border-white/20 bg-black/35 px-2.5 py-2 text-xs text-white md:text-sm"
									>
										<option value="John">John</option>
										<option value="Romans">Romans</option>
										<option value="Psalms">Psalms</option>
										<option value="Proverbs">Proverbs</option>
										<option value="Acts">Acts</option>
									</select>
								) : planMode === "topic" ? (
									<input
										value={topicInput}
										onChange={(event) => setTopicInput(event.target.value)}
										placeholder="Topic or goal (e.g. anointing)"
										className="rounded-lg border border-white/20 bg-black/35 px-2.5 py-2 text-xs text-white placeholder:text-white/45 md:text-sm"
									/>
								) : (
									<div className="rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-2 text-xs text-white/65">
										{readingPassages.length > 0 ? "Using Triump30 reading plan." : "Triump30 plan missing. Fallback plan active."}
									</div>
								)}
							</div>
							<div className="flex flex-wrap gap-2">
								{generatedReadingPlan.map((passage) => (
								<button
									key={passage}
									type="button"
									onClick={() => {
										const link = createBibleGatewayUrl(passage);
										if (link) window.open(link, "_blank", "noopener,noreferrer");
									}}
									className="rounded-full border border-blue-300/45 bg-blue-400/15 px-3 py-1 text-xs font-medium text-blue-100 transition hover:bg-blue-400/25"
								>
									{passage}
								</button>
							))}
						</div>
						</div>
					)}
				</div>
			</section>
		</div>
	);
};

export default DevotionalModern;
