/**
 * 半角转全角。
 * @param halfwidth - 字符串。
 * @returns - 全角字符串。
 */
export function fullwidth(halfwidth: string) {
	return Array.from(halfwidth, char =>
		char === " " ? "　" :
		char.codePointAt(0)! < "!".codePointAt(0)! || char.codePointAt(0)! > "~".codePointAt(0)! ? char :
		String.fromCodePoint(char.codePointAt(0)! - "!".codePointAt(0)! + "！".codePointAt(0)!)).join("");
}

/**
 * 全角转半角。
 * @param fullwidth - 字符串。
 * @returns - 全角字符串。
 */
export function halfwidth(fullwidth: string) {
	return Array.from(fullwidth, char =>
		char === "　" ? " " :
		char.codePointAt(0)! < "！".codePointAt(0)! || char.codePointAt(0)! > "～".codePointAt(0)! ? char :
		String.fromCodePoint(char.codePointAt(0)! - "！".codePointAt(0)! + "!".codePointAt(0)!)).join("");
}

const utf8Encoder = new TextEncoder();

/**
 * 为方便后端支持 UTF-8 格式文字而编码字符串，并转换为其数组的字符串形式。
 * @param text - 字符串。
 * @returns 编码为 UTF-8 格式的字符值数组的字符串。
 */
export function encodeUtf8(text: string) {
	return utf8Encoder.encode(text).toString();
}
