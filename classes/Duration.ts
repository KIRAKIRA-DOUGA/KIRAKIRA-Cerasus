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
	private static colon = "∶" as const;
	/** 当没有时间数据时显示的占位符字符串。 */
	static placeholder = "‒‒∶‒‒" as const;

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

	/**
	 * 返回对象的字符串表示形式。
	 * @returns 对象的字符串表示形式。
	 */
	toString() {
		let negative = false, value = this.seconds;
		if (value < 0) {
			negative = true;
			value = -value;
		}
		if (!Number.isFinite(value))
			return Duration.placeholder; // 当没有时间数据时显示占位符字符串。
		const seconds = value % 60 | 0;
		const minutes = value / 60 % 60 | 0;
		const hours = value / 60 / 60 % 60 | 0;
		const padStart = (n: number) => String(n).padStart(2, "0");
		let result = `${padStart(minutes)}${Duration.colon}${padStart(seconds)}`;
		if (hours) result = `${padStart(hours)}:${result}`;
		if (negative) result = "-" + result;
		return result;
	}

	/**
	 * 将对象转换成基本类型值。
	 * @returns 转换成对象的 this 值。
	 */
	valueOf() {
		return this.seconds;
	}
}
