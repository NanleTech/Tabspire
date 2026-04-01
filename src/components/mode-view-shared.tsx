import type { ReactNode } from "react";
import type { Scripture } from "../types";

interface ModeContainerProps {
	children: ReactNode;
}

interface ModeIntroProps {
	title: string;
	subtitle: string;
}

interface AnchorCardProps {
	scripture: Scripture | null;
	fallbackText: string;
	fallbackReference: string;
	anchorLabel: string;
	accentClassName: string;
	onPlay: () => void;
	onRefresh: () => void;
	onOpenDevotional?: () => void;
}

interface GlassCardProps {
	children: ReactNode;
	className?: string;
}

export const ModeContainer: React.FC<ModeContainerProps> = ({ children }) => (
	<div className="mx-auto w-full max-w-3xl animate-fade-in overflow-x-hidden px-2 pb-14 pt-1 text-white md:pb-10">{children}</div>
);

export const ModeIntro: React.FC<ModeIntroProps> = ({ title, subtitle }) => (
	<div className="mb-2 text-center">
		<h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55 md:text-xs">{title}</h2>
		<p className="mt-1 text-xs font-medium text-white/75 md:text-sm">{subtitle}</p>
	</div>
);

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "" }) => (
	<section
		className={`mb-2.5 rounded-3xl border border-white/20 bg-gradient-to-br from-white/[0.14] via-white/[0.06] to-black/30 p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-4 ${className}`}
	>
		{children}
	</section>
);

export const AnchorCard: React.FC<AnchorCardProps> = ({
	scripture,
	fallbackText,
	fallbackReference,
	anchorLabel,
	accentClassName,
	onPlay,
	onRefresh,
	onOpenDevotional,
}) => (
	<section className={`mb-2.5 rounded-3xl border p-3.5 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_20px_48px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-4 ${accentClassName}`}>
		<div className="mx-auto mb-2 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.12] px-3 py-1 text-xs font-medium text-white/90">
			<span className="h-2 w-2 rounded-full bg-white/80" />
			{anchorLabel}
		</div>
		<p className="mx-auto max-w-3xl break-words text-center text-base font-semibold leading-relaxed text-white md:text-xl">
			“{scripture?.text || fallbackText}”
		</p>
		<p className="mt-1 text-center text-sm font-semibold text-white/60 md:text-base">
			{scripture?.reference || fallbackReference}
		</p>
		<div className="mt-3 flex flex-wrap justify-center gap-2">
			{onOpenDevotional && (
				<button
					type="button"
					onClick={onOpenDevotional}
					className="rounded-xl border border-emerald-200/40 bg-emerald-300/15 px-3.5 py-1.5 text-xs font-semibold text-emerald-100 shadow-sm transition hover:-translate-y-[1px] hover:bg-emerald-300/25 md:text-sm"
				>
					✨ Open devotional
				</button>
			)}
			<button
				type="button"
				onClick={onPlay}
				className="rounded-xl border border-white/35 bg-white/20 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:bg-white/30 md:text-sm"
			>
				▶ Listen
			</button>
			<button
				type="button"
				onClick={onRefresh}
				className="rounded-xl border border-white/30 bg-black/20 px-3.5 py-1.5 text-xs font-semibold text-white/90 shadow-sm transition hover:-translate-y-[1px] hover:bg-black/30 md:text-sm"
			>
				New verse
			</button>
		</div>
	</section>
);
