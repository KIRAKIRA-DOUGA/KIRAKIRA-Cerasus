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
