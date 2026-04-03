import type { TPriorityItem, TPriorityTag } from "./type";

export const defaultPriorities: TPriorityItem[] = [
	{
		id: "p1",
		title: "Finish Q2 budget report for CFO review",
		tag: "Deep work",
		done: true,
		timerDuration: 60,
		timerElapsed: 0,
		isTimerRunning: false,
	},
	{
		id: "p2",
		title: "1:1 with Sarah — performance feedback",
		tag: "Meeting",
		done: false,
		timerDuration: 30,
		timerElapsed: 0,
		isTimerRunning: false,
	},
	{
		id: "p3",
		title: "Reply to outstanding client emails",
		tag: "Admin",
		done: false,
		timerDuration: 15,
		timerElapsed: 0,
		isTimerRunning: false,
	},
];

export const tagClassByName: Record<string, string> = {
	"Deep work": "border-blue-300/50 bg-blue-400/10 text-blue-200",
	Meeting: "border-amber-300/50 bg-amber-400/10 text-amber-200",
	Admin: "border-violet-300/50 bg-violet-400/10 text-violet-200",
};

export const timerPresets: Array<{
	id: string;
	label: string;
	minutes: number;
	tag: TPriorityTag;
	title: string;
}> = [
	{ id: "focus-25", label: "25m Focus", minutes: 25, tag: "Deep work", title: "Focus block" },
	{
		id: "deep-50",
		label: "50m Deep work",
		minutes: 50,
		tag: "Deep work",
		title: "Deep work session",
	},
	{ id: "admin-15", label: "15m Admin", minutes: 15, tag: "Admin", title: "Admin sweep" },
];
