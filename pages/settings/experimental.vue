<script setup lang="ts">
	import { sharpAppearanceModeCookieKey, cookieBinding, flatAppearanceModeCookieKey } from "~/modules/theme/cookieBinding";

	const userSettingsCookieBasicOption = { expires: new Date("9999/9/9"), sameSite: true, httpOnly: false, watch: true };

	const selfUserInfoStore = useSelfUserInfoStore();
	const appSettingsStore = useAppSettingsStore();
	const isAllowSyncThemeSettings = computed(() => appSettingsStore.isAllowSyncThemeSettings && selfUserInfoStore.isLogined);

	/**
	 * 发送后端请求，更新用户设置
	 * @param updateOrCreateUserSettingsRequest 用户发生修改的设置
	 */
	function updateUserSetting(updateOrCreateUserSettingsRequest: UpdateOrCreateUserSettingsRequestDto) {
		api.user.updateUserSettings(updateOrCreateUserSettingsRequest);
	}

	// 直角模式
	const cookieSharpAppearanceMode = useCookie<boolean>(sharpAppearanceModeCookieKey, userSettingsCookieBasicOption);
	watch(cookieSharpAppearanceMode, sharpAppearanceMode => { // 当设置值发送改变时，发送后端请求，并触发 cookieBinding 更新页面样式
		if (process.client) {
			window.localStorage.setItem(sharpAppearanceModeCookieKey, `${sharpAppearanceMode}`); // WARN useStorage 更新数据会导致 cookieBinding 中获取到的 localStorage 数据不是最新数据，可能是 vue 响应式延迟
			if (isAllowSyncThemeSettings.value) { // 如果允许同步样式设置，则发送后端请求，非阻塞
				const updateOrCreateUserSettingsRequest: UpdateOrCreateUserSettingsRequestDto = {
					coloredSideBar: cookieSharpAppearanceMode.value,
				};
				updateUserSetting(updateOrCreateUserSettingsRequest);
			}
			cookieBinding();
		}
	});

	// 扁平模式
	const cookieFlatAppearanceMode = useCookie<boolean>(flatAppearanceModeCookieKey, userSettingsCookieBasicOption);
	watch(cookieFlatAppearanceMode, flatAppearanceMode => { // 当设置值发送改变时，发送后端请求，并触发 cookieBinding 更新页面样式
		if (process.client) {
			window.localStorage.setItem(flatAppearanceModeCookieKey, `${flatAppearanceMode}`); // WARN useStorage 更新数据会导致 cookieBinding 中获取到的 localStorage 数据不是最新数据，可能是 vue 响应式延迟
			if (isAllowSyncThemeSettings.value) { // 如果允许同步样式设置，则发送后端请求，非阻塞
				const updateOrCreateUserSettingsRequest: UpdateOrCreateUserSettingsRequestDto = {
					coloredSideBar: cookieFlatAppearanceMode.value,
				};
				updateUserSetting(updateOrCreateUserSettingsRequest);
			}
			cookieBinding();
		}
	});

	// 发生用户登录事件时，要手动触发 cookie 更新（cookie 更新会触发 cookieBinding 更新页面样式，并且 nuxt 响应式 cookie 也绑定到一些开关上，此处也会在用户登录后更改开关的状态）
	useListen("user:login", () => {
		cookieSharpAppearanceMode.value = useCookie<boolean>(sharpAppearanceModeCookieKey, userSettingsCookieBasicOption).value; // TODO: nuxt 3.10 以后可以使用 refreshCookie 方法刷新 cookie
		cookieFlatAppearanceMode.value = useCookie<boolean>(flatAppearanceModeCookieKey, userSettingsCookieBasicOption).value; // TODO: nuxt 3.10 以后可以使用 refreshCookie 方法刷新 cookie
	});
</script>

<template>
	<Subheader icon="error" class="danger">
		下列设置项皆为实验性功能，不保证稳定运行。在尝试使用的同时，请务必注意安全！
		<br />
		开启本页面任意一设置项，则代表你已阅读、充分理解并同意以下附加条款：
		<br />
		“我自愿开启实验性功能，对于因其造成的财产损失或人身损伤，KIRAKIRA 无需承担任何责任。”

		<!-- TODO: 使用多语言 -->
	</Subheader>
	<Subheader icon="palette">{{ t.appearance }}</Subheader>
	<section list>
		<ToggleSwitch v-model="useAppSettingsStore().showCssDoodle" v-ripple icon="wallpaper">{{ t.background.animated }}</ToggleSwitch>
		<ToggleSwitch v-model="cookieSharpAppearanceMode" v-ripple icon="square">{{ t.appearance.sharp_mode }}</ToggleSwitch>
		<ToggleSwitch v-model="cookieFlatAppearanceMode" v-ripple icon="layers">{{ t.appearance.flat_mode }}</ToggleSwitch>
	</section>
</template>

<style scoped lang="scss">
	.danger :deep(*) {
		color: c(red);
		font-weight: 900;
	}
</style>
