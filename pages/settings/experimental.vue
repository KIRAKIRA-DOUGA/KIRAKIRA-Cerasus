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
		<InfoBar type="warning" :title="t.severity.warning">
			{{ t.settings.experimental_warning }}
		</InfoBar>
		<Subheader icon="palette">{{ t.appearance }}</Subheader>
		<section list>
			<ToggleSwitch v-model="useAppSettingsStore().showCssDoodle" v-ripple icon="wallpaper">{{ t.background.animated }}</ToggleSwitch>
			<ToggleSwitch v-model="cookieSharpAppearanceMode" v-ripple icon="square">{{ t.appearance.sharp_mode }}</ToggleSwitch>
			<ToggleSwitch v-model="cookieFlatAppearanceMode" v-ripple icon="layers">{{ t.appearance.flat_mode }}</ToggleSwitch>
		</section>
	</div>
</template>
