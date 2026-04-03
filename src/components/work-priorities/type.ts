export type TPriorityTag = "Deep work" | "Meeting" | "Admin";

export type TPriorityItem = {
	id: string;
	title: string;
	tag: TPriorityTag;
	done: boolean;
	timerDuration?: number;
	timerElapsed?: number;
	isTimerRunning?: boolean;
	softDeadline?: string;
};
