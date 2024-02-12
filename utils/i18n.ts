import type { TranslateOptions } from "@intlify/core-base";
import type { I18nArgsFunction, LocaleWithDefaultValue } from "locales/types";

// 如果需要 <i18n> 块内语言字符串：useI18n({ useScope: "local" })

const getProxy = (options: TranslateOptions | typeof targetFunction) =>
	new Proxy(options, {
		get(target, rootName) {
			if (rootName === "__v_isRef" || typeof rootName === "symbol") return; // Vuex 干的好事。
			if (typeof target === "function") target = {};
			const getParentsPrefix = (...prefixes: string[]) => prefixes.length ? prefixes.join(".") : "";
			const i18n = useNuxtApp().$i18n;
			const getDeclarationInfo = (...keys: string[]) => {
				const key = getParentsPrefix(...keys);
				const raw = i18n.tm(key) as string | object;
				return {
					isNamespace: typeof raw === "object" && !!Object.keys(raw).length,
					includesInterpolation: typeof raw === "string" && raw.includes("{"),
					missing: typeof raw === "object" && !Object.keys(raw).length,
					missingDefault: typeof raw === "object" && !("_" in raw),
					key,
					raw,
				};
			};
			const getMissingKey = (key: string, getAFunction: boolean = true) => {
				const displayValue = `<${key}>`;
				if (!getAFunction) return displayValue;
				const missingKey = () => missingKey;
				missingKey.toString = () => displayValue;
				return missingKey;
			};
			const translate = (keys: string[], list: Readable[] = []) => {
				const { isNamespace, missingDefault } = getDeclarationInfo(...keys);
				if (missingDefault) return getMissingKey(getParentsPrefix(...keys), false);
				const key = !isNamespace ? getParentsPrefix(...keys) : getParentsPrefix(...keys, "_");
				return i18n.t(key, typeof list[0] === "object" ? list[0] : list, {
					fallbackWarn: false,
					missingWarn: false,
					...target,
				});
			};
			const getWithArgsFunction = (...prefixes: string[]) =>
				(...args: Readable[]) =>
					translate(prefixes, typeof args[0] === "object" ? args[0] : args);
			const getWithArgsProxy = (...parents: string[]) => {
				const keys = [rootName, ...parents];
				const info = getDeclarationInfo(...keys);
				if (info.missing)
					return getMissingKey(info.key);
				else if (!info.includesInterpolation && !info.isNamespace)
					return translate(keys);
				else return new Proxy(getWithArgsFunction(...keys), {
					get(_target, currentName): unknown {
						if (currentName === Symbol.toPrimitive || currentName === "toString")
							return () => translate(keys);
						if (typeof currentName === "string")
							return getWithArgsProxy(...parents, currentName);
					},
				});
			};
			return getWithArgsProxy();
		},
	}) as LocaleDictionary;
const targetFunction = (options?: number | bigint | TranslateOptions) => {
	if (options === undefined) options = {};
	else if (typeof options === "number" || typeof options === "bigint") options = { plural: Number(options) };
	return getProxy(options);
};
type LocaleDictionary = LocaleWithDefaultValue & Readonly<Record<string, string & I18nArgsFunction>>;
/** 获取本地化字符串对象。 */
export const t = getProxy(targetFunction) as LocaleDictionary & typeof targetFunction;
Object.freeze(t);

/**
 * 获取当前语言名称。
 * @returns 当前语言名称。
 */
export function getCurrentLocale() {
	return useNuxtApp().$i18n.locale.value;
}

/**
 * 获取当前语言的语言代码。（主要是为了单独处理简体中文和繁体中文。）
 * @param locale - 手动指定语言代码，留空时会自动获取。
 * @returns 语言代码。
 */
export function getCurrentLocaleLangCode(locale?: string) {
	locale ||= getCurrentLocale();
	return locale === "zhs" ? "zh-Hans-CN" : locale === "zht" ? "zh-Hant-TW" : locale;
}
