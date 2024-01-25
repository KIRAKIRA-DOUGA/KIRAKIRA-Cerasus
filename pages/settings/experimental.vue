<script setup lang="ts">
	/**
	 * // TODO 当设置值发送改变时，发送后端请求
	 */
	function updateShowCssDoodleUserSetting() {
		const updateOrCreateUserSettingsRequest: UpdateOrCreateUserSettingsRequestDto = {
			showCssDoodle: useAppSettingsStore().showCssDoodle,
		};
		const showCssDoodleCookieKey = "show-css-doodle";
		useCookie(showCssDoodleCookieKey, { expires: new Date("9999/9/9"), sameSite: true, httpOnly: false }).value = `${useAppSettingsStore().showCssDoodle}`;
		api.user.updateUserSettings(updateOrCreateUserSettingsRequest);
	}
	watch(() => useAppSettingsStore().showCssDoodle, updateShowCssDoodleUserSetting);

	/**
	 * // TODO 当设置值发送改变时，发送后端请求
	 */
	function updateSharpAppearanceModeUserSetting() {
		const updateOrCreateUserSettingsRequest: UpdateOrCreateUserSettingsRequestDto = {
			sharpAppearanceMode: useAppSettingsStore().sharpAppearanceMode,
		};
		const sharpAppearanceModeCookieKey = "sharp-appearance-mode";
		useCookie(sharpAppearanceModeCookieKey, { expires: new Date("9999/9/9"), sameSite: true, httpOnly: false }).value = `${useAppSettingsStore().sharpAppearanceMode}`;
		api.user.updateUserSettings(updateOrCreateUserSettingsRequest);
	}
	watch(() => useAppSettingsStore().sharpAppearanceMode, updateSharpAppearanceModeUserSetting);

	/**
	 * // TODO 当设置值发送改变时，发送后端请求
	 */
	function updateFlatAppearanceModeUserSetting() {
		const updateOrCreateUserSettingsRequest: UpdateOrCreateUserSettingsRequestDto = {
			flatAppearanceMode: useAppSettingsStore().flatAppearanceMode,
		};
		const flatAppearanceModeCookieKey = "flat-appearance-mode";
		useCookie(flatAppearanceModeCookieKey, { expires: new Date("9999/9/9"), sameSite: true, httpOnly: false }).value = `${useAppSettingsStore().flatAppearanceMode}`;
		api.user.updateUserSettings(updateOrCreateUserSettingsRequest);
	}
	watch(() => useAppSettingsStore().flatAppearanceMode, updateFlatAppearanceModeUserSetting);
</script>

<template>
	<Subheader icon="error" class="danger">
		下列设置项皆为实验性功能，不保证稳定运行。在尝试使用的同时，请务必注意安全！
		<br />
		开启本页面任意一设置项，则代表你已阅读、充分理解并同意以下附加条款：
		<br />
		“我自愿开启实验性功能，对于因其造成的财产损失或人身损伤，KIRAKIRA 无需承担任何责任。”

		<!-- TODO 使用多语言 -->
	</Subheader>
	<Subheader icon="palette">{{ t.appearance }}</Subheader>
	<section list>
		<ToggleSwitch v-model="useAppSettingsStore().showCssDoodle" v-ripple icon="wallpaper">{{ t.background.animated }}</ToggleSwitch>
		<ToggleSwitch v-model="useAppSettingsStore().sharpAppearanceMode" v-ripple icon="square">{{ t.appearance.sharp_mode }}</ToggleSwitch>
		<ToggleSwitch v-model="useAppSettingsStore().flatAppearanceMode" v-ripple icon="layers">{{ t.appearance.flat_mode }}</ToggleSwitch>
	</section>
</template>

<style scoped lang="scss">
	.danger :deep(*) {
		color: c(red);
		font-weight: 900;
	}
</style>
