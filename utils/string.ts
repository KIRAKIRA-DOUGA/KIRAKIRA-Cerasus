/**
 * 半角转全角。
 * @param halfWidth - 字符串。
 * @returns - 全角字符串。
 */
export function fullWidth(halfWidth: string) {
	return Array.from(halfWidth, char =>
		char === " " ? "　" :
		char.codePointAt(0)! < "!".codePointAt(0)! || char.codePointAt(0)! > "~".codePointAt(0)! ? char :
		String.fromCodePoint(char.codePointAt(0)! - "!".codePointAt(0)! + "！".codePointAt(0)!)).join("");
}
