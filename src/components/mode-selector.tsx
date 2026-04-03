import { useMemo, useState } from "react";
import { usePersistedState } from "../hooks/use-persisted-state";

type ModeType = "simple" | "work" | "full";

interface ModeOption {
	id: ModeType;
	name: string;
	accentColor: string;
	description: string;
	features: string[];
}

const MODE_ICON: Record<ModeType, string> = {
	simple: "✨",
	work: "💼",
	full: "🚀",
};

const MODES: ModeOption[] = [
	{
		id: "simple",
		name: "Simple",
		accentColor: "#A78BFA",
		description: "For spiritual seekers who want calm daily scripture",
		features: [
			"Bible verse",
			"Devotional",
			"Mood check-in",
			"Goals",
			"Kokoro TTS",
			"Guided meditation",
			"Journal",
		],
	},
	{
		id: "work",
		name: "Work",
		accentColor: "#64C88C",
		description: "For professionals with structured working days",
		features: [
			"All Simple features",
			"Task planner",
			"Wisdom chips",
			"Integrity nudge",
			"Rest reminder",
			"Work anchor verse",
			"EOD reflection",
		],
	},
	{
		id: "full",
		name: "Full",
		accentColor: "#60A5FA",
		description: "For power users who want complete control",
		features: [
			"All Work features",
			"Goal dashboard",
			"KPI tracking",
			"Weekly AI insights",
			"Goal-verse integration",
			"Advanced analytics",
		],
	},
];

interface ModeSelectorProps {
	onComplete: () => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ onComplete }) => {
	const [selectedMode, setSelectedMode] = useState<ModeType>("simple");
	const [, setPersistedMode] = usePersistedState<ModeType>("tabspire_mode", "simple");
	const selectedModeConfig = useMemo(
		() => MODES.find((mode) => mode.id === selectedMode) ?? MODES[0],
		[selectedMode],
	);

	const handleContinue = () => {
		setPersistedMode(selectedMode);
		onComplete();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden bg-black/80 p-3 backdrop-blur-sm md:p-4">
			<div className="max-h-[92dvh] w-full max-w-4xl overflow-y-auto overflow-x-hidden rounded-3xl bg-white shadow-2xl">
				<div className="p-4 sm:p-6 md:p-8">
					<h1 className="mb-2 text-center text-2xl font-bold text-gray-900 md:text-3xl">
						Welcome to Tabspire
					</h1>
					<p className="mb-6 text-center text-base text-gray-600 md:mb-8 md:text-lg">
						Choose how you want to experience your daily inspiration
					</p>

					<div className="mb-6 grid grid-cols-1 gap-3 md:mb-8 md:grid-cols-3 md:gap-4">
						{MODES.map((mode) => (
							<button
								key={mode.id}
								type="button"
								onClick={() => setSelectedMode(mode.id)}
								className={`relative rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:scale-[1.02] md:p-6 ${
									selectedMode === mode.id
										? "border-current shadow-lg"
										: "border-gray-200 hover:border-gray-300"
								}`}
								style={{
									borderColor: selectedMode === mode.id ? mode.accentColor : undefined,
									backgroundColor: selectedMode === mode.id ? `${mode.accentColor}10` : undefined,
								}}
							>
								{selectedMode === mode.id && (
									<div
										className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold"
										style={{ backgroundColor: mode.accentColor }}
									>
										✓
									</div>
								)}

								<div
									className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-xl text-white md:mb-4 md:h-12 md:w-12 md:text-2xl"
									style={{ backgroundColor: mode.accentColor }}
								>
									{MODE_ICON[mode.id]}
								</div>

								<h3 className="mb-2 text-lg font-bold text-gray-900 md:text-xl">{mode.name}</h3>
								<p className="mb-3 text-sm text-gray-600 md:mb-4">{mode.description}</p>

								<div className="space-y-1">
									<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
										Features
									</p>
									<ul className="text-xs text-gray-600 space-y-1">
										{mode.features.slice(0, 4).map((feature) => (
											<li key={`${mode.id}-${feature}`} className="flex items-center gap-1">
												<span style={{ color: mode.accentColor }}>•</span> {feature}
											</li>
										))}
										{mode.features.length > 4 && (
											<li className="text-gray-400">+{mode.features.length - 4} more</li>
										)}
									</ul>
								</div>
							</button>
						))}
					</div>

					<div className="flex justify-center">
						<button
							type="button"
							onClick={handleContinue}
							className="rounded-xl px-5 py-3 text-base font-semibold text-white shadow-lg transition-all hover:scale-[1.02] md:px-8 md:py-4 md:text-lg"
							style={{ backgroundColor: selectedModeConfig.accentColor }}
						>
							Continue with {selectedModeConfig.name} Mode →
						</button>
					</div>

					<p className="mt-5 text-center text-sm text-gray-400 md:mt-6">
						You can change this anytime in Settings
					</p>
				</div>
			</div>
		</div>
	);
};

export default ModeSelector;
