import safeRegex from "safe-regex";

/**
 * 判断一个字符串是否看起来像正则表达式。
 * @param str - 待测试字符串。
 * @returns 字符串是否看起来像正则表达式？
 */
export function doesLookLikeRegexString(str: string) {
	// 1. 基本格式：以斜杠开头、斜杠结尾，可跟 0~6 位正则标志
	const regexSyntax = /^\/(.+)\/([gimsuy]*)$/;
	const match = str.match(regexSyntax);
	if (!match) return false;

	// 2. 校验 pattern 和 flags 是否能真正构造出一个 RegExp
	try {
		new RegExp(match[1], match[2]);
		return true;
	} catch {
		return false;
	}
}

/**
 * 检测一个正则表达式是否非法。
 * @param str - 待检测的正则表达式字符串。
 * @returns 正则表达式是否非法？
 */
export function isInvalidRegexString(str: string) {
	try {
		return !safeRegex(str);
	} catch (error) {
		console.warn("WARN", "WARNING", "Error in isInvalidRegexString, default result is 'true' (your regex is invalid)", error);
		return true;
	}
}
