/**
 * 标准化数字。拒绝傻逼科学计数法。
 * @param num - 数字。
 * @returns 标准化的数字。
 * @note `-0` 会被转换成 `"0"`。
 */
export function normalizeNumber(num: WithWrapperType<number | bigint | string>) {
	num = num.valueOf();
	return (() => {
		if (typeof num === "string")
			if (num.match(/^(NaN|[+-]?Infinity)$/)) return num;
			else if (num.match(/^0[box]/i)) try { num = BigInt(num); } catch { }
		if (!isValidNumber(num)) return "NaN";
		return ("" + num).replace(/([+-]?)(\d*)\.?(\d*)e([+-]?\d+)/i,
			(_, sign, int, frac, exp) => exp < 0 ?
				sign + "0." + Array(1 - exp - int.length).join("0") + int + frac :
				sign + int + frac + Array(exp - frac.length + 1).join("0"));
	})().replace(/^\+/, "");
}

/**
 * 验证值是否为有效数字。
 *
 * value | returns
 * --- | :--:
 * `-123.45e-56` | true
 * `"1.0e-8"` | true
 * `256n` | true
 * `"0xDeadBeef"` | true
 * `""` | false
 * `NaN` | false
 * `Infinity` | false
 *
 * @param value - 要验证的值。可以是任何类型。
 * @returns 该值是有效的有限数字、表示数字的非空字符串或大数吗？
 */
export function isValidNumber(value: unknown) {
	// eslint-disable-next-line no-restricted-globals
	return value !== "" && ["number", "string"].includes(typeof value) && isFinite(value as number) || typeof value === "bigint";
}

/**
 * 数字转中文数字。
 * @param n - 数字。
 * @param upperCase - 是否以大写数字输出。
 * @param amountMode - 是否以金额模式输出。
 * @returns 中文数字。
 */
export function digitCase(n: number | bigint, upperCase: boolean = false, amountMode: boolean = false) {
	let s = normalizeNumber(n);
	const fraction = ["角", "分", "厘", "毫", "丝", "忽", "微", "纤", "沙", "尘", "埃", "渺", "漠", "模糊", "逡巡", "须臾", "瞬息", "弹指", "刹那", "六德", "虚空", "清静", "阿赖耶", "阿摩罗", "涅槃寂静"];
	const arabic = "0123456789";
	const lower = "〇一二三四五六七八九元十百千万亿";
	const upper = "零壹贰叁肆伍陆柒捌玖圆拾佰仟萬億";
	const unit = ["元", "万", "亿", "兆", "京", "垓", "秭", "穰", "沟", "涧", "正", "载", "极", "恒河沙", "阿僧祇", "那由他", "不可思议", "无量", "大数"];
	const digit = ["", "十", "百", "千"];
	let sign = "";
	if (s[0] === "-") { sign = amountMode ? "欠" : "负"; s = s.slice(1); }
	for (let i = 0; i < arabic.length; i++)
		s = s.replaceAll(arabic[i], lower[i]);
	let [int, dec] = s.split(".");
	if (dec === undefined) dec = amountMode ? "整" : "";
	else if (amountMode) {
		const decs = dec.split("");
		for (let i = 0; i < dec.length && i < fraction.length; i++)
			decs[i] += fraction[i];
		dec = decs.join("");
	} else dec = "点" + dec;
	const ints = int.split("").reverse();
	for (let i = 0; i < int.length; i++)
		if (ints[i] !== "〇")
			ints[i] += digit[i % 4];
	for (let i = 0, j = 0; i < int.length && j < unit.length; i += 4, j++)
		if (ints[i] + ints[i + 1] + ints[i + 2] + ints[i + 3] !== "〇〇〇〇" || i === 0)
			ints[i] += unit[j];
	int = ints.reverse().join("");
	int = int.replaceAll(/〇+/g, "〇");
	for (let i = 0; i < unit.length; i++)
		int = int.replace("〇" + unit[i], unit[i]);
	if (int === "元") int = "〇元";
	int = int.replaceAll(/^一十/g, "十");
	let result = sign + int + dec;
	if (!amountMode)
		result = result.replaceAll("元", "").replaceAll("〇", "零");
	if (upperCase)
		for (let i = 0; i < upper.length; i++)
			result = result.replaceAll(lower[i], upper[i]);
	return result;
}

/**
 * 获取类似于播放量的通用数字加数级的紧凑十进制格式写法。
 * @param value - 数字。
 * @returns 通用数字加数级的紧凑十进制格式。
 */
export function getCompactDecimal(value: number | bigint) {
	value = typeof value === "number" ? BigInt(Math.trunc(value)) : value;
	let locale = useI18n().locale.value;
	if (locale === "yue") locale = "zht";
	const startsWithLang = (lang: string) => locale.startsWith(lang);
	const radix = ["zh", "ja", "ko"].some(startsWithLang) ? 10000n : 1000n;
	const units = {
		zhs: ["万", "亿", "兆", "京", "垓", "秭", "穰", "沟", "涧", "正", "载", "极", "恒河沙", "阿僧祇", "那由他", "不可思议", "无量", "大数"],
		zht: ["萬", "億", "兆", "京", "垓", "秭", "穰", "溝", "澗", "正", "載", "極", "恆河沙", "阿僧祇", "那由他", "不可思議", "無量", "大數"],
		ja: ["万", "億", "兆", "京", "垓", "𥝱", "穣", "溝", "澗", "正", "載", "極", "恒河沙", "阿僧祇", "那由他", "不可思議", "無量", "大数"],
		ko: ["만", "억", "조", "경", "해", "자", "양", "구", "간", "정", "재", "극", "항하사", "아승기", "나유타", "불가사의", "무량", "대수"],
		en: ["k", "M", "B", "T", "P", "E", "Z", "Y", "R", "Q"],
		// vi: ["V", "Ứ", "Tr", "K", "Giai", "T", "Nhương", "Câu", "Giản", "Chánh", "Tái", "Cực", "Hằng Hà Sa", "A Tăng Kỳ", "Na Do Tha", "Bất Khả Tư Nghị", "Vô Lượng", "Đại Sổ"], // In Ancient Vietnamese Number
		vi: ["N", "Tr", "T", "NT", "TrT", "TT", "NTT", "TrTT", "TTT", "NTTT"], // In Modern Vietnamese Number
		id: ["rb", "jt", "M", "T", "KT", "QI", "SX", "SP"],
		fr: ["k", "M", "Md", "Bn"],
	};
	const unit = units[keys(units).find(code => locale.startsWith(code)) ?? "en"];
	const spaceBeforeUnit = ["vi", "id"].some(startsWithLang) ? " " : "";

	let value_str = value + "";
	let index = 0;
	while ((value = value / radix) !== 0n) {
		if (unit[index] === undefined) return value >= 0n ? "∞" : "-∞";
		value_str = value + spaceBeforeUnit + unit[index++];
	}
	return value_str;
}

/**
 * 将输入值转换为至少两位的字符串，不足时补零。
 * @param num - 输入值（数字、大数或字符串），最好取值范围在 0~99 内。
 * @param radix - 可选进制 (2~36)，默认十进制。
 * @returns 至少两位的字符串。
 *
 * @example
 * ```javascript
 * padTo2Digit(5) // "05"
 * padTo2Digit("9") // "09"
 * padTo2Digit(15, 16) // "0f"
 * ```
 */
export function padTo2Digit(num: number | bigint | string, radix: number = 10) {
	return num.toString(radix).padStart(2, "0");
}
