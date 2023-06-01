<script setup lang="ts">
	const theme = Theme.theme;
	const palette = Theme.palette;
	const themeList = ["light", "dark", "system"] as const;
	const paletteList = ["pink", "sky", "blue", "orange", "purple", "green"] as const;
</script>

<template>
	<Subheader icon="brightness_medium">{{ t.theme }}</Subheader>
	<PlayerVideoController :currentTime="30" :duration="110" :buffered="60" class="chip" />
	<div class="chip radio-group">
		<RadioButton
			v-for="item in themeList"
			:key="item"
			v-model="theme"
			v-ripple
			:value="item"
		>{{ t[item] }}</RadioButton>
	</div>
	<Subheader icon="palette">{{ t.palette }}</Subheader>
	<div class="chip radio-group">
		<RadioButton
			v-for="item in paletteList"
			:key="item"
			v-model="palette"
			v-ripple
			:value="item"
		>{{ t[item] }}</RadioButton>
	</div>
	<Subheader icon="placeholder">{{ t.background }}</Subheader>
	<div class="chip radio-group">
		<ToggleSwitch v-model="appConfig.showCssDoodle" v-ripple>{{ t.animated_background }}</ToggleSwitch>
	</div>
</template>

<style scoped lang="scss">
	.player-video-controller {
		&,
		*,
		::before,
		::after {
			pointer-events: none !important;
		}
	}
</style>
