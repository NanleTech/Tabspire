import { useState, useEffect } from "react";
import {
	BUILTIN_BACKGROUNDS,
	SAMPLE_VERSE,
	type ThemeType,
	type FontStyle,
} from "../enums";

interface SettingsPanelPropsUpdated {
	open: boolean;
	onClose: () => void;
	mode: "simple" | "work" | "full";
	onModeChange: (mode: "simple" | "work" | "full") => void;
	language: string;
	onLanguageChange: (lang: string) => void;
	fontStyle: FontStyle;
	onFontStyleChange: (style: FontStyle) => void;
	voices: SpeechSynthesisVoice[];
	selectedVoice: string;
	onVoiceChange: (voiceURI: string) => void;
	theme: ThemeType;
	onThemeChange: (theme: ThemeType) => void;
	customBackground: {
		type: "color" | "gradient" | "image" | "";
		value: string;
	};
	onSetBackground: (
		bg: string,
		type: "color" | "gradient" | "image" | "",
	) => void;
	onResetBackground: () => void;
	onUploadBackground: (file: File) => void;
	showDateTime: boolean;
	onShowDateTimeChange: (val: boolean) => void;
	elevenLabsVoiceId?: string;
	onElevenLabsVoiceChange?: (voiceId: string) => void;
}

interface ElevenLabsVoice {
	voice_id: string;
	name: string;
	labels?: {
		accent?: string;
	};
}

const SettingsPanel: React.FC<SettingsPanelPropsUpdated> = ({
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
	elevenLabsVoiceId,
	onElevenLabsVoiceChange,
}) => {
	const [previewVoice, setPreviewVoice] = useState<string>(selectedVoice);
	const [elevenLabsVoices, setElevenLabsVoices] = useState<ElevenLabsVoice[]>(
		[],
	);
	const [elevenLabsLoading, setElevenLabsLoading] = useState(false);
	const [elevenLabsError, setElevenLabsError] = useState<string | null>(null);

	useEffect(() => {
		if (!open) return;
		const fetchVoices = async () => {
			setElevenLabsLoading(true);
			setElevenLabsError(null);
			try {
				const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
				const resp = await fetch(`${apiBaseUrl}/api/elevenlabs/voices`);
				if (!resp.ok) throw new Error("Failed to fetch voices");
				const data = await resp.json();
				setElevenLabsVoices(data.voices || []);
			} catch (error) {
				setElevenLabsError("Could not load ElevenLabs voices.");
			}
			setElevenLabsLoading(false);
		};
		fetchVoices();
	}, [open]);

	const handleVoicePreview = () => {
		const utterance = new window.SpeechSynthesisUtterance(
			`${SAMPLE_VERSE.text} - ${SAMPLE_VERSE.reference}`,
		);
		const voice = voices.find((v) => v.voiceURI === previewVoice);
		if (voice) utterance.voice = voice;
		utterance.lang = voice?.lang || "en";
		window.speechSynthesis.speak(utterance);
	};

	if (!open) return null;

	const modeCards: Array<{
		id: "simple" | "work" | "full";
		name: string;
		accent: string;
		description: string;
		chips: string[];
	}> = [
		{
			id: "simple",
			name: "Simple",
			accent: "#A78BFA",
			description: "Scripture, beauty, peace. Nothing more.",
			chips: ["Verse", "Devotional", "Mood", "Faith goals"],
		},
		{
			id: "work",
			name: "Work",
			accent: "#64C88C",
			description: "Tasks, wisdom & daily anchor.",
			chips: ["Simple +", "Tasks", "Wisdom", "EOD"],
		},
		{
			id: "full",
			name: "Full",
			accent: "#60A5FA",
			description: "Everything — goals, KPIs, insights.",
			chips: ["Work +", "Goals", "KPIs", "Weekly AI"],
		},
	];

	const featureMatrix: Array<{
		name: string;
		minMode: "simple" | "work" | "full";
	}> = [
		{ name: "Bible verse", minMode: "simple" },
		{ name: "Daily devotional", minMode: "simple" },
		{ name: "Mood check-in", minMode: "simple" },
		{ name: "Faith goals", minMode: "simple" },
		{ name: "Kokoro TTS", minMode: "simple" },
		{ name: "Guided meditation", minMode: "simple" },
		{ name: "Verse journal", minMode: "simple" },
		{ name: "Task planner", minMode: "work" },
		{ name: "Wisdom chips", minMode: "work" },
		{ name: "Integrity nudge", minMode: "work" },
		{ name: "Rest reminder", minMode: "work" },
		{ name: "Goal dashboard", minMode: "full" },
		{ name: "KPI tracking", minMode: "full" },
		{ name: "Weekly AI insights", minMode: "full" },
	];

	const modeRank: Record<"simple" | "work" | "full", number> = {
		simple: 1,
		work: 2,
		full: 3,
	};

	const isFeatureActive = (minMode: "simple" | "work" | "full") => {
		return modeRank[minMode] <= modeRank[mode];
	};

	const activeCard = modeCards.find((card) => card.id === mode) || modeCards[0];

	return (
		<div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div className="bg-[#070b14] rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto border border-[#1d2635]">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-[#1d2635] bg-transparent rounded-t-3xl">
					<h2 className="text-2xl font-bold text-white">Settings</h2>
					<button
						type="button"
						onClick={onClose}
						className="w-10 h-10 rounded-full bg-transparent hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors"
						title="Close"
						aria-label="Close"
					>
						<span className="text-xl font-bold">×</span>
					</button>
				</div>

				{/* Content */}
				<div className="p-6 space-y-8">
					{/* Mode Selector Section */}
					<section className="bg-transparent rounded-2xl p-6 border border-[#1d2635] shadow-sm">
						<div className="mb-6">
							<h3 className="text-sm font-semibold text-gray-400 tracking-[0.14em] uppercase mb-3">Experience Mode</h3>
							<p className="text-gray-400 leading-relaxed text-sm">
								Choose your Tabspire depth. This changes visible features immediately.
							</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
							{modeCards.map((card) => {
								const selected = mode === card.id;
								return (
									<button
										key={card.id}
										type="button"
										onClick={() => onModeChange(card.id)}
										className={`text-left rounded-2xl border p-5 transition-all ${selected ? "shadow-md" : "border-white/10 hover:border-white/20"}`}
										style={{
											borderColor: selected ? card.accent : undefined,
											backgroundColor: selected ? `${card.accent}12` : "rgba(255,255,255,0.02)",
										}}
									>
										<div className="flex items-center justify-between mb-2">
											<span className="font-semibold text-white text-2xl">{card.name}</span>
											{selected && (
												<span className="text-white text-xs px-2 py-1 rounded-full" style={{ backgroundColor: card.accent }}>
													Active
												</span>
											)}
										</div>
										<p className="text-base text-gray-400 mb-1">{card.description}</p>
									</button>
								);
							})}
						</div>

						<div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
							<p className="text-xs font-semibold tracking-[0.1em] uppercase mb-3" style={{ color: activeCard.accent }}>
								What’s active in {mode} mode
							</p>
							<div className="flex flex-wrap gap-2">
								{featureMatrix.map((feature) => {
									const active = isFeatureActive(feature.minMode);
									return (
										<span
											key={feature.name}
											className="px-3 py-1 rounded-full text-sm border"
											style={{
												borderColor: active ? `${activeCard.accent}70` : "rgba(255,255,255,0.12)",
												backgroundColor: active ? `${activeCard.accent}20` : "rgba(255,255,255,0.04)",
												color: active ? activeCard.accent : "#808795",
											}}
										>
											{feature.name}
										</span>
									);
								})}
							</div>
						</div>
					</section>

					{/* Background Section */}
					<section className="bg-white/[0.02] rounded-2xl p-6 border border-white/10 shadow-sm">
						<div className="mb-6">
							<h3 className="text-base font-semibold text-white mb-2">Appearance</h3>
							<p className="text-gray-400 leading-relaxed text-sm">
								Choose a background, upload your own, or use a random Unsplash image.
							</p>
						</div>
						
						<div className="grid grid-cols-8 gap-3 mb-6">
							{/* Built-in backgrounds */}
							{BUILTIN_BACKGROUNDS.map((bg) => (
								<button
									key={`${bg.type}-${bg.value}`}
									type="button"
									onClick={() => onSetBackground(bg.value, bg.type)}
									className={`w-14 h-14 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg ${
										customBackground.value === bg.value && customBackground.type === bg.type
											? "border-blue-500 ring-4 ring-blue-200 shadow-lg"
											: "border-gray-300 hover:border-gray-400"
									}`}
									style={{
										background: bg.type === "color" || bg.type === "gradient" ? bg.value : undefined,
										backgroundImage: bg.type === "image" ? `url(${bg.value})` : undefined,
										backgroundSize: "cover",
										backgroundPosition: "center",
									}}
									title={bg.type === "image" ? "Sample Image" : bg.value}
								/>
							))}
							
							{/* Upload button */}
							<label className="w-14 h-14 rounded-xl border-2 border-dashed border-blue-400/70 bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center cursor-pointer transition-all hover:scale-105 group">
								<input
									type="file"
									accept="image/*"
									className="hidden"
									onChange={(e) => {
										if (e.target.files?.[0]) {
											const file = e.target.files[0];
											const reader = new FileReader();
											reader.onload = (ev) => {
												if (ev.target?.result) {
													onSetBackground(ev.target.result as string, "image");
												}
											};
											reader.readAsDataURL(file);
										}
									}}
								/>
								<span className="text-blue-300 text-2xl font-bold group-hover:text-blue-200">+</span>
							</label>
							
							{/* Random/Unsplash */}
							<button
								type="button"
								onClick={onResetBackground}
								className={`w-14 h-14 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg ${
									!customBackground.value
										? "border-blue-400 ring-2 ring-blue-400/30 shadow-lg"
										: "border-gray-300 hover:border-gray-400"
								} bg-gradient-to-br from-gray-800 to-blue-500 text-white font-bold text-xl flex items-center justify-center`}
								title="Random/Unsplash"
							>
								?
							</button>
						</div>
						
						{customBackground.value && (
							<div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500/15 text-blue-300 rounded-lg text-sm font-medium border border-blue-400/30">
								<span className="w-2 h-2 bg-blue-500 rounded-full" />
								Custom background selected
							</div>
						)}
					</section>

					{/* Language Section */}
					<section className="bg-white/[0.02] rounded-2xl p-6 border border-white/10 shadow-sm">
						<div className="mb-6">
							<h3 className="text-base font-semibold text-white mb-2">Language</h3>
							<p className="text-gray-400 leading-relaxed text-sm">
								Choose the language for Bible verses and audio (if available).
							</p>
						</div>
						<div className="relative">
							<select 
								value={language} 
								onChange={(e) => onLanguageChange(e.target.value)}
								className="w-full max-w-md px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-gray-100 font-medium focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition-all duration-200 appearance-none cursor-pointer hover:bg-white/10"
							>
								<option value="en">🇺🇸 English</option>
								<option value="es">🇪🇸 Spanish</option>
								<option value="hat">🇭🇹 Haitian Creole</option>
								<option value="hau">🇳🇬 Hausa</option>
								<option value="hbo">🇮🇱 Hebrew (Ancient)</option>
								<option value="heb">🇮🇱 Hebrew (Modern)</option>
								<option value="hi">🇮🇳 Hindi</option>
								<option value="hrv">🇭🇷 Croatian</option>
								<option value="hun">🇭🇺 Hungarian</option>
								<option value="ibo">🇳🇬 Igbo</option>
								<option value="ind">🇮🇩 Indonesian</option>
								<option value="isl">🇮🇸 Icelandic</option>
								<option value="ita">🇮🇹 Italian</option>
								<option value="pol">🇵🇱 Polish</option>
								<option value="por">🇵🇹 Portuguese</option>
								<option value="swh">🇹🇿 Swahili</option>
								<option value="vie">🇻🇳 Vietnamese</option>
								<option value="yor">🇳🇬 Yoruba</option>
								<option value="ukr">🇺🇦 Ukrainian</option>
								<option value="lug">🇺🇬 Luganda</option>
								<option value="lin">🇨🇩 Lingala</option>
								<option value="nya">🇲🇼 Chichewa</option>
								<option value="nob">🇳🇴 Norwegian</option>
								<option value="sna">🇿🇼 Shona</option>
								<option value="twi">🇬🇭 Twi</option>
							</select>
							<div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
								<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							</div>
						</div>
					</section>

					{/* Font Style Section */}
					<section className="bg-white/[0.02] rounded-2xl p-6 border border-white/10 shadow-sm">
						<div className="mb-6">
							<h3 className="text-base font-semibold text-white mb-2">Font Style</h3>
							<p className="text-gray-400 leading-relaxed text-sm">
								Change the font used for displaying verses.
							</p>
						</div>
						<div className="relative mb-6">
							<select 
								value={fontStyle} 
								onChange={(e) => onFontStyleChange(e.target.value as FontStyle)}
								className="w-full max-w-md px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-gray-100 font-medium focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition-all duration-200 appearance-none cursor-pointer hover:bg-white/10"
							>
								<option value="serif">📝 Serif</option>
								<option value="sans-serif">📄 Sans Serif</option>
								<option value="monospace">⌨️ Monospace</option>
								<option value="cursive">✍️ Cursive</option>
							</select>
							<div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
								<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							</div>
						</div>
						<div 
							className="p-6 bg-white/[0.03] rounded-xl border border-white/10 text-lg text-gray-100 shadow-inner"
							style={{ fontFamily: fontStyle }}
						>
							<div className="text-sm text-gray-400 mb-2 font-medium">Preview:</div>
							{SAMPLE_VERSE.text}
						</div>
					</section>

					{/* Voice Section */}
					<section className="bg-white/[0.02] rounded-2xl p-6 border border-white/10 shadow-sm">
						<div className="mb-6">
							<h3 className="text-base font-semibold text-white mb-2">Voice for AI Reading</h3>
							<p className="text-gray-400 leading-relaxed text-sm">
								Select a voice for text-to-speech.{" "}
								<button 
									type="button"
									className="text-blue-300 hover:text-blue-200 underline font-medium transition-colors hover:bg-blue-500/10 px-2 py-1 rounded"
									onClick={handleVoicePreview}
								>
									🔊 Preview
								</button>
							</p>
						</div>
						<div className="relative">
							<select 
								value={selectedVoice} 
								onChange={(e) => { onVoiceChange(e.target.value); setPreviewVoice(e.target.value); }}
								className="w-full max-w-md px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-gray-100 font-medium focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition-all duration-200 appearance-none cursor-pointer hover:bg-white/10"
							>
								{voices.map((voice) => (
									<option key={voice.voiceURI} value={voice.voiceURI}>
										🎤 {voice.name} ({voice.lang})
									</option>
								))}
							</select>
							<div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
								<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							</div>
						</div>
					</section>

					{/* Theme Section */}
					<section className="bg-white/[0.02] rounded-2xl p-6 border border-white/10 shadow-sm">
						<div className="mb-6">
							<h3 className="text-base font-semibold text-white mb-2">Theme</h3>
							<p className="text-gray-400 leading-relaxed text-sm">
								Switch between minimal and full-featured layouts.
							</p>
						</div>
						<div className="relative">
							<select 
								value={theme} 
								onChange={(e) => onThemeChange(e.target.value as ThemeType)}
								className="w-full max-w-md px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-gray-100 font-medium focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition-all duration-200 appearance-none cursor-pointer hover:bg-white/10"
							>
								<option value="minimal">🎯 Minimal</option>
								<option value="full">🌟 Full</option>
							</select>
							<div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
								<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							</div>
						</div>
					</section>

					{/* Date & Time Section */}
					<section className="bg-white/[0.02] rounded-2xl p-6 border border-white/10 shadow-sm">
						<div className="mb-6">
							<h3 className="text-base font-semibold text-white mb-2">Date & Time</h3>
							<p className="text-gray-400 leading-relaxed text-sm">
								Show or hide the current date and time on the main screen.
							</p>
						</div>
						<label className="flex items-center gap-4 cursor-pointer group">
							<div className="relative">
								<input
									type="checkbox"
									checked={showDateTime}
									onChange={(e) => onShowDateTimeChange(e.target.checked)}
									className="w-6 h-6 text-blue-400 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400/40 focus:ring-offset-0 transition-all duration-200 cursor-pointer"
								/>
							</div>
							<div className="flex flex-col">
								<span className="text-gray-100 font-medium">Show date & time</span>
								<span className="text-sm text-gray-400">Display current date and time on the main screen</span>
							</div>
						</label>
					</section>

					{/* ElevenLabs Voice Section */}
					<section className="bg-white/[0.02] rounded-2xl p-6 border border-white/10 shadow-sm">
						<div className="mb-6">
							<h3 className="text-base font-semibold text-white mb-2">ElevenLabs Voice</h3>
							<p className="text-gray-400 leading-relaxed text-sm">
								Select a voice for ElevenLabs TTS.
							</p>
						</div>
						{elevenLabsLoading ? (
							<div className="flex items-center gap-3 text-blue-300 font-medium">
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
								Loading voices...
							</div>
						) : elevenLabsError ? (
							<div className="flex items-center gap-3 text-red-300 font-medium">
								<span className="text-xl">⚠️</span>
								{elevenLabsError}
							</div>
						) : (
							<div className="relative">
								<select
									value={elevenLabsVoiceId || ""}
									onChange={(e) => onElevenLabsVoiceChange?.(e.target.value)}
									className="w-full max-w-md px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-gray-100 font-medium focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition-all duration-200 appearance-none cursor-pointer hover:bg-white/10"
								>
									<option value="">🎵 Default Voice</option>
									{elevenLabsVoices.map((voice: ElevenLabsVoice) => (
										<option key={voice.voice_id} value={voice.voice_id}>
											🎭 {voice.name} ({voice.labels?.accent || "N/A"})
										</option>
									))}
								</select>
								<div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
									<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
									</svg>
								</div>
							</div>
						)}
					</section>

					{(mode === "work" || mode === "full") && (
						<section className="bg-white/[0.02] rounded-2xl p-6 border border-white/10 shadow-sm">
							<div className="mb-2">
								<h3 className="text-base font-semibold text-white">Work Mode Settings</h3>
							</div>
							<p className="text-gray-400 leading-relaxed text-sm">
								Work mode features are enabled for this profile. Task planner and work nudges appear in Work/Full.
							</p>
						</section>
					)}

					{mode === "full" && (
						<section className="bg-white/[0.02] rounded-2xl p-6 border border-blue-400/30 shadow-sm">
							<div className="mb-2">
								<h3 className="text-base font-semibold text-white">Goals & KPIs</h3>
							</div>
							<p className="text-gray-400 leading-relaxed text-sm mb-4">
								Full mode unlocks goal dashboard and KPI tracking views.
							</p>
							<div className="rounded-xl bg-blue-500/10 p-4 border border-blue-400/30">
								<p className="font-semibold text-blue-300 mb-1">Pro Upgrade</p>
								<p className="text-sm text-blue-200/90">
									Visible in Full mode only. Upgrade prompts appear when limits are reached.
								</p>
							</div>
						</section>
					)}
				</div>
			</div>
		</div>
	);
};

export default SettingsPanel;
