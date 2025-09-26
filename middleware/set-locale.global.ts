/*
 * 用户未登录时根据 URL 参数设置语言。
 * 用于 SEO 优化。
 */

export default defineNuxtRouteMiddleware(to => {
	if (!to.query.lang)
		return;
	const i18n = useNuxtApp().$i18n;
	if (i18n.localeCodes.value.includes(to.query.lang as never))
		i18n.locale.value = to.query.lang as never;
});
