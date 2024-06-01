<script setup lang="ts">
	const getPaletteImage = (name: string) => `/static/images/palettes/${name}.png`;

	const themeList = ["light", "dark", "system"] as const;
	const paletteList = [
		{ color: "pink", subtitle: "保登心愛" },
		{ color: "blue", subtitle: "香風智乃" },
		{ color: "purple", subtitle: "天々座理世" },
		{ color: "green", subtitle: "宇治松千夜" },
		{ color: "yellow", subtitle: "桐間紗路" },
		{ color: "cyan", subtitle: "条河麻耶" },
		{ color: "red", subtitle: "奈津恵" },
	] as const;
	const paletteSection = ref<HTMLElement>();

	// HACK: 16 请参照此部分 ↓ ↓ ↓

	// 允许同步的 kira cookie 设置
	const useSyncKiraCookieOptions = { isWatchCookieRef: true, isSyncSettings: true, isListenLoginEvent: true };

	// 主题
	const cookieThemeType = useKiraCookie<ThemeSetType>(COOKIE_KEY.themeTypeCookieKey, SyncUserSettings.updateOrCreateUserThemeTypeSetting, useSyncKiraCookieOptions);
	// 个性色
	const cookieThemeColor = useKiraCookie<string>(COOKIE_KEY.themeColorCookieKey, SyncUserSettings.updateOrCreateUserThemeColorSetting, useSyncKiraCookieOptions);
	// 自定义个性色
	const cookieThemeCustomColor = useKiraCookie<string>(COOKIE_KEY.themeColorCustomCookieKey, SyncUserSettings.updateOrCreateUserThemeColorCustomSetting, { ...useSyncKiraCookieOptions, debounceWait: 500 }); // 自定义颜色增加了防抖
	// 彩色侧边栏
	const cookieColoredSidebar = useKiraCookie<boolean>(COOKIE_KEY.coloredSidebarCookieKey, SyncUserSettings.updateOrCreateUserColoredSidebarSetting, useSyncKiraCookieOptions);

	// HACK: 16 请参照此部分 ↑ ↑ ↑

	// 当使用自定义颜色时，使用 style="--accent-50: #000" 的格式将颜色放置在根元素上，并将内容存储且允许同步。
	const customColor = reactive(Color.fromHex(`#${cookieThemeCustomColor.value}`));
	const flyoutColorPicker = ref<FlyoutModel>();
	watch(customColor, customColor => cookieThemeCustomColor.value = customColor.hex);

	onMounted(() => {
		if (paletteSection.value)
			for (const item of paletteSection.value.children)
				item.classList.remove("light", "dark");
	});
</script>

<template>
	<Flyout v-model="flyoutColorPicker" class="color-picker-flyout">
		<div class="color-picker-wrapper">
			<ColorPicker v-model="customColor" />
		</div>
	</Flyout>

	<Subheader icon="brightness_medium">{{ t.scheme }}</Subheader>
	<div class="chip sample">
		<PlayerVideoController :currentTime="30" :duration="110" :buffered="60" />
	</div>
	<section grid class="theme-type">
		<SettingsGridItem
			v-for="item in themeList"
			:id="item"
			:key="item"
			v-model="cookieThemeType"
			:title="t.scheme[item]"
			:ripple="false"
		>
			<LogoThemePreview :theme="item" />
		</SettingsGridItem>
	</section>

	<Subheader icon="palette">{{ t.palette }}</Subheader>
	<section ref="paletteSection" grid>
		<SettingsGridItem
			v-for="item in paletteList"
			:id="item.color"
			:key="item.color"
			v-model="cookieThemeColor"
			:title="t.palette[item.color]"
			class="force-color"
			:class="[item.color]"
		>
			<div class="content">
				<NuxtImg
					:src="getPaletteImage(item.color)"
					alt="Is the Order a Rabbit?"
					format="avif"
					width="320px"
					height="180px"
					fit="outside"
				/>
				<div class="overlay light"></div>
				<div class="overlay color"></div>
				<Icon name="palette" />
				<h3>{{ t.palette[item.color] }}</h3>
				<p lang="ja">{{ item.subtitle }}</p>
			</div>
		</SettingsGridItem>
		<SettingsGridItem
			id="custom"
			key="custom"
			v-model="cookieThemeColor"
			:title="t.custom"
			class="custom-color"
			@click="e => flyoutColorPicker = [e]"
		>
			<div class="content">
				<div class="hue-gradient"></div>
				<Icon name="edit" />
				<h3>{{ t.custom }}</h3>
				<p>Try Yourself</p>
			</div>
		</SettingsGridItem>
	</section>

	<Subheader icon="wallpaper">{{ t.background }}</Subheader>
	<section list>
		<SettingsChipItem icon="wallpaper" trailingIcon="edit">{{ t.background.custom }}</SettingsChipItem>
	</section>

	<Subheader icon="more_horiz">{{ t(2).other }}</Subheader>
	<section list>
		<ToggleSwitch v-model="cookieColoredSidebar" v-ripple icon="dehaze">{{ t.appearance.colorful_navbar }}</ToggleSwitch>
	</section>
</template>

<style scoped lang="scss">
	.sample {
		&,
		*,
		::before,
		::after {
			pointer-events: none !important;
		}

		:deep(.player-video-controller) {
			background-color: transparent;
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

		.custom-color & {
			color: inherit;
		}

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
		.overlay,
		.hue-gradient {
			@include square(100%);
			position: absolute;
			top: 0;
			left: 0;
			object-fit: cover;
		}

		img {
			object-position: 50% 8%;
			opacity: 0.6;
		}

		.overlay {
			@include square(100%);

			&.color {
				background-color: c(accent);
				opacity: 0.6;
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

		.hue-gradient {
			background-image: $hue-radial;
			opacity: 0.3;
		}

		@container style(--column: single) {
			p {
				display: none;
			}

			.icon {
				margin-top: -0.25em;
			}
		}
	}

	.color-picker-wrapper {
		min-width: 300px;
	}
</style>
