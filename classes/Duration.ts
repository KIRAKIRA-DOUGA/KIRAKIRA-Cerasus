/**
 * 时长对象。
 *
 * 用于更方便地输入时间间隔、时长。
 *
 * 内置的 `Date` 对象是时刻，还得处理时区等无关信息。
 */
export class Duration {
	/** 秒值。 */
	seconds: number;

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
		if (!Number.isFinite(this.seconds))
			return "--:--"; // 当没有时间数据时显示占位符字符串。
		const seconds = this.seconds % 60 | 0;
		const minutes = this.seconds / 60 % 60 | 0;
		const hours = this.seconds / 60 / 60 % 60 | 0;
		const padStart = (n: number) => String(n).padStart(2, "0");
		let result = `${padStart(minutes)}:${padStart(seconds)}`;
		if (hours) result = `${padStart(hours)}:${result}`;
		return result;
	}
}
