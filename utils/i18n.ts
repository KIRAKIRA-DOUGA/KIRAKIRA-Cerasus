import { I18nArgsFunction, LocaleWithDefaultValue } from "locales/types";

// 如果需要 <i18n> 块内语言字符串：useI18n({ useScope: "local" })
/** 获取本地化字符串对象。 */
export const t = new Proxy({}, {
	get(_target, rootName) {
		if (rootName === "__v_isRef" || typeof rootName === "symbol") return; // Vuex 干的好事。
		const i18n = useNuxtApp().$i18n;
		const getParentsPrefix = (...prefixes: string[]) => prefixes.length ? prefixes.join(".") : "";
		const getWithArgsFunction = (...prefixes: string[]) =>
			(...args: Readable[]) =>
				i18n.t(getParentsPrefix(...prefixes), typeof args[0] === "object" ? args[0] : args);
		const getWithArgsProxy = (...parents: string[]) => new Proxy(getWithArgsFunction(rootName, ...parents), {
			get(_target, currentName): unknown {
				if (currentName === Symbol.toPrimitive || currentName === "toString")
					return () => i18n.t(getParentsPrefix(rootName, ...parents));
				if (typeof currentName === "string")
					return getWithArgsProxy(...parents, currentName);
			},
		});
		return getWithArgsProxy();
	},
}) as LocaleWithDefaultValue & Readonly<Record<string, string & I18nArgsFunction>>;
Object.freeze(t);

/**
 * 获取当前语言名称。
 * @returns 当前语言名称。
 */
export function getCurrentLocale() {
	return (useNuxtApp().$i18n.locale as unknown as ComputedRef<string>).value;
}
