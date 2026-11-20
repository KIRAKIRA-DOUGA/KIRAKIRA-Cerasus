import { Temporal } from "temporal-polyfill/full";
import { forMap } from "./object.ts";

type PickerCalendar = "gregory" | "chinese";
type CalendarDay = { year: number; day: number } & ({ month: number } | { monthCode: string });
type CalendarBound =
	| { gregory: CalendarDay; chinese?: CalendarDay }
	| { gregory?: CalendarDay; chinese: CalendarDay };
type ResolvedRange = { min?: Temporal.PlainDate; max?: Temporal.PlainDate };

/** 上下限均可省略。每个端点至少指定一种历法，农历闰月可用 monthCode 指定。 */
export type DatePickerRange = { min?: CalendarBound; max?: CalendarBound };

function readDay(fields: CalendarDay, calendar: PickerCalendar) {
	const month = "monthCode" in fields ? { monthCode: fields.monthCode } : { month: fields.month };
	return Temporal.PlainDate.from({ calendar, year: fields.year, ...month, day: fields.day }, { overflow: "reject" });
}

function resolveBound(bound?: CalendarBound) {
	if (bound === undefined) return;
	const gregory = bound.gregory && readDay(bound.gregory, "gregory");
	const chinese = bound.chinese && readDay(bound.chinese, "chinese");
	if (gregory) return { gregory, chinese: chinese ?? gregory.withCalendar("chinese") };
	if (chinese) return { gregory: chinese.withCalendar("gregory"), chinese };
	throw new TypeError("DatePicker: each bound requires a Gregorian or Chinese date");
}

export function resolveDatePickerRanges(config: DatePickerRange = {}) {
	const lower = resolveBound(config.min);
	const upper = resolveBound(config.max);
	function resolve(calendar: PickerCalendar): ResolvedRange {
		const min = lower?.[calendar];
		const max = upper?.[calendar];
		if (min && max && Temporal.PlainDate.compare(min, max) > 0) throw new RangeError(`DatePicker: ${calendar} minimum exceeds maximum`);
		return { min, max };
	}
	return { gregory: resolve("gregory"), chinese: resolve("chinese") };
}

export function clampPickerDate(date: Temporal.PlainDate, { min, max }: ResolvedRange) {
	if (min && Temporal.PlainDate.compare(date, min) < 0) return min;
	if (max && Temporal.PlainDate.compare(date, max) > 0) return max;
	return date;
}

export function getDatePickerOptions(date: Temporal.PlainDate, { min, max }: ResolvedRange) {
	const firstYear = Math.max(min?.year ?? -Infinity, date.year - 10);
	const lastYear = Math.min(max?.year ?? Infinity, date.year + 10);
	const inFirstYear = date.year === min?.year;
	const inLastYear = date.year === max?.year;
	const firstMonth = inFirstYear ? min.month : 1;
	const lastMonth = inLastYear ? max.month : date.monthsInYear;
	const inFirstMonth = inFirstYear && date.month === min.month;
	const inLastMonth = inLastYear && date.month === max.month;
	const firstDay = inFirstMonth ? min.day : 1;
	const lastDay = inLastMonth ? max.day : date.daysInMonth;
	const yearMonth = date.toPlainYearMonth();
	return {
		years: forMap(lastYear - firstYear + 1, Number, firstYear),
		months: forMap(lastMonth - firstMonth + 1, month => yearMonth.with({ month }).monthCode, firstMonth),
		days: forMap(lastDay - firstDay + 1, Number, firstDay),
		loopMonths: !inFirstYear && !inLastYear,
		loopDays: !inFirstMonth && !inLastMonth,
	};
}
