/**
 * 获取当前语言名称。
 * @returns 当前语言名称。
 */
export function getCurrentLocale() {
	return useNuxtApp().$i18n.locale.value;
}

/**
 * 获取当前语言的语言代码。（主要是为了单独处理简体中文、繁体中文和粤语。）
 * // WARN: 修改该函数需要请提醒后端同步修改
 * @param locale - 手动指定语言代码，留空时会自动获取。
 * @param redirectDialect - 是否重定向方言到基础语言？（例如粤语会重定向到香港地区繁体中文。）这是因为这些方言的内置本地化处理函数支持率太低太烂。
 * @returns 语言代码。
 */
export function getCurrentLocaleLangCode(locale?: string, redirectDialect: boolean = false) {
	locale ||= getCurrentLocale();
	return locale === "zhs" ? "zh-Hans-CN" :
		locale === "zht" ? "zh-Hant-TW" :
		redirectDialect && locale === "yue" ? "zh-Hant-HK" :
		locale;
}

/**
 * 获取目标语言在当前显示语言中的名称。
 * @param targetLocale - 目标语言。
 * @param displayLocale - 当前显示语言，留空时会自动获取。
 * @returns 语言名称。
 * @example
 * ```typescript
 * console.log(getLocaleName("en", "zh")); // "英语"
 * console.log(getLocaleName("zh", "en")); // "Chinese"
 * ```
 */
export function getLocaleName(targetLocale: string | Intl.Locale, displayLocale?: string | Intl.Locale) {
	if (targetLocale instanceof Intl.Locale) targetLocale = targetLocale.toString();
	if (displayLocale instanceof Intl.Locale) displayLocale = displayLocale.toString();
	targetLocale = targetLocale === "zhs" ? "zh-Hans" : targetLocale === "zht" ? "zh-Hant" : targetLocale;
	displayLocale = getCurrentLocaleLangCode(displayLocale);
	const fallbackLocales = [displayLocale];
	if (displayLocale === "yue") fallbackLocales.push("zh-Hant-HK");
	return new Intl.DisplayNames(fallbackLocales, { type: "language" }).of(targetLocale)!;
}

/**
 * 处于语境翻译工具模式？
 * @param locale - 指示当前语言环境。
 * @returns 是否处于语境翻译工具模式。
 */
export function isInContextLocalization(locale: string) {
	return locale === "ii";
}
