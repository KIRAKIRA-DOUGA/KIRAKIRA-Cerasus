/**
 * 标准化数字。拒绝傻逼科学计数法。
 * @param num - 数字。
 * @returns 标准化的数字。
 */
export function normalizeNumber(num: number | bigint | string) {
	let s = String(num);
	const regexp = (num: string) => num.trim().toLowerCase().replace(/\+/g, "").replace(/(?<=e|-|^)0*|(?<=\.[^e]*)0*(?=e|$)/g, "").replace(/(?<=-|^)\./, "0.").replace(/\.(?=e|$)/g, "");
	s = regexp(s);
	if (s.includes("e")) {
		let [base, exp_str] = s.split("e");
		const exp = +exp_str;
		const move = (float: string, direct: number) => {
			float += "";
			let dot = float.indexOf(".");
			if (dot === -1) dot = float.length;
			dot = (direct > 0 ? dot + 1 : dot - 1);
			float = float.replace(".", "");
			if (dot === float.length) void 0;
			else if (dot > float.length) float += "0";
			else if (dot === 0) float = "0." + float;
			else float = float.slice(0, dot) + "." + float.slice(dot);
			return float;
		};
		for (let i = 0; i < Math.abs(exp); i++) base = move(base, exp);
		s = regexp(base);
	}
	if (s === "-" || s === "") s = "0";
	return s;
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
	int = int.replace(/〇+/g, "〇");
	for (let i = 0; i < unit.length; i++)
		int = int.replace("〇" + unit[i], unit[i]);
	if (int === "元") int = "〇元";
	int = int.replace(/^一十/g, "十");
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
	const { locale } = useI18n();
	const startsWithLang = (lang: string) => locale.value.startsWith(lang);
	const radix = ["zh", "ja", "ko", "vi"].some(startsWithLang) ? 10000n : 1000n;
	const units = {
		zhs: ["万", "亿", "兆", "京", "垓", "秭", "穰", "沟", "涧", "正", "载", "极", "恒河沙", "阿僧祇", "那由他", "不可思议", "无量", "大数"],
		zht: ["萬", "億", "兆", "京", "垓", "秭", "穰", "溝", "澗", "正", "載", "極", "恆河沙", "阿僧祇", "那由他", "不可思議", "無量", "大數"],
		ja: ["万", "億", "兆", "京", "垓", "𥝱", "穣", "溝", "澗", "正", "載", "極", "恒河沙", "阿僧祇", "那由他", "不可思議", "無量", "大数"],
		ko: ["만", "억", "조", "경", "해", "자", "양", "구", "간", "정", "재", "극", "항하사", "아승기", "나유타", "불가사의", "무량", "대수"],
		en: ["k", "M", "B", "T", "P", "E", "Z", "Y", "R", "Q"],
		vi: ["V", "Ứ", "Tr", "K", "Giai", "T", "Nhương", "Câu", "Giản", "Chánh", "Tái", "Cực", "Hằng Hà Sa", "A Tăng Kỳ", "Na Do Tha", "Bất Khả Tư Nghị", "Vô Lượng", "Đại Sổ"],
		// vi: ["N", "Tr", "T", "NT", "TrT", "TT", "NTT", "TrTT", "TTT", "NTTT"], // In Modern Vietnamese Number
		id: ["rb", "jt", "M", "T", "KT", "QI", "SX", "SP"],
	};
	const unit = units[keys(units).find(code => locale.value.startsWith(code)) ?? "en"];
	const spaceBeforeUnit = ["vi", "id"].some(startsWithLang) ? " " : "";

	let value_str = value + "";
	let index = 0;
	while ((value = value / radix) !== 0n) {
		if (unit[index] === undefined) return value >= 0n ? "∞" : "-∞";
		value_str = value + spaceBeforeUnit + unit[index++];
	}
	return value_str;
}
