import type { Nuxt } from "nuxt/schema";

/**
 * 获取并操作 App 的 head。
 * @param nuxt - Nuxt App。
 * @returns App 全局 head。
 */
export function useNuxtHead(nuxt: Nuxt) {
	return nuxt.options.app.head ??= [] as typeof nuxt.options.app.head;
}
