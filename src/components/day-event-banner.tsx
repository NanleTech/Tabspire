import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { createPortal } from "react-dom";
import { getPrimaryEventForDate } from "../data/events.data";
import { useWindowSize } from "../hooks/use-window-size";
import { DayEventCard } from "./mode-view-shared";

interface DayEventBannerProps {
	date?: Date;
	cardClassName?: string;
}

const DayEventBanner: React.FC<DayEventBannerProps> = ({
	date,
	cardClassName = "border-amber-300/30 bg-amber-500/10",
}) => {
	const [showEventCelebration, setShowEventCelebration] = useState(false);
	const { width, height } = useWindowSize();
	const activeDate = date ?? new Date();
	const dayKey = activeDate.toISOString().slice(0, 10);
	const dayEvent = getPrimaryEventForDate(activeDate);

	useEffect(() => {
		if (!dayEvent?.showConfetti) {
			setShowEventCelebration(false);
			return;
		}

		const storageKey = `tabspire_event_confetti_${dayEvent.id}_${dayKey}`;
		if (localStorage.getItem(storageKey)) return;

		setShowEventCelebration(true);
		localStorage.setItem(storageKey, "1");
		const timer = window.setTimeout(() => setShowEventCelebration(false), 2600);
		return () => window.clearTimeout(timer);
	}, [dayEvent, dayKey]);

	if (!dayEvent) return null;

	return (
		<>
			<DayEventCard
				title={dayEvent.title}
				tag={dayEvent.tag}
				message={dayEvent.message}
				whyItIsCelebrated={dayEvent.whyItIsCelebrated}
				className={cardClassName}
			/>
			{showEventCelebration &&
				width > 0 &&
				height > 0 &&
				createPortal(
					<Confetti
						width={width}
						height={height}
						recycle={false}
						numberOfPieces={220}
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
		</>
	);
};

export default DayEventBanner;
