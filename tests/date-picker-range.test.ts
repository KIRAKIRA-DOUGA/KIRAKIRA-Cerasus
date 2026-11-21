import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { Temporal } from "temporal-polyfill/full";
import { compileScript, parse } from "vue/compiler-sfc";

// 用 Vue 编译器加载组件，让 Node 测试直接使用选择器里的日期范围计算。
const vueLoader = registerHooks({
	load(url, context, nextLoad) {
		if (!url.endsWith("/DateTimePicker/DatePicker.vue")) return nextLoad(url, context);
		const filename = fileURLToPath(url);
		const { descriptor } = parse(readFileSync(filename, "utf8"), { filename });
		const { content } = compileScript(descriptor, { id: filename });
		// 独立运行的 Node 测试需要补上 Nuxt 在构建组件时注入的依赖。
		const source = [
			`import { Temporal } from "${import.meta.resolve("temporal-polyfill/full")}";`,
			`import { forMap } from "${import.meta.resolve("../utils/object.ts")}";`,
			content,
		].join("\n");
		return { format: "module-typescript", source, shortCircuit: true };
	},
});
const { clampPickerDate, getDatePickerOptions, resolveDatePickerRanges } = await import("../components/DateTimePicker/DatePicker.vue");
vueLoader.deregister();

const first = { year: 1900, month: 1, day: 1 };
const twentieth = { year: 1900, month: 1, day: 20 };
const iso = (date?: Temporal.PlainDate) => date?.withCalendar("iso8601").toString();

test("each endpoint converts its missing calendar independently", () => {
	const { gregory, chinese } = resolveDatePickerRanges({ min: { gregory: first }, max: { chinese: twentieth } });
	assert.equal(iso(gregory.min), "1900-01-01");
	assert.equal(iso(chinese.min), "1900-01-01");
	assert.equal(chinese.min?.calendarId, "chinese");
	assert.equal(iso(gregory.max), "1900-02-19");
	assert.equal(iso(chinese.max), "1900-02-19");
	assert.equal(gregory.max?.calendarId, "gregory");
});

test("two explicit ranges keep their own dates even when they do not overlap", () => {
	const { gregory, chinese } = resolveDatePickerRanges({
		min: { gregory: first, chinese: first },
		max: { gregory: twentieth, chinese: twentieth },
	});
	assert.equal(iso(gregory.min), "1900-01-01");
	assert.equal(iso(chinese.min), "1900-01-31");
	assert.equal(iso(gregory.max), "1900-01-20");
	assert.equal(iso(chinese.max), "1900-02-19");
	assert.ok(gregory.max && chinese.min);
	assert.equal(clampPickerDate(gregory.max.withCalendar("chinese"), chinese), chinese.min);
	assert.equal(clampPickerDate(chinese.min.withCalendar("gregory"), gregory), gregory.max);
});

test("partial lunar months include both endpoints and distinguish the leap month", () => {
	const { chinese } = resolveDatePickerRanges({
		min: { chinese: { year: 2023, monthCode: "M02", day: 27 } },
		max: { chinese: { year: 2023, monthCode: "M02L", day: 3 } },
	});
	assert.ok(chinese.min && chinese.max);
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

test("a single allowed day is selectable", () => {
	const day = { year: 2024, month: 2, day: 29 };
	const { gregory } = resolveDatePickerRanges({ min: { gregory: day }, max: { gregory: day } });
	assert.ok(gregory.min);
	assert.deepEqual(getDatePickerOptions(gregory.min, gregory).days, [29]);
});

test("a lower bound leaves later dates open and an upper bound leaves earlier dates open", () => {
	const lower = resolveDatePickerRanges({ min: { chinese: first } }).gregory;
	const upper = resolveDatePickerRanges({ max: { gregory: twentieth } }).gregory;
	const past = Temporal.PlainDate.from("1800-01-01");
	const future = Temporal.PlainDate.from("2100-12-31");
	assert.equal(lower.max, undefined);
	assert.equal(upper.min, undefined);
	assert.equal(clampPickerDate(future, lower), future);
	assert.equal(clampPickerDate(past, upper), past);
	const lowerEdge = getDatePickerOptions(clampPickerDate(past, lower), lower);
	const upperEdge = getDatePickerOptions(clampPickerDate(future, upper), upper);
	assert.deepEqual(lowerEdge.days, [31]);
	assert.equal(lowerEdge.years.at(-1), 1910);
	assert.equal(upperEdge.days.at(-1), 20);
	assert.equal(upperEdge.years[0], 1890);
});

test("omitting both bounds leaves the wheels unrestricted in both calendars", () => {
	for (const config of [undefined, {}]) {
		const ranges = resolveDatePickerRanges(config);
		for (const calendar of ["gregory", "chinese"] as const) {
			const date = Temporal.PlainDate.from("1850-05-15").withCalendar(calendar);
			const range = ranges[calendar];
			assert.equal(range.min, undefined);
			assert.equal(range.max, undefined);
			assert.equal(clampPickerDate(date, range), date);
			const options = getDatePickerOptions(date, range);
			assert.equal(options.years[0], date.year - 10);
			assert.equal(options.years.at(-1), date.year + 10);
			assert.equal(options.months.length, date.monthsInYear);
			assert.equal(options.days.length, date.daysInMonth);
			assert.ok(options.loopMonths && options.loopDays);
		}
	}
});

test("rejects empty endpoints, impossible dates and ranges inverted in either calendar", () => {
	// @ts-expect-error A supplied lower bound needs at least one calendar.
	assert.throws(() => resolveDatePickerRanges({ min: {}, max: { gregory: first } }), TypeError);
	// @ts-expect-error A supplied upper bound needs at least one calendar.
	assert.throws(() => resolveDatePickerRanges({ min: { gregory: first }, max: {} }), TypeError);
	assert.throws(() => resolveDatePickerRanges({ max: { gregory: { year: 2024, month: 2, day: 30 } } }), RangeError);
	assert.throws(() => resolveDatePickerRanges({ min: { gregory: twentieth }, max: { gregory: first } }), /gregory minimum exceeds maximum/);
	assert.throws(() => resolveDatePickerRanges({ min: { gregory: first, chinese: first }, max: { gregory: twentieth } }), /chinese minimum exceeds maximum/);
});
