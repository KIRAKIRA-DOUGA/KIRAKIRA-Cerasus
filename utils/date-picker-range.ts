import { Temporal } from "temporal-polyfill/full";
import { forMap } from "./object.ts";

type PickerCalendar = "gregory" | "chinese";
type CalendarDay = { year: number; day: number } & ({ month: number } | { monthCode: string });
type CalendarRange = { min: CalendarDay; max: CalendarDay };
type ResolvedRange = { min: Temporal.PlainDate; max: Temporal.PlainDate };

/** 端点使用所属历法的年月日，农历闰月也可用 monthCode 指定。 */
export type DatePickerRange =
	| { gregory: CalendarRange; chinese?: CalendarRange }
	| { chinese: CalendarRange; gregory?: CalendarRange };

function readDay(fields: CalendarDay, calendar: PickerCalendar) {
	const month = "monthCode" in fields ? { monthCode: fields.monthCode } : { month: fields.month };
	return Temporal.PlainDate.from({ calendar, year: fields.year, ...month, day: fields.day }, { overflow: "reject" });
}

export function resolveDatePickerRanges(config: DatePickerRange) {
	function resolve(calendar: PickerCalendar): ResolvedRange {
		const other = calendar === "gregory" ? "chinese" : "gregory";
		const source = config[calendar] ? calendar : other;
		const range = config[source];
		if (!range) throw new TypeError("DatePicker requires a Gregorian or Chinese date range");
		const min = readDay(range.min, source).withCalendar(calendar);
		const max = readDay(range.max, source).withCalendar(calendar);
		if (Temporal.PlainDate.compare(min, max) > 0) throw new RangeError(`DatePicker: ${source} minimum exceeds maximum`);
		return { min, max };
	}
	return { gregory: resolve("gregory"), chinese: resolve("chinese") };
}

export function clampPickerDate(date: Temporal.PlainDate, { min, max }: ResolvedRange) {
	if (Temporal.PlainDate.compare(date, min) < 0) return min;
	if (Temporal.PlainDate.compare(date, max) > 0) return max;
	return date;
}

export function getDatePickerOptions(date: Temporal.PlainDate, { min, max }: ResolvedRange) {
	const firstYear = Math.max(min.year, date.year - 10);
	const lastYear = Math.min(max.year, date.year + 10);
	const inFirstYear = date.year === min.year;
	const inLastYear = date.year === max.year;
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
