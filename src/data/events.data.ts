export type AppEventDateRule =
	| {
			type: "fixed";
			month: number;
			day: number;
	  }
	| {
			type: "easter";
	  }
	| {
			type: "offset_from_easter";
			offsetDays: number;
	  }
	| {
			type: "nth_weekday_of_month";
			month: number;
			weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;
			occurrence: number;
	  }
	| {
			type: "user_birthday";
	  };

export interface AppEvent {
	id: string;
	title: string;
	tag: string;
	message: string;
	whyItIsCelebrated: string;
	dateRule: AppEventDateRule;
	showConfetti?: boolean;
}

export interface UserCustomEvent {
	id: string;
	title: string;
	month: number;
	day: number;
	message?: string;
	whyItIsCelebrated?: string;
	showConfetti?: boolean;
}

const USER_BIRTHDAY_STORAGE_KEY = "tabspire_user_birthday";
export const USER_CUSTOM_EVENTS_STORAGE_KEY = "tabspire_user_custom_events";

export const eventsData: AppEvent[] = [
	{
		id: "user-birthday",
		title: "Happy Birthday",
		tag: "Celebration Day",
		message: "Today we celebrate your life and thank God for His faithfulness over your journey.",
		whyItIsCelebrated:
			"Birthdays are a time to thank God for the gift of life, reflect with gratitude, and step into a new year with purpose.",
		dateRule: { type: "user_birthday" },
		showConfetti: true,
	},
	{
		id: "pi-day",
		title: "PI Day",
		tag: "Heritage + Celebration",
		message:
			"Today we celebrate Apostle Emmanuel Iren and thank God for his life, ministry, and impact.",
		whyItIsCelebrated:
			"PI Day marks the birthday of Apostle Emmanuel Iren, founder of Celebration Church International (CCI), observed on December 18.",
		dateRule: { type: "fixed", month: 12, day: 18 },
		showConfetti: true,
	},
	{
		id: "founders-day",
		title: "Founder's Day",
		tag: "Celebration Day",
		message: "Today we celebrate you and thank God for your life, purpose, and impact.",
		whyItIsCelebrated: "Founder's Day marks your birthday, observed each year on November 17.",
		dateRule: { type: "fixed", month: 11, day: 17 },
		showConfetti: true,
	},
	{
		id: "founder-wife-birthday",
		title: "Founder Wife Birthday",
		tag: "Celebration Day",
		message:
			"Today we celebrate the founder's wife and thank God for her life, grace, and strength.",
		whyItIsCelebrated:
			"This day honors the founder's wife birthday, observed each year on October 17.",
		dateRule: { type: "fixed", month: 10, day: 17 },
		showConfetti: true,
	},
	{
		id: "christmas",
		title: "Merry Christmas",
		tag: "Celebration Day",
		message: "Today we celebrate the birth of Jesus Christ, our Savior.",
		whyItIsCelebrated:
			"Christmas honors the incarnation of Jesus and reminds us of God's love shown through His coming into the world.",
		dateRule: { type: "fixed", month: 12, day: 25 },
		showConfetti: true,
	},
	{
		id: "palm-sunday",
		title: "Palm Sunday",
		tag: "Reflection Day",
		message:
			"Today we remember Jesus' humble entry into Jerusalem and prepare our hearts for Holy Week.",
		whyItIsCelebrated:
			"Palm Sunday is observed one week before Easter to remember Christ's entry into Jerusalem as people welcomed Him with palm branches.",
		dateRule: { type: "offset_from_easter", offsetDays: -7 },
	},
	{
		id: "good-friday",
		title: "Good Friday",
		tag: "Reflection Day",
		message: "Today we remember the sacrifice of Jesus on the cross and the depth of God's love.",
		whyItIsCelebrated:
			"Good Friday is observed two days before Easter, honoring Christ's crucifixion and atoning sacrifice.",
		dateRule: { type: "offset_from_easter", offsetDays: -2 },
	},
	{
		id: "easter",
		title: "Happy Easter",
		tag: "Reflection + Celebration",
		message: "Today we remember and rejoice in the resurrection of Jesus.",
		whyItIsCelebrated:
			"Easter celebrates Christ's victory over sin and death, and the hope of new life for everyone who believes.",
		dateRule: { type: "easter" },
		showConfetti: true,
	},
	{
		id: "pentecost",
		title: "Pentecost Sunday",
		tag: "Reflection + Empowerment",
		message:
			"Today we remember the Holy Spirit being poured out and the Church being sent in power.",
		whyItIsCelebrated:
			"Pentecost is celebrated 49 days after Easter Sunday, marking the coming of the Holy Spirit in Acts 2.",
		dateRule: { type: "offset_from_easter", offsetDays: 49 },
		showConfetti: true,
	},
	{
		id: "ascension-day",
		title: "Ascension Day",
		tag: "Reflection Day",
		message: "Today we remember the ascension of Jesus and His continuing reign over all things.",
		whyItIsCelebrated:
			"Ascension Day is observed 39 days after Easter, commemorating Christ ascending to heaven as recorded in Acts 1.",
		dateRule: { type: "offset_from_easter", offsetDays: 39 },
	},
	{
		id: "mothers-day",
		title: "Mother's Day",
		tag: "Honor Day",
		message:
			"Take a moment to honor mothers and mother figures, and thank God for their love, sacrifice, and care.",
		whyItIsCelebrated:
			"Many communities observe Mother's Day to show gratitude and honor for mothers and those who nurture families.",
		dateRule: { type: "nth_weekday_of_month", month: 5, weekday: 0, occurrence: 2 },
	},
	{
		id: "fathers-day",
		title: "Father's Day",
		tag: "Honor Day",
		message:
			"Take a moment to honor fathers and father figures, and thank God for their guidance and care.",
		whyItIsCelebrated:
			"Many communities observe Father's Day to appreciate and honor fathers and those who faithfully lead and support families.",
		dateRule: { type: "nth_weekday_of_month", month: 6, weekday: 0, occurrence: 3 },
	},
	{
		id: "new-year",
		title: "Happy New Year",
		tag: "Reflection Day",
		message: "A new year is a fresh moment to seek God's direction and walk in faith.",
		whyItIsCelebrated:
			"Many people mark New Year's Day by reflecting on the past year and committing their plans for the coming year.",
		dateRule: { type: "fixed", month: 1, day: 1 },
	},
	{
		id: "charismatic-renewal-remembrance",
		title: "Charismatic Renewal Remembrance",
		tag: "Heritage Day",
		message:
			"Today we remember the fresh outpouring of hunger for the Holy Spirit and renewed expectancy for His gifts.",
		whyItIsCelebrated:
			"Many mark this day to remember key moments in the modern Charismatic renewal movement and to pray for renewed spiritual vitality.",
		dateRule: { type: "fixed", month: 2, day: 17 },
	},
	{
		id: "azusa-street-remembrance",
		title: "Azusa Street Revival Remembrance",
		tag: "Heritage Day",
		message:
			"Today we remember the Azusa Street revival and pray for unity, holiness, and Spirit-empowered witness.",
		whyItIsCelebrated:
			"This remembrance honors a defining Pentecostal revival that shaped global Spirit-filled movements and missional passion.",
		dateRule: { type: "fixed", month: 4, day: 9 },
	},
];

const getEasterDate = (year: number): { month: number; day: number } => {
	const century = Math.floor(year / 100);
	const yearOfCentury = year % 100;
	const leapYearCorrection = Math.floor(century / 4);
	const centuryRemainder = century % 4;
	const moonCorrection = Math.floor((century + 8) / 25);
	const correctionFactor = Math.floor((century - moonCorrection + 1) / 3);
	const goldenNumber = year % 19;
	const epact = (19 * goldenNumber + century - leapYearCorrection - correctionFactor + 15) % 30;
	const leapYearOfCentury = Math.floor(yearOfCentury / 4);
	const yearRemainder = yearOfCentury % 4;
	const weekdayOffset =
		(32 + 2 * centuryRemainder + 2 * leapYearOfCentury - epact - yearRemainder) % 7;
	const paschalCorrection = Math.floor((goldenNumber + 11 * epact + 22 * weekdayOffset) / 451);
	const month = Math.floor((epact + weekdayOffset - 7 * paschalCorrection + 114) / 31);
	const day = ((epact + weekdayOffset - 7 * paschalCorrection + 114) % 31) + 1;

	return { month, day };
};

const parseMonthDay = (value: string): { month: number; day: number } | null => {
	const normalized = value.trim();
	if (!normalized) return null;

	const parts = normalized.split("-");
	if (parts.length === 3) {
		const month = Number.parseInt(parts[1], 10);
		const day = Number.parseInt(parts[2], 10);
		if (!Number.isFinite(month) || !Number.isFinite(day)) return null;
		if (month < 1 || month > 12 || day < 1 || day > 31) return null;
		return { month, day };
	}

	if (parts.length === 2) {
		const month = Number.parseInt(parts[0], 10);
		const day = Number.parseInt(parts[1], 10);
		if (!Number.isFinite(month) || !Number.isFinite(day)) return null;
		if (month < 1 || month > 12 || day < 1 || day > 31) return null;
		return { month, day };
	}

	return null;
};

const getUserBirthdayMonthDay = (): { month: number; day: number } | null => {
	if (typeof window === "undefined") return null;

	try {
		const raw = localStorage.getItem(USER_BIRTHDAY_STORAGE_KEY);
		if (!raw) return null;
		return parseMonthDay(raw);
	} catch {
		return null;
	}
};

const sanitizeCustomEvent = (value: unknown): UserCustomEvent | null => {
	if (!value || typeof value !== "object") return null;

	const raw = value as Record<string, unknown>;
	const id = typeof raw.id === "string" ? raw.id.trim() : "";
	const title = typeof raw.title === "string" ? raw.title.trim() : "";
	const month = Number(raw.month);
	const day = Number(raw.day);

	if (!id || !title) return null;
	if (!Number.isInteger(month) || !Number.isInteger(day)) return null;
	if (month < 1 || month > 12 || day < 1 || day > 31) return null;

	return {
		id,
		title,
		month,
		day,
		message: typeof raw.message === "string" ? raw.message.trim() : undefined,
		whyItIsCelebrated:
			typeof raw.whyItIsCelebrated === "string" ? raw.whyItIsCelebrated.trim() : undefined,
		showConfetti: raw.showConfetti === true,
	};
};

export const getUserCustomEvents = (): UserCustomEvent[] => {
	if (typeof window === "undefined") return [];

	try {
		const raw = localStorage.getItem(USER_CUSTOM_EVENTS_STORAGE_KEY);
		if (!raw) return [];

		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];

		return parsed
			.map(sanitizeCustomEvent)
			.filter((eventItem): eventItem is UserCustomEvent => !!eventItem);
	} catch {
		return [];
	}
};

const toAppEvent = (customEvent: UserCustomEvent): AppEvent => ({
	id: `custom-${customEvent.id}`,
	title: customEvent.title,
	tag: "Custom Event",
	message: customEvent.message || `Today we celebrate ${customEvent.title}.`,
	whyItIsCelebrated:
		customEvent.whyItIsCelebrated || "This is a custom event you added in settings.",
	dateRule: {
		type: "fixed",
		month: customEvent.month,
		day: customEvent.day,
	},
	showConfetti: customEvent.showConfetti,
});

const addDaysToMonthDay = (
	base: { month: number; day: number },
	year: number,
	offsetDays: number,
): { month: number; day: number } => {
	const shiftedDate = new Date(year, base.month - 1, base.day + offsetDays);
	return {
		month: shiftedDate.getMonth() + 1,
		day: shiftedDate.getDate(),
	};
};

const getNthWeekdayOfMonth = (
	year: number,
	month: number,
	weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6,
	occurrence: number,
): { month: number; day: number } | null => {
	if (occurrence < 1) return null;

	const firstDate = new Date(year, month - 1, 1);
	const firstWeekday = firstDate.getDay();
	const dayOffset = (weekday - firstWeekday + 7) % 7;
	const day = 1 + dayOffset + (occurrence - 1) * 7;
	const candidate = new Date(year, month - 1, day);

	if (candidate.getMonth() + 1 !== month) return null;

	return { month, day };
};

const isSameDay = (
	date: Date,
	rule: AppEventDateRule,
	easterDate: { month: number; day: number },
): boolean => {
	const month = date.getMonth() + 1;
	const day = date.getDate();

	if (rule.type === "fixed") {
		return month === rule.month && day === rule.day;
	}

	if (rule.type === "easter") {
		return month === easterDate.month && day === easterDate.day;
	}

	if (rule.type === "offset_from_easter") {
		const targetDate = addDaysToMonthDay(easterDate, date.getFullYear(), rule.offsetDays);
		return month === targetDate.month && day === targetDate.day;
	}

	if (rule.type === "user_birthday") {
		const birthday = getUserBirthdayMonthDay();
		if (!birthday) return false;
		return month === birthday.month && day === birthday.day;
	}

	const nthWeekdayDate = getNthWeekdayOfMonth(
		date.getFullYear(),
		rule.month,
		rule.weekday,
		rule.occurrence,
	);
	if (!nthWeekdayDate) return false;

	return month === nthWeekdayDate.month && day === nthWeekdayDate.day;
};

export const getActiveEventsForDate = (date: Date = new Date()): AppEvent[] => {
	const easterDate = getEasterDate(date.getFullYear());
	const mergedEvents = [...eventsData, ...getUserCustomEvents().map(toAppEvent)];
	return mergedEvents.filter((eventItem) => isSameDay(date, eventItem.dateRule, easterDate));
};

export const getPrimaryEventForDate = (date: Date = new Date()): AppEvent | null =>
	getActiveEventsForDate(date)[0] ?? null;
