/*
 * 滚动修复。
 * 使用 antfu/vue-router-better-scroller 来记住我们的自定义元素滚动。
 * plugin 参考：https://github.com/nuxt/movies/blob/main/plugins/scroll.client.ts
 * 行为参考：https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/pages/runtime/router.options.ts
 */

import { createRouterScroller } from "vue-router-better-scroller";
import type { RouteLocationNormalized, RouterScrollBehavior } from "vue-router";
import { useNuxtApp } from "#app/nuxt";
import { isChangingPage } from "#app/components/utils";
import { useRouter } from "#app/composables/router";
import { appPageTransition as defaultPageTransition } from "#build/nuxt.config.mjs";

type ScrollPosition = Awaited<ReturnType<RouterScrollBehavior>>;

export default defineNuxtPlugin(({ vueApp }) => {
	vueApp.use(createRouterScroller({
		selectors: {
			".viewport > .scroll-container .scroller"({ to, from, savedPosition }) {
				const nuxtApp = useNuxtApp();
				// @ts-expect-error untyped, nuxt-injected option
				const behavior = useRouter().options?.scrollBehaviorType ?? "auto";

				// By default when the returned position is falsy or an empty object, vue-router will retain the current scroll position
				// savedPosition is only available for popstate navigations (back button)
				let position: ScrollPosition = savedPosition || undefined;

				const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;

				// Scroll to top if route is changed by default
				if (!position && from && to && routeAllowsScrollToTop !== false && isChangingPage(to, from))
					position = { left: 0, top: 0 };

				// Hash routes on the same page, no page hook is fired so resolve here
				if (to.path === from.path) {
					if (from.hash && !to.hash)
						return { left: 0, top: 0 };

					if (to.hash)
						return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };

					// The route isn't changing so keep current scroll position
					return false;
				}

				// Wait for `page:transition:finish` or `page:finish` depending on if transitions are enabled or not
				const hasTransition = (route: RouteLocationNormalized) => !!(route.meta.pageTransition ?? defaultPageTransition);
				const hookToWait = hasTransition(from) && hasTransition(to) ? "page:transition:finish" : "page:finish";
				return new Promise(resolve => {
					nuxtApp.hooks.hookOnce(hookToWait, async () => {
						await new Promise(resolve => setTimeout(resolve, 0));
						if (to.hash)
							position = { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };

						resolve(position);
					});
				});
			},
		},
	}));
});

function _getHashElementScrollMarginTop(selector: string): number {
	try {
		const elem = document.querySelector(selector);
		if (elem)
			return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0);
	} catch {
			// ignore any errors parsing scrollMarginTop
	}
	return 0;
}
