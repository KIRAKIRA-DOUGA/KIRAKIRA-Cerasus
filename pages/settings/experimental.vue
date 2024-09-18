<script setup lang="ts">
	// 允许同步的 kira cookie 设置
	const useLocalKiraCookieOptions = { isWatchCookieRef: true, isSyncSettings: false };
	// 直角模式
	const cookieSharpAppearanceMode = useKiraCookie<boolean>(COOKIE_KEY.sharpAppearanceModeCookieKey, SyncUserSettings.updateOrCreateUserSharpAppearanceModeSetting, useLocalKiraCookieOptions);
	// 扁平模式
	const cookieFlatAppearanceMode = useKiraCookie<boolean>(COOKIE_KEY.flatAppearanceModeCookieKey, SyncUserSettings.updateOrCreateUserFlatAppearanceModeSetting, useLocalKiraCookieOptions);
</script>

<template>
	<div>
		<InfoBar type="warning" title="警告">
			下列设置项皆为实验性功能，不保证稳定运行，不会多端同步。在尝试使用的同时，请务必注意安全！
			<br />
			开启本页面任意一设置项，则代表你已阅读、充分理解并同意以下附加条款：
			<br />
			“我自愿开启实验性功能，对于因其造成的财产损失或人身损伤，KIRAKIRA 无需承担任何责任。”

		<!-- TODO: 使用多语言 -->
		</InfoBar>
		<Subheader icon="palette">{{ t.appearance }}</Subheader>
		<section list>
			<ToggleSwitch v-model="useAppSettingsStore().showCssDoodle" v-ripple icon="wallpaper">{{ t.background.animated }}</ToggleSwitch>
			<ToggleSwitch v-model="cookieSharpAppearanceMode" v-ripple icon="square">{{ t.appearance.sharp_mode }}</ToggleSwitch>
			<ToggleSwitch v-model="cookieFlatAppearanceMode" v-ripple icon="layers">{{ t.appearance.flat_mode }}</ToggleSwitch>
		</section>
	</div>
</template>
