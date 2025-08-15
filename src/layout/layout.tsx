import { useState } from "react";
import Header from "./header";
import Content from "./content";
import Footer from "./footer";
import Controls from "../components/controls";
import SettingsPanel from "../components/SettingsPanel";
import HistoryPanel from "../components/HistoryPanel";
import ThemeSelectModal from "../components/ThemeSelectModal";
import icon from "../icon.svg";
import type { ViewType, ThemeType, FontStyle, BackgroundType } from "../enums";
import type {
	Scripture,
	Devotional,
	UnsplashPhoto,
	CustomBackground,
} from "../types";

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
	onToggleHistoryPanel: () => void;
	onRefreshDevotional: () => void;
	onSettingsToggle: () => void;
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
	onToggleHistoryPanel,
	onRefreshDevotional,
	onSettingsToggle,
}) => {
	const [showThemeModal, setShowThemeModal] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [audioDisabled, setAudioDisabled] = useState(false);

	const shareText = scripture
		? `${scripture.text} - ${scripture.reference}`
		: "";

	const handleThemeSelect = (selectedTheme: ThemeType) => {
		onThemeSelect(selectedTheme);
		setShowThemeModal(false);
	};

	const handleAudioPlay = async () => {
		console.log('Audio button clicked!');
		console.log('Current elevenLabsVoiceId:', elevenLabsVoiceId);
		console.log('Current view:', currentView);
		console.log('Scripture:', scripture);
		console.log('Devotional:', devotional);

		if (!elevenLabsVoiceId || elevenLabsVoiceId.trim() === "") {
			alert('Please configure an ElevenLabs voice in settings first.');
			return;
		}

		if (isPlaying) {
			// Stop audio
			console.log('Stopping audio...');
			setIsPlaying(false);
			return;
		}

		try {
			setAudioDisabled(true);
			setIsPlaying(true);

			// Get the text to convert to speech
			const textToSpeak = currentView === 'scripture' && scripture
				? `${scripture.text}. ${scripture.reference}`
				: currentView === 'devotional' && devotional
				? `${devotional.title}. ${devotional.content}`
				: '';

			if (!textToSpeak) {
				alert('No content available to convert to speech.');
				setIsPlaying(false);
				setAudioDisabled(false);
				return;
			}

			// Here you would integrate with ElevenLabs API
			// For now, we'll simulate the audio functionality
			console.log('Converting to speech:', textToSpeak);
			console.log('Using voice ID:', elevenLabsVoiceId);

			// Simulate audio duration
			setTimeout(() => {
				console.log('Audio simulation finished');
				setIsPlaying(false);
				setAudioDisabled(false);
			}, 5000); // 5 seconds simulation

		} catch (error) {
			console.error('Audio playback error:', error);
			alert('Error playing audio. Please try again.');
			setIsPlaying(false);
			setAudioDisabled(false);
		}
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
				onRefreshDevotional={onRefreshDevotional}
				currentView={currentView}
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
				visible={theme === "full" && showHistoryPanel}
			/>

			{/* Main Content */}
			<Content
				scripture={scripture}
				devotional={devotional}
				fontStyle={fontStyle}
				fontSize={fontSize}
				isDarkMode={isDarkMode}
				currentView={currentView}
				onViewChange={onViewChange}
				onPlay={handleAudioPlay}
				isPlaying={isPlaying}
				disabled={audioDisabled}
				elevenLabsVoiceId={elevenLabsVoiceId}
				bibleId={bibleId}
				theme={theme}
				bookmarkLinks={bookmarkLinks}
			/>

			{/* Footer Components */}
			<Footer photo={photo} />
		</>
	);
};

export default Layout;
