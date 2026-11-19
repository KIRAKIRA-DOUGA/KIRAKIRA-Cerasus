import assert from "node:assert/strict";
import { test } from "node:test";
import { Temporal } from "temporal-polyfill/full";
import { clampPickerDate, getDatePickerOptions, resolveDatePickerRanges } from "../utils/date-picker-range.ts";

const january = { min: { year: 1900, month: 1, day: 1 }, max: { year: 1900, month: 1, day: 20 } };
const iso = (date: Temporal.PlainDate) => date.withCalendar("iso8601").toString();

test("one calendar converts both endpoints to the same absolute days", () => {
	for (const config of [{ gregory: january }, { chinese: january }]) {
		const { gregory, chinese } = resolveDatePickerRanges(config);
		assert.equal(iso(gregory.min), iso(chinese.min));
		assert.equal(iso(gregory.max), iso(chinese.max));
		assert.equal(gregory.min.calendarId, "gregory");
		assert.equal(chinese.max.calendarId, "chinese");
	}
});

test("two explicit ranges keep their own dates even when they do not overlap", () => {
	const { gregory, chinese } = resolveDatePickerRanges({ gregory: january, chinese: january });
	assert.equal(iso(gregory.min), "1900-01-01");
	assert.equal(iso(chinese.min), "1900-01-31");
	assert.equal(iso(gregory.max), "1900-01-20");
	assert.equal(iso(chinese.max), "1900-02-19");
	assert.equal(clampPickerDate(gregory.max.withCalendar("chinese"), chinese), chinese.min);
	assert.equal(clampPickerDate(chinese.min.withCalendar("gregory"), gregory), gregory.max);
});

test("partial lunar months include both endpoints and distinguish the leap month", () => {
	const { chinese } = resolveDatePickerRanges({ chinese: {
		min: { year: 2023, monthCode: "M02", day: 27 },
		max: { year: 2023, monthCode: "M02L", day: 3 },
	} });
	const first = getDatePickerOptions(chinese.min, chinese);
	const last = getDatePickerOptions(chinese.max, chinese);
	assert.deepEqual(first.years, [2023]);
	assert.deepEqual(first.months, ["M02", "M02L"]);
	assert.equal(first.days[0], 27);
	assert.equal(first.days.at(-1), chinese.min.daysInMonth);
	assert.deepEqual(last.days, [1, 2, 3]);
	assert.equal(first.loopMonths, false);
	assert.equal(last.loopDays, false);
});

test("a single allowed day is selectable and invalid ranges are rejected", () => {
	const day = { year: 2024, month: 2, day: 29 };
	const { gregory } = resolveDatePickerRanges({ gregory: { min: day, max: day } });
	assert.deepEqual(getDatePickerOptions(gregory.min, gregory).days, [29]);
	assert.throws(() => resolveDatePickerRanges({ gregory: { min: day, max: january.max } }), RangeError);
	assert.throws(() => resolveDatePickerRanges({ gregory: { min: { ...day, day: 30 }, max: day } }), RangeError);
	// @ts-expect-error At least one calendar must provide a range.
	assert.throws(() => resolveDatePickerRanges({}), TypeError);
});
