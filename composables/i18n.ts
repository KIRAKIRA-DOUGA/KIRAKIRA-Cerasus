/**
 * 获取本地化字符串对象。
 * @returns 本地化字符串对象。
 */
export function locale() {
	return useI18n({ useScope: "local" }).t;
}
