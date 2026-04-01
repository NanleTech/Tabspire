export type MoodId = "peaceful" | "grateful" | "sad" | "angry" | "anxious" | "tired" | "focused" | "hopeful";

export interface MoodOption {
	id: MoodId;
	label: string;
	emoji: string;
}

export interface MoodVerseEntry {
	text: string;
	reference: string;
	guidance: string;
}

export const moodOptions: MoodOption[] = [
	{ id: "peaceful", label: "Peaceful", emoji: "🕊️" },
	{ id: "grateful", label: "Grateful", emoji: "🙏" },
	{ id: "sad", label: "Sad", emoji: "😔" },
	{ id: "angry", label: "Angry", emoji: "😤" },
	{ id: "anxious", label: "Anxious", emoji: "😟" },
	{ id: "tired", label: "Tired", emoji: "😴" },
	{ id: "focused", label: "Focused", emoji: "🎯" },
	{ id: "hopeful", label: "Hopeful", emoji: "🌅" },
];

const moodVerseLibrary: Record<MoodId, MoodVerseEntry[]> = {
	peaceful: [
		{
			text: "You will keep in perfect peace those whose minds are steadfast, because they trust in you.",
			reference: "Isaiah 26:3",
			guidance: "Stay centered in trust as you lead.",
		},
		{
			text: "Peace I leave with you; my peace I give you. Do not let your hearts be troubled.",
			reference: "John 14:27",
			guidance: "Release what you cannot control and rest in Christ.",
		},
	],
	grateful: [
		{
			text: "Give thanks in all circumstances; for this is God’s will for you in Christ Jesus.",
			reference: "1 Thessalonians 5:18",
			guidance: "Turn gratitude into action and encouragement.",
		},
		{
			text: "Enter his gates with thanksgiving and his courts with praise.",
			reference: "Psalm 100:4",
			guidance: "Start with praise before planning your day.",
		},
	],
	sad: [
		{
			text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
			reference: "Psalm 34:18",
			guidance: "Take one small step; God is near even here.",
		},
		{
			text: "Weeping may stay for the night, but rejoicing comes in the morning.",
			reference: "Psalm 30:5",
			guidance: "Hold on to hope through this season.",
		},
	],
	angry: [
		{
			text: "In your anger do not sin: Do not let the sun go down while you are still angry.",
			reference: "Ephesians 4:26",
			guidance: "Pause before reacting; choose wisdom and gentleness.",
		},
		{
			text: "Everyone should be quick to listen, slow to speak and slow to become angry.",
			reference: "James 1:19",
			guidance: "Listen first, then respond with clarity.",
		},
	],
	anxious: [
		{
			text: "Cast all your anxiety on him because he cares for you.",
			reference: "1 Peter 5:7",
			guidance: "Breathe, pray, and take the next faithful step.",
		},
		{
			text: "Do not be anxious about anything... and the peace of God will guard your hearts and minds.",
			reference: "Philippians 4:6-7",
			guidance: "Convert pressure into prayer and thanksgiving.",
		},
	],
	tired: [
		{
			text: "Come to me, all you who are weary and burdened, and I will give you rest.",
			reference: "Matthew 11:28",
			guidance: "Work from rest, not for rest.",
		},
		{
			text: "Those who hope in the Lord will renew their strength.",
			reference: "Isaiah 40:31",
			guidance: "Refuel with God before your next task.",
		},
	],
	focused: [
		{
			text: "Set your minds on things above, not on earthly things.",
			reference: "Colossians 3:2",
			guidance: "Align priorities with purpose before execution.",
		},
		{
			text: "Let your eyes look straight ahead; fix your gaze directly before you.",
			reference: "Proverbs 4:25",
			guidance: "Protect your attention from distractions.",
		},
	],
	hopeful: [
		{
			text: "May the God of hope fill you with all joy and peace as you trust in him.",
			reference: "Romans 15:13",
			guidance: "Lead with expectation, not fear.",
		},
		{
			text: "For I know the plans I have for you... plans to give you hope and a future.",
			reference: "Jeremiah 29:11",
			guidance: "Trust that this chapter still has purpose.",
		},
	],
};

export const getMoodVerseForDay = (moodId: MoodId, dayKey?: string): MoodVerseEntry => {
	const entries = moodVerseLibrary[moodId] || moodVerseLibrary.peaceful;
	const seed = `${dayKey || new Date().toISOString().slice(0, 10)}-${moodId}`;
	let hash = 0;
	for (let index = 0; index < seed.length; index += 1) {
		hash = (hash << 5) - hash + seed.charCodeAt(index);
		hash |= 0;
	}
	return entries[Math.abs(hash) % entries.length];
};
