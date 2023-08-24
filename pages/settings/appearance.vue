<script setup lang="ts">
	const getPaletteImage = (name: string) => {
		const palettes = import.meta.glob<typeof import("*.webp")>("/assets/images/palettes/*", { eager: true });
		return palettes[`/assets/images/palettes/${name}.webp`].default;
	};

	const { theme, palette, actualTheme } = Theme;
	const themeList = ["light", "dark", "system"] as const;
	const paletteList = [
		{ color: "pink", subtitle: "Kawaii Forever" },
		{ color: "sky", subtitle: "Jouga Maya" },
		{ color: "blue", subtitle: "Kafuu Chino" },
		{ color: "orange", subtitle: "Hoto Kokoa" },
		{ color: "purple", subtitle: "Tedeza Rize" },
		{ color: "green", subtitle: "Ujimatsu Chiya" },
	] as const;
	const paletteSection = ref<HTMLElement>();

	onMounted(() => {
		if (paletteSection.value)
			for (const item of paletteSection.value.children) {
				item.classList.remove("light", "dark");
				item.classList.add(actualTheme.value);
			}
	});
</script>

<template>
	<Subheader icon="brightness_medium">{{ t.scheme }}</Subheader>
	<PlayerVideoController :currentTime="30" :duration="110" :buffered="60" class="chip" />
	<section grid>
		<SettingsGridItem
			v-for="item in themeList"
			:id="item"
			:key="item"
			v-model="theme"
			:title="t[item]"
		>
			<LogoThemePreview :theme="item" :accent="palette" />
		</SettingsGridItem>
	</section>

	<Subheader icon="palette">{{ t.palette }}</Subheader>
	<section ref="paletteSection" grid>
		<SettingsGridItem
			v-for="item in paletteList"
			:id="item.color"
			:key="item.color"
			v-model="palette"
			:title="t[item.color]"
			class="force-color"
			:class="[item.color, actualTheme]"
		>
			<div class="content">
				<img :src="getPaletteImage(item.color)" alt="Is the Order a Rabbit?" />
				<div class="overlay light"></div>
				<div class="overlay color"></div>
				<Icon name="palette" />
				<h3>{{ t[item.color] }}</h3>
				<p>{{ item.subtitle }}</p>
			</div>
		</SettingsGridItem>
	</section>

	<Subheader icon="wallpaper">{{ t.background }}</Subheader>
	<section list>
		<ToggleSwitch v-model="useAppSettingsStore().showCssDoodle" v-ripple icon="wallpaper">{{ t.animated_background }}</ToggleSwitch>
		<SettingsChipItem icon="wallpaper" trailingIcon="edit">{{ t.custom_background }}</SettingsChipItem>
	</section>

	<Subheader icon="more_horiz">其它</Subheader>
	<section list>
		<ToggleSwitch v-model="useAppSettingsStore().sharpAppearanceMode" v-ripple icon="square">直角样式</ToggleSwitch>
		<ToggleSwitch v-model="useAppSettingsStore().flatAppearanceMode" v-ripple icon="layers">扁平样式</ToggleSwitch>
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

	.settings-grid-item:deep {
		.ripple-circle {
			z-index: 4;
			background-color: c(accent-ripple);
		}
	}

	.content {
		@include square(100%);
		padding: 18px 20px;
		color: c(accent);

		> * {
			position: relative;
		}

		.icon,
		h3 {
			margin-bottom: calc(2px + 0.1cqh);
			font-size: calc(16px + 4cqw);
		}

		p {
			font-size: calc(14px + 1cqw);
		}

		.icon {
			display: block;
			margin-top: -0.125em;
			margin-bottom: calc(4px + 0.2cqh);

			.settings-grid-item:not(.active) & {
				margin-top: -1.25em;
				translate: 0 -1.5em;
			}
		}

		img,
		.overlay {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
		}

		img {
			opacity: 0.6;
		}

		.overlay {
			@include square(100%);

			&.color {
				background-color: c(accent);
				mix-blend-mode: color;

				html.dark & {
					mix-blend-mode: hue;
				}
			}

			&.light {
				background-color: white;
				opacity: 0.7;

				html.dark & {
					background-color: black;
				}
			}
		}
	}
</style>
