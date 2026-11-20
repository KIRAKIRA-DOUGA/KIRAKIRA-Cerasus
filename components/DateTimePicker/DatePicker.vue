<docs>
	# 日期选择器
</docs>

<script lang="ts">
	function getLocaleDateFormat(locale: string | Intl.Locale) {
		const go = new Date("2006-01-02T15:04:05"); // 幽默 Golang 的日期时间格式化字符串。
		const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "2-digit", day: "2-digit", numberingSystem: "latn" };
		const formatted = new Intl.DateTimeFormat(locale, options).format(go);
		const [, num1, sep, num2, num3] = formatted.match(/(\d+)(.*?)(\d+).*?(\d+)/)!;
		const dateParts: Record<string, string> = { 2006: "y", "01": "m", "02": "d" };
		const ymd = [num1, num2, num3].map(num => dateParts[num]).join("");
		const weekdayAfter = !new Intl.DateTimeFormat(locale, { ...options, weekday: "short" }).format(go).match(/\d$/);
		const weekdays = forMap(7, date => new Intl.DateTimeFormat(locale, { weekday: "short" }).format(new Date(2006, 0 /* CAUTION: 0 表示 1 月！ */, date)), 1);
		return { ymd, sep: sep.trim(), weekdayAfter, weekdays };
	}
	const availableCalendars = ["gregory", "chinese"] as const;
	function toHanziDecimal(num: number, locale: string | Intl.Locale = "zh") {
		return Intl.NumberFormat(locale, { numberingSystem: "hanidec", useGrouping: false }).format(num);
	}
	function toChineseCalendarMonth(monthCode: string, locale: string | Intl.Locale = "zh") {
		// return Temporal.Now.plainDateISO().withCalendar("chinese").with({ monthCode: "M01" }).toLocaleString("zh-CN", { calendar: "chinese", month: "long" });
		// 上述代码会导致 11 月写成十一月而不是冬月，12 月却写成腊月的离谱错误。但繁体中文却正常。日语 11 月和 12 月一起罢工。
		locale = new Intl.Locale(locale).maximize();
		const hans = locale.script === "Hans";
		return (monthCode.endsWith("L") ? hans ? "闰" : "閏" : "") +
			` 正二三四五六七八九十冬${hans ? "腊" : "臘"}`[+monthCode.match(/\d+/)![0]];
	}
	function toHanziDays(day: number, locale: string | Intl.Locale = "zh") {
		// return Intl.NumberFormat(locale, { numberingSystem: "hanidays" }).format(num); // 官方方式但没浏览器支持。
		locale = new Intl.Locale(locale).maximize();
		const hans = locale.script === "Hans";
		const tens = ` 十廿卅卌圩${hans ? "圆" : "圓"}${hans ? "进" : "進"}枯枠百`;
		const ones = "〇一二三四五六七八九十";
		if (day <= 10) return "初" + ones[day];
		else if (day % 10 === 0) return ones[day / 10] + "十";
		else return tens[day / 10 | 0] + ones[day % 10];
	}
</script>

<script setup lang="ts">
	import { type DatePickerRange, type PickerCalendar, clampPickerDate, getDatePickerOptions, resolveDatePickerRanges } from "utils/date-picker-range";

	const { t } = useI18n();
	const props = defineProps<{
		/**
		 * 最早可选日期（`min`）和最晚可选日期（`max`）均可省略。
		 * 每个界限至少指定一种历法。只指定一种时自动换算另一种，公历和农历都指定时分别使用传入的日期。
		 */
		range?: DatePickerRange;
		/** 指定历法时固定使用该历法，省略历法选择列。 */
		fixedCalendar?: PickerCalendar;
		/** 隐藏显示框和菜单中的星期。 */
		hideWeekday?: boolean;
	}>();
	const ranges = computed(() => resolveDatePickerRanges(props.range));
	const selected = defineModel<Temporal.PlainDate>();
	const currentDate = shallowRef<Temporal.PlainDate>();
	const draft = shallowRef<Temporal.PlainDate>();
	// 优先使用本次手动选择的日期，其次使用外部传入的日期，两者都为空时才使用打开菜单当天的日期。
	const selection = computed(() => draft.value ?? selected.value ?? currentDate.value);
	function resolveCalendar(calendarId?: string): PickerCalendar {
		return props.fixedCalendar ?? (calendarId === "chinese" ? "chinese" : "gregory");
	}
	const calendar = computed(() => resolveCalendar(selection.value?.calendarId));
	const value = computed(() => {
		if (!selection.value) return;
		const date = selection.value.withCalendar(calendar.value);
		return currentDate.value ? clampPickerDate(date, ranges.value[calendar.value]) : date;
	});
	const options = computed(() => currentDate.value && value.value ? getDatePickerOptions(value.value, ranges.value[calendar.value]) : undefined);

	function openMenu() {
		currentDate.value = Temporal.Now.plainDateISO().withCalendar("gregory");
	}

	function confirmSelection() {
		if (value.value) selected.value = value.value;
		clearDraft();
	}

	function clearDraft() {
		draft.value = undefined;
		currentDate.value = undefined;
	}

	const locale = getCurrentLocaleLangCode(undefined, true);
	const useHanzi = computed(() => locale.startsWith("zh") || locale === "ja"); // 中文（包括简中、繁中、粤语）和日语可以使用汉字。
	const isChineseCalendar = computed(() => calendar.value === "chinese");
	const format = computed(() => getLocaleDateFormat(locale));
	const staticFields = {
		calendar: { name: "calendar", values: availableCalendars, getDisplayValue: calendar => t(`calendar.${calendar}`) } satisfies BaseDateTimePickerField<string>,
		weekday: { name: "weekday", text: () => value.value ? format.value.weekdays[value.value.dayOfWeek % 7] : "", minWidth: "2em" },
		y: {
			name: "year",
			sep: format.value.sep,
			values: () => options.value?.years ?? [],
			placeholderLength: 4,
			getDisplayValue: year => {
				if (isChineseCalendar.value && useHanzi.value) return toHanziDecimal(year, locale);
				return (year < 0 ? "-" : "") + Math.abs(year).toString().padStart(4, "0");
			},
		} satisfies BaseDateTimePickerField<number>,
		m: {
			name: "month",
			sep: format.value.sep,
			values: () => options.value?.months ?? [],
			getDisplayValue: monthCode => {
				if (isChineseCalendar.value && useHanzi.value) return toChineseCalendarMonth(monthCode, locale);
				return monthCode.match(/\d+/)![0].padStart(2, "0") + (monthCode.endsWith("L") ? "+" : "");
			},
			get loopable() { return options.value?.loopMonths ?? false; },
			minWidth: () => isChineseCalendar.value && useHanzi.value ? "2em" : undefined,
		} satisfies BaseDateTimePickerField<string>,
		d: {
			name: "date",
			sep: format.value.sep,
			values: () => options.value?.days ?? [],
			getDisplayValue: date => {
				if (isChineseCalendar.value && useHanzi.value) return toHanziDays(date, locale);
				return padTo2Digit(date);
			},
			get loopable() { return options.value?.loopDays ?? false; },
		} satisfies BaseDateTimePickerField<number>,
	} satisfies Record<string, BaseDateTimePickerField | BaseDateTimePickerFieldPlain>;
	const fields = computed<(BaseDateTimePickerField | BaseDateTimePickerFieldPlain)[]>(() => [
		...props.fixedCalendar ? [] : [staticFields.calendar],
		...!props.hideWeekday && !format.value.weekdayAfter ? [staticFields.weekday] : [],
		staticFields[format.value.ymd[0] as "y"],
		staticFields[format.value.ymd[1] as "m"],
		{ ...staticFields[format.value.ymd[2] as "d"], sep: undefined },
		...!props.hideWeekday && format.value.weekdayAfter ? [staticFields.weekday] : [],
	]);
	const model = computed({
		get: () => value.value ? {
			calendar: value.value.calendarId,
			year: value.value.year,
			month: value.value.monthCode,
			date: value.value.day,
		} : undefined,
		set: fields => {
			const current = value.value;
			if (!current || !fields) return;
			const { year, month, date } = fields;
			const nextCalendar = resolveCalendar(fields.calendar);
			const next = nextCalendar === current.calendarId ?
				current.with({ year, monthCode: month, day: date }, { overflow: "constrain" }) :
				current.withCalendar(nextCalendar);
			draft.value = clampPickerDate(next, ranges.value[nextCalendar]);
		},
	});
</script>

<template>
	<BaseDateTimePicker
		:fields
		:placeholderValues="{ calendar: 'gregory' }"
		v-model="model"
		@open="openMenu"
		@confirm="confirmSelection"
		@cancel="clearDraft"
	/>
</template>
