import { useEffect, useState, useCallback } from "react";
import "./app.css";
import { useScripture } from "./hooks/use-scripture";
import { useUnsplash } from "./hooks/use-unsplash";
import { useDevotional } from "./hooks/use-devotional";
import { Layout } from "./layout";
import ModeSelector from "./components/mode-selector";
import {
	LANGUAGE_BIBLE_IDS,
	DEFAULT_VOICE_ID,
	type ViewType,
	type ThemeType,
	type FontStyle,
	type BackgroundType,
} from "./enums";
import type { CustomBackground } from "./types";

interface BookmarkItem {
	id: string;
	url: string;
	title?: string;
}

interface HistoryItem {
	id?: string;
	url: string;
	title?: string;
}

type ModeType = "simple" | "work" | "full";

function App() {
	// Core state
	const [language, setLanguage] = useState(
		() => localStorage.getItem("tabspire_language") || "en",
	);
	const [currentView, setCurrentView] = useState<ViewType>("scripture");
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const stored = localStorage.getItem("tabspire_dark_mode");
		return stored === null ? true : stored === "true";
	});
	const [fontSize, setFontSize] = useState(
		() => {
			const stored = localStorage.getItem("tabspire_font_size");
			return stored ? Number.parseFloat(stored) : 1.4;
		}
	);
	const [fontStyle, setFontStyle] = useState<FontStyle>(
		() => (localStorage.getItem("tabspire_font_style") as FontStyle) || "serif",
	);
	const [theme, setTheme] = useState<ThemeType>(() => {
		const stored = localStorage.getItem("tabspire_theme");
		return stored === "minimal" || stored === "full" ? stored : "minimal";
	});
	const [elevenLabsVoiceId, setElevenLabsVoiceId] = useState(
		() => localStorage.getItem("tabspire_elevenlabs_voice_id") || DEFAULT_VOICE_ID,
	);
	const [mode, setMode] = useState<ModeType>(() => {
		const stored = localStorage.getItem("tabspire_mode");
		return stored === "work" || stored === "full" ? stored : "simple";
	});
	const [isOnboarded, setIsOnboarded] = useState(() => {
		return localStorage.getItem("tabspire_onboarded") === "true";
	});

	// Hooks
	const bibleId = LANGUAGE_BIBLE_IDS[language];
	const { scripture, isReady: scriptureReady, fetchScripture } = useScripture(bibleId);
	const { photo, isReady: photoReady, fetchPhoto } = useUnsplash();
	const {
		devotional,
		refetch: refetchDevotional,
	} = useDevotional();

	// UI state
	const [showHistoryPanel, setShowHistoryPanel] = useState(false);
	const [bookmarkLinks, setBookmarkLinks] = useState<BookmarkItem[]>([]);
	const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);
	const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
	const [selectedVoice, setSelectedVoice] = useState<string>(
		() => localStorage.getItem("tabspire_voice") || "",
	);
	const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
	const [showDateTime, setShowDateTime] = useState(() => {
		const stored = localStorage.getItem("tabspire_show_datetime");
		return stored === null ? true : stored === "true";
	});

	// Background state
	const getStoredBg = (): CustomBackground => {
		try {
			const raw = localStorage.getItem("tabspire_custom_bg");
			if (!raw) return { type: "", value: "" };
			return JSON.parse(raw);
		} catch {
			return { type: "", value: "" };
		}
	};
	const [customBackground, setCustomBackground] = useState<CustomBackground>(
		getStoredBg(),
	);

	// Handlers
	const handleRefresh = useCallback(() => {
		fetchScripture();
		fetchPhoto();
	}, [fetchScripture, fetchPhoto]);

	const toggleTheme = () => {
		setIsDarkMode((prev) => {
			const newValue = !prev;
			localStorage.setItem("tabspire_dark_mode", String(newValue));
			return newValue;
		});
	};

	const adjustFontSize = (delta: number) => {
		setFontSize((prev) => {
			const newSize = Math.max(0.6, Math.min(3, prev + delta));
			localStorage.setItem("tabspire_font_size", newSize.toString());
			return newSize;
		});
	};

	const handleLanguageChange = (lang: string) => {
		setLanguage(lang);
		localStorage.setItem("tabspire_language", lang);
		fetchScripture(undefined, LANGUAGE_BIBLE_IDS[lang]);
	};

	const handleFontStyleChange = (style: FontStyle) => {
		setFontStyle(style);
		localStorage.setItem("tabspire_font_style", style);
	};

	const handleThemeSelect = (selectedTheme: ThemeType) => {
		setTheme(selectedTheme);
		localStorage.setItem("tabspire_theme", selectedTheme);
	};

	const handleVoiceChange = (voiceURI: string) => {
		setSelectedVoice(voiceURI);
		localStorage.setItem("tabspire_voice", voiceURI);
	};

	const handleElevenLabsVoiceChange = (voiceId: string) => {
		setElevenLabsVoiceId(voiceId);
		localStorage.setItem("tabspire_elevenlabs_voice_id", voiceId);
	};

	const handleViewChange = (view: ViewType) => setCurrentView(view);

	const handleSetBackground = (bg: string, type: BackgroundType) => {
		const obj = { type, value: bg };
		setCustomBackground(obj);
		localStorage.setItem("tabspire_custom_bg", JSON.stringify(obj));
	};

	const handleResetBackground = () => {
		setCustomBackground({ type: "", value: "" });
		localStorage.removeItem("tabspire_custom_bg");
	};

	const handleUploadBackground = (file: File) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			if (e.target?.result) {
				handleSetBackground(e.target.result as string, "image");
			}
		};
		reader.readAsDataURL(file);
	};

	const handleShowDateTimeChange = (val: boolean) => {
		setShowDateTime(val);
		localStorage.setItem("tabspire_show_datetime", val ? "true" : "false");
	};

	const handleModeChange = (nextMode: ModeType) => {
		setMode(nextMode);
		localStorage.setItem("tabspire_mode", nextMode);
	};

	const handleOnboardingComplete = () => {
		const persistedMode = localStorage.getItem("tabspire_mode");
		if (persistedMode === "work" || persistedMode === "full") {
			setMode(persistedMode);
		} else {
			setMode("simple");
		}
		setIsOnboarded(true);
		localStorage.setItem("tabspire_onboarded", "true");
	};

	// Effects
	useEffect(() => {
		fetchScripture();
	}, [fetchScripture]);

	useEffect(() => {
		if (chrome.bookmarks?.getTree) {
			chrome.bookmarks.getTree((nodes) => {
				const flatten = (
					arr: chrome.bookmarks.BookmarkTreeNode[],
				): BookmarkItem[] =>
					arr.reduce(
						(acc: BookmarkItem[], node: chrome.bookmarks.BookmarkTreeNode) => {
							if (node.url)
								acc.push({ id: node.id, url: node.url, title: node.title });
							if (node.children) acc.push(...flatten(node.children));
							return acc;
						},
						[],
					);
				setBookmarkLinks(flatten(nodes).slice(0, 5));
			});
		}
	}, []);

	useEffect(() => {
		if (chrome.history?.search) {
			chrome.history.search({ text: "", maxResults: 10 }, (historyItems) => {
				const mappedHistory: HistoryItem[] = historyItems.map((item) => ({
					id: item.id,
					url: item.url || "",
					title: item.title,
				}));
				setRecentHistory(mappedHistory);
			});
		}
	}, []);

	useEffect(() => {
		const loadVoices = () => {
			const allVoices = window.speechSynthesis.getVoices();
			setVoices(allVoices);
			if (!selectedVoice && allVoices.length > 0) {
				setSelectedVoice(allVoices[0].voiceURI);
			}
		};
		loadVoices();
		window.speechSynthesis.onvoiceschanged = loadVoices;
	}, [selectedVoice]);

	useEffect(() => {
		if (currentView === "goals" && mode !== "full") {
			setCurrentView("scripture");
		}
	}, [currentView, mode]);

	// Show main UI when either scripture or photo is ready (cached or loaded)
	const isReady = scriptureReady || photoReady;

	return (
		<div
			className={`app ${isDarkMode ? "dark-mode" : "light-mode"}`}
			style={
				{
					backgroundColor:
						customBackground.type === "color"
							? customBackground.value
							: undefined,
					backgroundImage:
						customBackground.type === "gradient"
							? customBackground.value
							: customBackground.type === "image"
								? `url(${customBackground.value})`
								: photo
									? `url(${photo.urls.regular})`
									: undefined,
					"--font-size": `${fontSize}rem`,
				} as React.CSSProperties
			}
		>
			{!isOnboarded && <ModeSelector onComplete={handleOnboardingComplete} />}
			<Layout
				// Core state
				language={language}
				currentView={currentView}
				isDarkMode={isDarkMode}
				fontSize={fontSize}
				fontStyle={fontStyle}
				theme={theme}
				elevenLabsVoiceId={elevenLabsVoiceId}
				bibleId={bibleId}
				
				// Data
				scripture={scripture}
				photo={photo}
				devotional={devotional}
				customBackground={customBackground}
				
				// UI state
				showHistoryPanel={showHistoryPanel}
				bookmarkLinks={bookmarkLinks}
				recentHistory={recentHistory}
				voices={voices}
				selectedVoice={selectedVoice}
				settingsPanelOpen={settingsPanelOpen}
				showDateTime={showDateTime}
				mode={mode}
				
				// Handlers
				onRefresh={handleRefresh}
				onToggleTheme={toggleTheme}
				onFontSizeChange={adjustFontSize}
				onLanguageChange={handleLanguageChange}
				onFontStyleChange={handleFontStyleChange}
				onThemeSelect={handleThemeSelect}
				onVoiceChange={handleVoiceChange}
				onElevenLabsVoiceChange={handleElevenLabsVoiceChange}
				onViewChange={handleViewChange}
				onSetBackground={handleSetBackground}
				onResetBackground={handleResetBackground}
				onUploadBackground={handleUploadBackground}
				onShowDateTimeChange={handleShowDateTimeChange}
				onModeChange={handleModeChange}
				onToggleHistoryPanel={() => setShowHistoryPanel((v) => !v)}
				onRefreshDevotional={refetchDevotional}
				onSettingsToggle={() => setSettingsPanelOpen((v) => !v)}
				isDataLoading={!isReady}
			/>
		</div>
	);
}

export default App;
