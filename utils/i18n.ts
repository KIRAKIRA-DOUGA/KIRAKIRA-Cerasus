import { LocaleWithDefaultValue } from "locales/SChinese";

// 如果需要 <i18n> 块内语言字符串：useI18n({ useScope: "local" })
const handler = {
	get(_target: object, name: string) {
		if (name === "__v_isRef") return; // Vuex 干的好事。
		return useNuxtApp().$i18n.t(name);
	},
};
/** 获取本地化字符串对象。 */
export const t = new Proxy({}, handler) as LocaleWithDefaultValue & Readonly<Record<string, string>>;
Object.freeze(t);

/**
 * 获取当前语言名称。
 * @returns 当前语言名称。
 */
export function getCurrentLocale() {
	return (useNuxtApp().$i18n.locale as unknown as ComputedRef<string>).value;
}
