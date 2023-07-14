<script setup lang="ts">
	const theme = Theme.theme;
	const palette = Theme.palette;
	const themeList = ["light", "dark", "system"] as const;
	const paletteList = [
		{ color: "pink", subtitle: "Kawaii forever" },
		{ color: "sky", subtitle: "Joga Maya" },
		{ color: "blue", subtitle: "Kafuu Chino" },
		{ color: "orange", subtitle: "Hoto Kokoa" },
		{ color: "purple", subtitle: "Tedeza Rize" },
		{ color: "green", subtitle: "Ujimatsu Chiya" },
	] as const;
</script>

<template>
	<Subheader icon="brightness_medium">{{ t.theme }}</Subheader>
	<PlayerVideoController :currentTime="30" :duration="110" :buffered="60" class="chip" />
	<section list>
		<RadioButton
			v-for="item in themeList"
			:key="item"
			v-model="theme"
			v-ripple
			:value="item"
		>{{ t[item] }}</RadioButton>
	</section>

	<Subheader icon="palette">{{ t.palette }}</Subheader>
	<section grid>
		<SettingsGridItem
			v-for="item in paletteList"
			:id="item.color"
			:key="item.color"
			v-model="palette"
			:title="t[item.color]"
			:class="['force-accent', item.color]"
		>
			<div class="content">
				<h3>{{ t[item.color] }}</h3>
				<p>{{ item.subtitle }}</p>
			</div>
		</SettingsGridItem>
	</section>

	<Subheader icon="wallpaper">{{ t.background }}</Subheader>
	<section list>
		<ToggleSwitch v-model="useAppSettingsStore().showCssDoodle" v-ripple icon="wallpaper">{{ t.animated_background }}</ToggleSwitch>
		<SettingsChipItem icon="wallpaper" trailingIcon="edit">自定义背景</SettingsChipItem>
	</section>
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

	.settings-chip-item {
		--size: small;
	}
	
	.content {
		@include square(100%);
		padding: 18px 20px;
		color: c(accent);

		> h3 {
			margin-bottom: calc(4px + 0.1cqh);
			font-size: calc(20px + 4cqw);
		}
		
		> p {
			font-size: calc(14px + 1cqw);
		}
	}
</style>
