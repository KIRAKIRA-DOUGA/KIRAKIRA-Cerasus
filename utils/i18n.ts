import { I18nArgsFunction, LocaleWithDefaultValue } from "locales/types";

// 如果需要 <i18n> 块内语言字符串：useI18n({ useScope: "local" })
const getHandler = (...parents: string[]) => ({
	get(_target: object, name: string) {
		if (name === "__v_isRef") return; // Vuex 干的好事。
		const i18n = useNuxtApp().$i18n;
		const getParentsPrefix = (...prefixes: string[]) => prefixes.length ? prefixes.join(".") : "";
		const value = i18n.t(getParentsPrefix(...parents, name) + name);
		const getWithArgsFunction = (...prefixes: string[]) =>
			(...args: Readable[]) =>
				i18n.t(getParentsPrefix(...prefixes), typeof args[0] === "object" ? args[0] : args);
		const withArgsProxy = new Proxy(getWithArgsFunction(...parents, name), {
			get(_target, name2): unknown {
				if (name2 === Symbol.toPrimitive || name2 === "toString")
					return () => value;
				if (typeof name2 === "string")
					return new Proxy(getWithArgsFunction(...parents, name2), getHandler(...parents, name2));
			},
		});
		return withArgsProxy;
	},
});
/** 获取本地化字符串对象。 */
export const t = new Proxy({}, getHandler()) as LocaleWithDefaultValue & Readonly<Record<string, string & I18nArgsFunction>>;
Object.freeze(t);

/**
 * 获取当前语言名称。
 * @returns 当前语言名称。
 */
export function getCurrentLocale() {
	return (useNuxtApp().$i18n.locale as unknown as ComputedRef<string>).value;
}
