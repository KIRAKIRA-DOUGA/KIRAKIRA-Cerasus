/**
 * 根据指定的格式来格式化日期时间。
 * @param date - 日期时间对象。
 * @param format - 格式化字符串。
 * @returns 格式化后的字符串。
 */
export function formatDate(date: Date, format: string) {
	if (!date) return "";
	const object = {
		"M+": date.getMonth() + 1, // month
		"d+": date.getDate(), // day
		"h+": date.getHours(), // hour
		"m+": date.getMinutes(), // minute
		"s+": date.getSeconds(), // second
		"q+": Math.floor((date.getMonth() + 3) / 3), // quarter
		S: date.getMilliseconds(), // millisecond
	};
	if (/(y+)/.test(format))
		format = format.replace(RegExp.$1, (date.getFullYear() + "").slice(4 - RegExp.$1.length));
	for (const [key, value] of Object.entries(object))
		if (new RegExp("(" + key + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? String(value) : ("00" + value).slice(String(value).length));
	return format;
}

/**
 * 根据当前语言的规定格式来格式化日期时间。
 * @param date - 日期时间对象。
 * @returns 格式化后的字符串。
 */
export function formatDateWithLocale(
	date: Date | null,
	{
		time = false,
	}: {
		/** 是否同时显示时间？ */
		time?: boolean;
	} = {},
) {
	const locale = getCurrentLocaleLangCode();
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		...(!time ? {} : {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		}),
	};
	let result = Intl.DateTimeFormat(locale, options).format(date ?? new Date());
	if (date === null) result = result.replaceAll(/\d/g, "‒");
	return result;
}

/**
 * 生成符合 Cloudflare 风格的过期日期字符串，例如："2024-03-17T13:47:28Z"
 * @param expiresIn 有效期限，单位：秒。
 * @returns 符合 Cloudflare 风格的过期日期字符串
 */
export function getCloudflareRFC3339ExpiryDateTime(expiresIn: number): string {
	return (new Date((new Date()).getTime() + expiresIn * 1000)).toISOString().replace(/\.\d{3}/, "");
}
