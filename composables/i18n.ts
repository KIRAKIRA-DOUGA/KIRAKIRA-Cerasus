const handler = {
	get(_target: object, name: string) {
		if (name === "__v_isRef") return; // Vuex 干的好事。
		return useI18n({ useScope: "local" }).t(name);
	},
};
/** 获取本地化字符串对象。 */
export const t = new Proxy({}, handler) as Record<string, string>;
Object.freeze(t);
