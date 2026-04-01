import { useState } from "react";
import Header from "./header";
import Content from "./content";
import Footer from "./footer";
import Controls from "../components/controls";
import SettingsPanel from "../components/settings-panel-modern";
import HistoryPanel from "../components/history-panel";
import ThemeSelectModal from "../components/theme-select-modal";
import icon from "../icon.svg";
import { useAudio } from "../hooks/use-audio";
import type { ViewType, ThemeType, FontStyle, BackgroundType } from "../enums";
import type {
	Scripture,
	Devotional,
	UnsplashPhoto,
	CustomBackground,
} from "../types";

type ModeType = "simple" | "work" | "full";

interface LayoutProps {
	// Core state
	language: string;
	currentView: ViewType;
	isDarkMode: boolean;
	fontSize: number;
	fontStyle: FontStyle;
	theme: ThemeType;
	elevenLabsVoiceId: string;
	bibleId: string;

	// Data
	scripture: Scripture | null;
	photo: UnsplashPhoto | null;
	devotional: Devotional | null;
	customBackground: CustomBackground;

	// UI state
	showHistoryPanel: boolean;
	bookmarkLinks: Array<{ id: string; url: string; title?: string }>;
	recentHistory: Array<{ id?: string; url: string; title?: string }>;
	voices: SpeechSynthesisVoice[];
	selectedVoice: string;
	settingsPanelOpen: boolean;
	showDateTime: boolean;
	mode: ModeType;

	// Handlers
	onRefresh: () => void;
	onToggleTheme: () => void;
	onFontSizeChange: (delta: number) => void;
	onLanguageChange: (lang: string) => void;
	onFontStyleChange: (style: FontStyle) => void;
	onThemeSelect: (theme: ThemeType) => void;
	onVoiceChange: (voiceURI: string) => void;
	onElevenLabsVoiceChange: (voiceId: string) => void;
	onViewChange: (view: ViewType) => void;
	onSetBackground: (bg: string, type: BackgroundType) => void;
	onResetBackground: () => void;
	onUploadBackground: (file: File) => void;
	onShowDateTimeChange: (val: boolean) => void;
	onModeChange: (mode: ModeType) => void;
	onToggleHistoryPanel: () => void;
	onRefreshDevotional: () => void;
	onSettingsToggle: () => void;
	isDataLoading?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
	// Core state
	language,
	currentView,
	isDarkMode,
	fontSize,
	fontStyle,
	theme,
	elevenLabsVoiceId,
	bibleId,

	// Data
	scripture,
	photo,
	devotional,
	customBackground,

	// UI state
	showHistoryPanel,
	bookmarkLinks,
	recentHistory,
	voices,
	selectedVoice,
	settingsPanelOpen,
	showDateTime,
	mode,

	// Handlers
	onRefresh,
	onToggleTheme,
	onFontSizeChange,
	onLanguageChange,
	onFontStyleChange,
	onThemeSelect,
	onVoiceChange,
	onElevenLabsVoiceChange,
	onViewChange,
	onSetBackground,
	onResetBackground,
	onUploadBackground,
	onShowDateTimeChange,
	onModeChange,
	onToggleHistoryPanel,
	onRefreshDevotional,
	onSettingsToggle,
	isDataLoading = false,
}) => {
	const [showThemeModal, setShowThemeModal] = useState(false);
	
	// Initialize audio hook with ElevenLabs API key from environment
	const elevenLabsApiKey = process.env.REACT_APP_ELEVENLABS_API_KEY || '';
	const { isPlaying, isLoading, error, playText, stopAudio, clearError } = useAudio({
		elevenLabsApiKey,
		elevenLabsVoiceId
	});

	const shareText = scripture
		? `${scripture.text} - ${scripture.reference}`
		: "";

	const handleThemeSelect = (selectedTheme: ThemeType) => {
		onThemeSelect(selectedTheme);
		setShowThemeModal(false);
	};

	const handleAudioPlay = async () => {
		if (isPlaying) {
			// Stop audio
			stopAudio();
			return;
		}

		// Get the text to convert to speech
		const textToSpeak = currentView === 'scripture' && scripture
			? `${scripture.text}. ${scripture.reference}`
			: currentView === 'devotional' && devotional
			? `${devotional.title}. ${devotional.content}`
			: '';

		if (!textToSpeak) {
			alert('No content available to convert to speech.');
			return;
		}

		// Play the text using the audio hook
		await playText(textToSpeak);
	};

	return (
		<>
			{/* Logo */}
			<img
				src={icon}
				alt="Tabspire Logo"
				style={{
					position: "fixed",
					top: 16,
					left: 16,
					width: 56,
					height: 56,
					zIndex: 100,
					borderRadius: 16,
					boxShadow: "0 2px 8px #0002",
					padding: 6,
					background: "rgba(255,255,255,0.7)",
				}}
			/>

			{/* Header */}
			<Header theme={theme} onThemeSelect={() => setShowThemeModal(true)} />

			{/* Theme Selection Modal */}
			{showThemeModal && <ThemeSelectModal onSelect={handleThemeSelect} />}

			{/* Settings Panel */}
			<SettingsPanel
				open={settingsPanelOpen}
				onClose={onSettingsToggle}
				language={language}
				onLanguageChange={onLanguageChange}
				fontStyle={fontStyle}
				onFontStyleChange={onFontStyleChange}
				voices={voices}
				selectedVoice={selectedVoice}
				onVoiceChange={onVoiceChange}
				theme={theme}
				onThemeChange={onThemeSelect}
				customBackground={customBackground}
				onSetBackground={onSetBackground}
				onResetBackground={onResetBackground}
				onUploadBackground={onUploadBackground}
				showDateTime={showDateTime}
				onShowDateTimeChange={onShowDateTimeChange}
				mode={mode}
				onModeChange={onModeChange}
				elevenLabsVoiceId={elevenLabsVoiceId}
				onElevenLabsVoiceChange={onElevenLabsVoiceChange}
			/>

			{/* Controls */}
			<Controls
				onRefresh={onRefresh}
				onToggleTheme={onToggleTheme}
				isDarkMode={isDarkMode}
				onFontSizeChange={onFontSizeChange}
				shareText={shareText}
				onLanguageChange={onLanguageChange}
				language={language}
				fontStyle={fontStyle}
				onFontStyleChange={onFontStyleChange}
				onToggleHistoryPanel={onToggleHistoryPanel}
				showHistoryPanel={showHistoryPanel}
				theme={theme}
				mode={mode}
				onRefreshDevotional={onRefreshDevotional}
				currentView={currentView}
				onOpenGoals={() => onViewChange(currentView === "goals" ? "scripture" : "goals")}
				settingsButton={
					<button
						type="button"
						className="control-button"
						title="Settings"
						onClick={onSettingsToggle}
						style={{ fontSize: 18 }}
					>
						<span role="img" aria-label="Settings">
							⚙️
						</span>
					</button>
				}
			/>

			{/* History Panel */}
			<HistoryPanel
				recentHistory={recentHistory}
				visible={theme === "full" && mode !== "simple" && showHistoryPanel}
			/>

			{/* Error Display */}
			{error && (
				<div style={{
					position: 'fixed',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					background: 'rgba(220, 38, 38, 0.9)',
					color: 'white',
					padding: '16px 24px',
					borderRadius: '8px',
					zIndex: 1000,
					display: 'flex',
					alignItems: 'center',
					gap: '12px',
					boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
				}}>
					<span>⚠️</span>
					<span>{error}</span>
					<button
						type="button"
						onClick={clearError}
						style={{
							background: 'none',
							border: 'none',
							color: 'white',
							cursor: 'pointer',
							fontSize: '18px',
							marginLeft: '8px'
						}}
					>
						✕
					</button>
				</div>
			)}

			{/* Main Content */}
			<Content
				mode={mode}
				scripture={scripture}
				devotional={devotional}
				fontStyle={fontStyle}
				fontSize={fontSize}
				isDarkMode={isDarkMode}
				currentView={currentView}
				onViewChange={onViewChange}
				onPlay={handleAudioPlay}
				isPlaying={isPlaying}
				disabled={isLoading}
				elevenLabsVoiceId={elevenLabsVoiceId}
				bibleId={bibleId}
				theme={theme}
				bookmarkLinks={bookmarkLinks}
				isDataLoading={isDataLoading}
				onRefresh={onRefresh}
			/>

			{/* Footer Components */}
			<Footer photo={photo} />
		</>
	);
};

export default Layout;
