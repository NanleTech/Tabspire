import { useEffect, useMemo, useState } from "react";
import type { UserCustomEvent } from "../data/events.data";
import { BUILTIN_BACKGROUNDS, type FontStyle, SAMPLE_VERSE, type ThemeType } from "../enums";

type ModeType = "simple" | "work" | "full";
type SectionId = "mode" | "appearance" | "content" | "audio" | "display";

interface SettingsPanelProps {
	open: boolean;
	onClose: () => void;
	mode: ModeType;
	onModeChange: (mode: ModeType) => void;
	language: string;
	onLanguageChange: (lang: string) => void;
	fontStyle: FontStyle;
	onFontStyleChange: (style: FontStyle) => void;
	voices: SpeechSynthesisVoice[];
	selectedVoice: string;
	onVoiceChange: (voiceURI: string) => void;
	theme: ThemeType;
	onThemeChange: (theme: ThemeType) => void;
	customBackground: { type: "color" | "gradient" | "image" | ""; value: string };
	onSetBackground: (bg: string, type: "color" | "gradient" | "image" | "") => void;
	onResetBackground: () => void;
	onUploadBackground: (file: File) => void;
	showDateTime: boolean;
	onShowDateTimeChange: (val: boolean) => void;
	maxPriorities: number;
	onMaxPrioritiesChange: (val: number) => void;
	birthday: string;
	onBirthdayChange: (value: string) => void;
	customEvents: UserCustomEvent[];
	onCustomEventsChange: (value: UserCustomEvent[]) => void;
}

const sections: Array<{ id: SectionId; label: string; hint: string }> = [
	{ id: "mode", label: "Mode", hint: "Simple, Work, Full" },
	{ id: "appearance", label: "Appearance", hint: "Background + visual style" },
	{ id: "content", label: "Content", hint: "Language and typography" },
	{ id: "audio", label: "Audio", hint: "Voice and narration" },
	{ id: "display", label: "Display", hint: "Date/time and layout" },
];

const SettingsPanelModern: React.FC<SettingsPanelProps> = ({
	open,
	onClose,
	mode,
	onModeChange,
	language,
	onLanguageChange,
	fontStyle,
	onFontStyleChange,
	voices,
	selectedVoice,
	onVoiceChange,
	theme,
	onThemeChange,
	customBackground,
	onSetBackground,
	onResetBackground,
	onUploadBackground,
	showDateTime,
	onShowDateTimeChange,
	maxPriorities,
	onMaxPrioritiesChange,
	birthday,
	onBirthdayChange,
	customEvents,
	onCustomEventsChange,
}) => {
	const [activeSection, setActiveSection] = useState<SectionId>("mode");
	const [showSectionListMobile, setShowSectionListMobile] = useState(true);
	const [previewVoice, setPreviewVoice] = useState(selectedVoice);
	const [customEventTitle, setCustomEventTitle] = useState("");
	const [customEventDate, setCustomEventDate] = useState("");

	useEffect(() => {
		if (!open) return;
		setShowSectionListMobile(true);
	}, [open]);

	const modeCards = useMemo(
		() => [
			{
				id: "simple" as const,
				name: "Simple",
				accent: "#A78BFA",
				desc: "Peace and scripture focus",
			},
			{ id: "work" as const, name: "Work", accent: "#64C88C", desc: "Priorities and nudges" },
			{ id: "full" as const, name: "Full", accent: "#60A5FA", desc: "Goals and deeper tracking" },
		],
		[],
	);

	if (!open) return null;

	const handleVoicePreview = () => {
		const utterance = new window.SpeechSynthesisUtterance(
			`${SAMPLE_VERSE.text} - ${SAMPLE_VERSE.reference}`,
		);
		const voice = voices.find((v) => v.voiceURI === previewVoice);
		if (voice) utterance.voice = voice;
		window.speechSynthesis.speak(utterance);
	};

	const renderSection = () => {
		const addCustomEvent = () => {
			const title = customEventTitle.trim();
			if (!title || !customEventDate) return;

			const [yearPart, monthPart, dayPart] = customEventDate.split("-");
			const month = Number.parseInt(monthPart || "", 10);
			const day = Number.parseInt(dayPart || "", 10);
			if (!yearPart || !Number.isFinite(month) || !Number.isFinite(day)) return;

			const normalizedId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${month}-${day}`;
			const nextEvents = [
				...customEvents.filter((eventItem) => eventItem.id !== normalizedId),
				{
					id: normalizedId,
					title,
					month,
					day,
					showConfetti: true,
				},
			];

			onCustomEventsChange(nextEvents);
			setCustomEventTitle("");
			setCustomEventDate("");
		};

		const removeCustomEvent = (id: string) => {
			onCustomEventsChange(customEvents.filter((eventItem) => eventItem.id !== id));
		};

		switch (activeSection) {
			case "mode":
				return (
					<section className="space-y-4">
						<div>
							<h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">
								Experience mode
							</h3>
							<p className="mt-1 text-sm text-white/70">
								Switch depth instantly. Features adapt by mode.
							</p>
						</div>
						<div className="grid gap-2 md:grid-cols-3">
							{modeCards.map((card) => {
								const selected = mode === card.id;
								return (
									<button
										key={card.id}
										type="button"
										onClick={() => onModeChange(card.id)}
										className="rounded-2xl border p-4 text-left transition"
										style={{
											borderColor: selected ? card.accent : "rgba(255,255,255,0.15)",
											background: selected ? `${card.accent}18` : "rgba(255,255,255,0.03)",
										}}
									>
										<p className="text-base font-semibold text-white">{card.name}</p>
										<p className="mt-1 text-xs text-white/70">{card.desc}</p>
									</button>
								);
							})}
						</div>
					</section>
				);
			case "appearance":
				return (
					<section className="space-y-4">
						<div>
							<h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">
								Background
							</h3>
							<p className="mt-1 text-sm text-white/70">
								Choose built-ins, upload, or reset to random.
							</p>
						</div>
						<div className="grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-2">
							{BUILTIN_BACKGROUNDS.map((bg) => (
								<button
									key={`${bg.type}-${bg.value}`}
									type="button"
									onClick={() => onSetBackground(bg.value, bg.type)}
									className="aspect-square w-full rounded-xl border-2"
									style={{
										borderColor:
											customBackground.value === bg.value && customBackground.type === bg.type
												? "#60A5FA"
												: "rgba(255,255,255,0.2)",
										background:
											bg.type === "color" || bg.type === "gradient" ? bg.value : undefined,
										backgroundImage: bg.type === "image" ? `url(${bg.value})` : undefined,
										backgroundSize: "cover",
										backgroundPosition: "center",
									}}
								/>
							))}
							<label className="aspect-square w-full cursor-pointer rounded-xl border border-dashed border-white/35 bg-white/5 text-center text-xl leading-[46px] text-white/80">
								+
								<input
									type="file"
									accept="image/*"
									className="hidden"
									onChange={(event) => {
										if (event.target.files?.[0]) onUploadBackground(event.target.files[0]);
									}}
								/>
							</label>
							<button
								type="button"
								onClick={onResetBackground}
								className="aspect-square w-full rounded-xl border border-white/25 bg-black/30 text-sm text-white/80"
								title="Reset"
							>
								↺
							</button>
						</div>
					</section>
				);
			case "content":
				return (
					<section className="space-y-4">
						<div>
							<h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">
								Content preferences
							</h3>
						</div>
						<div className="grid gap-3 md:grid-cols-2">
							<div>
								<p className="mb-1 text-xs text-white/60">Language</p>
								<select
									value={language}
									onChange={(e) => onLanguageChange(e.target.value)}
									className="w-full rounded-xl border border-white/20 bg-black/35 px-3 py-2 text-sm text-white"
								>
									<option value="en">English</option>
									<option value="es">Spanish</option>
									<option value="hat">Haitian Creole</option>
									<option value="yor">Yoruba</option>
								</select>
							</div>
							<div>
								<p className="mb-1 text-xs text-white/60">Font style</p>
								<select
									value={fontStyle}
									onChange={(e) => onFontStyleChange(e.target.value as FontStyle)}
									className="w-full rounded-xl border border-white/20 bg-black/35 px-3 py-2 text-sm text-white"
								>
									<option value="serif">Serif</option>
									<option value="sans-serif">Sans-serif</option>
									<option value="monospace">Monospace</option>
									<option value="cursive">Cursive</option>
								</select>
							</div>
						</div>
					</section>
				);
			case "audio":
				return (
					<section className="space-y-4">
						<div>
							<h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">
								Audio
							</h3>
						</div>
						<div className="grid gap-3 md:grid-cols-2">
							<div>
								<p className="mb-1 text-xs text-white/60">System voice</p>
								<select
									value={selectedVoice}
									onChange={(e) => {
										onVoiceChange(e.target.value);
										setPreviewVoice(e.target.value);
									}}
									className="w-full rounded-xl border border-white/20 bg-black/35 px-3 py-2 text-sm text-white"
								>
									{voices.map((voice) => (
										<option key={voice.voiceURI} value={voice.voiceURI}>
											{voice.name}
										</option>
									))}
								</select>
							</div>
						</div>
						<button
							type="button"
							onClick={handleVoicePreview}
							className="rounded-xl border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/85"
						>
							🔊 Preview sample
						</button>
					</section>
				);
			case "display":
				return (
					<section className="space-y-4">
						<div>
							<h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">
								Display
							</h3>
						</div>
						<div className="grid gap-3 md:grid-cols-2">
							<div>
								<p className="mb-1 text-xs text-white/60">Theme level</p>
								<select
									value={theme}
									onChange={(e) => onThemeChange(e.target.value as ThemeType)}
									className="w-full rounded-xl border border-white/20 bg-black/35 px-3 py-2 text-sm text-white"
								>
									<option value="minimal">Minimal</option>
									<option value="full">Full</option>
								</select>
							</div>
							<label className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/30 px-3 py-2 text-sm text-white/85">
								<input
									type="checkbox"
									checked={showDateTime}
									onChange={(e) => onShowDateTimeChange(e.target.checked)}
								/>
								Show date and time
							</label>
						</div>
						<div className="rounded-xl border border-white/20 bg-black/30 px-3 py-3">
							<p className="mb-1 text-xs text-white/60">Birthday</p>
							<div className="flex items-center gap-2">
								<input
									type="date"
									value={birthday}
									onChange={(event) => onBirthdayChange(event.target.value)}
									className="w-full rounded-xl border border-white/20 bg-black/35 px-3 py-2 text-sm text-white"
								/>
								<button
									type="button"
									onClick={() => onBirthdayChange("")}
									className="rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-xs font-semibold text-white/85"
								>
									Clear
								</button>
							</div>
							<p className="mt-1 text-xs text-white/55">
								Used for your personal birthday celebration in events.
							</p>
						</div>
						<div className="rounded-xl border border-white/20 bg-black/30 px-3 py-3">
							<p className="mb-1 text-xs text-white/60">Custom events</p>
							<div className="grid gap-2 md:grid-cols-[1fr,180px,auto]">
								<input
									type="text"
									value={customEventTitle}
									onChange={(event) => setCustomEventTitle(event.target.value)}
									placeholder="Event title (e.g. Family Day)"
									className="w-full rounded-xl border border-white/20 bg-black/35 px-3 py-2 text-sm text-white"
								/>
								<input
									type="date"
									value={customEventDate}
									onChange={(event) => setCustomEventDate(event.target.value)}
									className="w-full rounded-xl border border-white/20 bg-black/35 px-3 py-2 text-sm text-white"
								/>
								<button
									type="button"
									onClick={addCustomEvent}
									className="rounded-xl border border-emerald-300/35 bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-100"
								>
									Add event
								</button>
							</div>
							{customEvents.length > 0 && (
								<div className="mt-3 space-y-1.5">
									{customEvents.map((eventItem) => (
										<div
											key={eventItem.id}
											className="flex items-center justify-between rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-1.5"
										>
											<p className="text-xs text-white/85">
												{eventItem.title} · {String(eventItem.month).padStart(2, "0")}/
												{String(eventItem.day).padStart(2, "0")}
											</p>
											<button
												type="button"
												onClick={() => removeCustomEvent(eventItem.id)}
												className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-[11px] text-white/80"
											>
												Remove
											</button>
										</div>
									))}
								</div>
							)}
							<p className="mt-1 text-xs text-white/55">
								Add recurring custom dates for birthdays, anniversaries, and ministry milestones.
							</p>
						</div>
						{mode === "work" && (
							<div className="rounded-xl border border-emerald-300/20 bg-emerald-500/5 p-3">
								<p className="mb-2 text-xs font-semibold text-emerald-200/90">Work Mode Settings</p>
								<div>
									<p className="mb-1 text-xs text-white/60">Max priorities (1-5)</p>
									<div className="flex items-center gap-2">
										<input
											type="range"
											min="1"
											max="5"
											value={maxPriorities}
											onChange={(e) => onMaxPrioritiesChange(Number(e.target.value))}
											className="flex-1"
										/>
										<span className="tabular-nums text-sm font-semibold text-emerald-200">
											{maxPriorities}
										</span>
									</div>
									<p className="mt-1 text-xs text-white/50">
										Controls how many priorities you can add for the day
									</p>
								</div>
							</div>
						)}
					</section>
				);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden bg-black/70 p-2 backdrop-blur-sm md:p-5">
			<div className="h-[92dvh] w-full max-w-6xl overflow-hidden rounded-3xl border border-white/15 bg-[#070b14] shadow-2xl">
				<div className="flex h-14 items-center justify-between border-b border-white/10 px-4 md:px-6">
					<div>
						<h2 className="text-lg font-semibold text-white">Settings</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-xl border border-white/20 bg-white/5 px-3 py-1 text-sm text-white/80"
					>
						Close
					</button>
				</div>

				<div className="flex h-[calc(92dvh-56px)] min-h-0 overflow-hidden">
					<aside className="hidden w-64 border-r border-white/10 bg-black/20 p-3 md:block">
						<div className="space-y-1">
							{sections.map((section) => (
								<button
									key={section.id}
									type="button"
									onClick={() => setActiveSection(section.id)}
									className={`w-full rounded-xl px-3 py-2 text-left transition ${
										activeSection === section.id
											? "bg-white/15 text-white"
											: "text-white/70 hover:bg-white/10"
									}`}
								>
									<p className="text-sm font-medium">{section.label}</p>
									<p className="text-xs text-white/55">{section.hint}</p>
								</button>
							))}
						</div>
					</aside>

					<div className="min-h-0 flex-1 overflow-hidden">
						<div className="h-full overflow-y-auto overflow-x-hidden p-3 md:p-5">
							<div className="md:hidden">
								{showSectionListMobile ? (
									<div className="space-y-2">
										{sections.map((section) => (
											<button
												key={section.id}
												type="button"
												onClick={() => {
													setActiveSection(section.id);
													setShowSectionListMobile(false);
												}}
												className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-left"
											>
												<p className="text-sm font-medium text-white">{section.label}</p>
												<p className="text-xs text-white/55">{section.hint}</p>
											</button>
										))}
									</div>
								) : (
									<div className="space-y-3">
										<button
											type="button"
											onClick={() => setShowSectionListMobile(true)}
											className="rounded-xl border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85"
										>
											← Back to sections
										</button>
										<div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03] p-3">
											{renderSection()}
										</div>
									</div>
								)}
							</div>

							<div className="hidden overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03] p-4 md:block">
								{renderSection()}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SettingsPanelModern;
