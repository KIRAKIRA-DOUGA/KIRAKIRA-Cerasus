/**
 * 时长对象。
 *
 * 用于更方便地输入时间间隔、时长。
 *
 * 内置的 `Date` 对象是时刻，还得处理时区等无关信息。
 */
export class Duration {
	/** 秒值。 */
	private seconds: number;
	/** 时间中间的分隔符。 */
	private static colon = ":" as const;
	/** 负号。 */
	private static minus = "−" as const;
	/** 当没有时间数据时显示的占位符划线。 */
	private static dash = "‒" as const;
	/** 当没有时间数据时显示的占位符字符串。 */
	static placeholder = "‒‒:‒‒" as const;

	/**
	 * 通过秒构造时长对象。
	 * @param seconds - 秒数。如为空表示占位符。
	 */
	constructor(seconds?: number);
	/**
	 * 通过分、秒构造时长对象。
	 * @param minutes - 分钟数。
	 * @param seconds - 秒数。
	 */
	constructor(minutes: number, seconds: number);
	/**
	 * 通过时、分、秒构造时长对象。
	 * @param hours - 小时数。
	 * @param minutes - 分钟数。
	 * @param seconds - 秒数。
	 */
	constructor(hours: number, minutes: number, seconds: number);
	constructor(v1?: number, v2?: number, v3?: number) {
		if (v1 === undefined) {
			this.seconds = NaN;
			return;
		}
		this.seconds = v1;
		if (v2 !== undefined)
			this.seconds = this.seconds * 60 + v2;
		if (v3 !== undefined)
			this.seconds = this.seconds * 60 + v3;
	}

	/** 获取秒的绝对值。 */
	private get abs() { return Math.abs(this.seconds); }
	/** 获取秒钟 (0~59)。 */
	get s() { return this.abs % 60 | 0; }
	/** 获取分钟 (0~59)。 */
	get m() { return this.abs / 60 % 60 | 0; }
	/** 获取小时。 */
	get h() { return this.abs / 60 / 60 % 60 | 0; }
	/** 是否是负数？ */
	get negative() { return this.seconds < 0; }
	/** 是否有时间数据？ */
	get valid() { return Number.isFinite(this.seconds); }

	/**
	 * 返回对象的字符串表示形式。
	 * @deprecated 请使用官方内置的实现方式。
	 * @returns 对象的字符串表示形式。
	 */
	private toString_legacy() {
		if (!this.valid)
			return Duration.placeholder; // 当没有时间数据时显示占位符字符串。
		let result = `${padTo2Digit(this.m)}${Duration.colon}${padTo2Digit(this.s)}`;
		if (this.h) result = `${padTo2Digit(this.h)}${Duration.colon}${result}`;
		if (this.negative) result = Duration.minus + result;
		return result;
	}

	/**
	 * 返回对象的字符串表示形式。
	 * @note 至少要求 Chromium 129，否则自动使用旧的私有实现。
	 * @returns 对象的字符串表示形式。
	 */
	toString() {
		if (!("DurationFormat" in Intl)) return this.toString_legacy();
		const locale = getCurrentLocaleLangCode(undefined, true);
		const options: Intl.DurationFormatOptions = { style: "digital", hours: "2-digit", hoursDisplay: "auto" };
		if (!this.valid)
			return new Intl.DurationFormat(locale, { ...options, numberingSystem: "latn" }).format({ seconds: 0 }).replaceAll("0", Duration.dash);
		let result = new Intl.DurationFormat(locale, options).format({
			hours: this.h, minutes: this.m, seconds: this.s,
		});
		if (this.negative) result = Duration.minus + result; // `Intl.DurationFormat` doesn't support negative value.
		return result;
	}

	/**
	 * 获取本地化的时长字符串中冒号所使用的字符。
	 *
	 * @remarks 不同语言使用不同的时长分隔符，如印尼语使用点号而不是冒号作为分隔符。
	 *
	 * @note 至少要求 Chromium 129，否则固定返回冒号字符本身。
	 */
	static get localedColon() {
		if (!("DurationFormat" in Intl)) return Duration.colon;
		const locale = getCurrentLocaleLangCode(undefined, true);
		return new Intl.DurationFormat(locale, { style: "digital", hoursDisplay: "auto" }).format({ seconds: 0 }).replaceAll("0", "");
	}

	/**
	 * 将对象转换成基本类型值。
	 * @returns 转换成对象的 this 值。
	 */
	valueOf() { return this.seconds; }
}
