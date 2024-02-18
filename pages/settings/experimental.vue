<script setup lang="ts">
	import { sharpAppearanceModeCookieKey, flatAppearanceModeCookieKey } from "modules/theme/cookieBinding";
	import { useKiraCookie } from "modules/theme/composables";

	// 直角模式
	const cookieSharpAppearanceMode = useKiraCookie<boolean>(sharpAppearanceModeCookieKey, updateOrCreateUserSharpAppearanceModeSetting, true, true);
	/**
	 * 发送更新用户的 SharpAppearanceMode 设置的请求
	 * @param cookieValue SharpAppearanceMode 的新的值
	 */
	function updateOrCreateUserSharpAppearanceModeSetting(cookieValue: boolean) {
		const updateOrCreateUserSettingsRequest: UpdateOrCreateUserSettingsRequestDto = {
			sharpAppearanceMode: cookieValue,
		};
		api.user.updateUserSettings(updateOrCreateUserSettingsRequest);
	}

	// 扁平模式
	const cookieFlatAppearanceMode = useKiraCookie<boolean>(flatAppearanceModeCookieKey, updateOrCreateUserFlatAppearanceModeSetting, true, true);
	/**
	 * 发送更新用户的 FlatAppearanceMode 设置的请求
	 * @param cookieValue FlatAppearanceMode 的新的值
	 */
	function updateOrCreateUserFlatAppearanceModeSetting(cookieValue: boolean) {
		const updateOrCreateUserSettingsRequest: UpdateOrCreateUserSettingsRequestDto = {
			sharpAppearanceMode: cookieValue,
		};
		api.user.updateUserSettings(updateOrCreateUserSettingsRequest);
	}
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
