/*
 * 根据 URL 参数临时设置当前语言。
 * 主要用于 SEO 优化。
 */

export default defineNuxtRouteMiddleware(to => {
	if (!to.query.lang)
		return;
	const i18n = useNuxtApp().$i18n;
	if (i18n.localeCodes.value.includes(to.query.lang as never))
		i18n.locale.value = to.query.lang as never;
});
