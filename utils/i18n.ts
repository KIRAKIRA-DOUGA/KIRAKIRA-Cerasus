import { ComputedRef } from "nuxt/dist/app/compat/capi";

const handler = {
	get(_target: object, name: string) {
		if (name === "__v_isRef") return; // Vuex 干的好事。
		return useI18n({ useScope: "local" }).t(name);
	},
};
/** 获取本地化字符串对象。 */
export const t = new Proxy({}, handler) as Record<string, string>;
Object.freeze(t);

/**
 * 获取当前语言名称。
 * @returns 当前语言名称。
 */
export function getCurrentLocale() {
	return (useNuxtApp().$i18n.locale as unknown as ComputedRef<string>).value;
}
