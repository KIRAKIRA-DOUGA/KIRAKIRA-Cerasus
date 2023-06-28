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
	const fraction = ["角", "分", "厘", "毫", "丝", "忽", "微", "纤", "沙", "尘", "埃", "渺", "漠", "模糊", "逡巡", "须臾", "瞬息", "弹指", "刹那", "六德"];
	const arabic = "0123456789";
	const lower = "〇一二三四五六七八九元十百千万亿";
	const upper = "零壹贰叁肆伍陆柒捌玖圆拾佰仟萬億";
	const unit = ["元", "万", "亿", "兆", "京", "垓", "秭", "壤", "沟", "涧", "正", "载", "极", "恒河沙", "阿僧祇", "那由他", "不可思议", "净", "清", "空", "虚"];
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
 * 获取类似于播放量的通用数字加数级的写法。
 * @param value - 数字。
 * @returns 通用数字加数级。
 */
export function getWatchCount(value: number) {
	let count = value | 0;
	let count_str = count + "";
	if ((count = count / 10000 | 0) !== 0)
		count_str = count + "万";
	if ((count = count / 10000 | 0) !== 0)
		count_str = count + "亿";
	return count_str;
}
