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

	const backgroundImageSettingsStore = useAppSettingsStore().backgroundImage;
	const backgroundImageFiles = ref<File[]>([]);
	const backgroundImageFile = computed(() => backgroundImageFiles.value[0]);
	const backgroundSliderDisplayValue = (value: number) => value.toFixed(2);

	watch(backgroundImageFile, async file => {
		const bgImage = backgroundImageSettingsStore.image;
		bgImage.name = file?.name ?? "";
		bgImage.data = file ? await fileToData(file) : "";
	});

	onMounted(() => {
		if (paletteSection.value)
			for (const item of paletteSection.value.children)
				item.classList.remove("light", "dark");

		// 从设置存储中加载背景图片
		const bgImage = backgroundImageSettingsStore.image;
		if (bgImage.data)
			backgroundImageFiles.value = [dataToFile(bgImage.data, bgImage.name)];
	});
</script>

<template>
	<div>
		<Flyout v-model="flyoutColorPicker" class="color-picker-flyout">
			<div class="color-picker-wrapper">
				<ColorPicker v-model="customColor" />
			</div>
		</Flyout>

		<Subheader icon="brightness_medium">{{ t.scheme }}</Subheader>
		<div class="chip sample">
			<PlayerVideoController :currentTime="30" :duration="110" :buffered="[[0, 60]]" />
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
		<section ref="paletteSection" grid force-multi-column>
			<SettingsGridItem
				v-for="item in paletteList"
				:id="item.color"
				:key="item.color"
				v-model="cookieThemeColor"
				:title="t.palette[item.color]"
				class="force-color"
				:class="[item.color]"
			>
				<div class="palette-card">
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
					<div>
						<h3>{{ t.palette[item.color] }}</h3>
						<p lang="ja">{{ item.subtitle }}</p>
					</div>
					<Icon name="palette" />
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
				<div class="palette-card">
					<div class="hue-gradient"></div>
					<div>
						<h3>{{ t.custom }}</h3>
						<p>Make It Yours</p>
					</div>
					<Icon name="edit" />
				</div>
			</SettingsGridItem>
		</section>

		<Subheader icon="wallpaper">{{ t.background }}</Subheader>
		<section>
			<FilePicker v-model="backgroundImageFiles" accept="image/*" cover :unselectedText="t.unselected.image" />
			<template v-if="backgroundImageFile">
				<SettingsSlider
					v-model="backgroundImageSettingsStore.opacity"
					:min="0"
					:max="0.4"
					:step="0.01"
					:defaultValue="0.2"
					icon="opacity"
					pending="current"
					:displayValue="backgroundSliderDisplayValue"
				>{{ t.background.opacity }}</SettingsSlider>
				<SettingsSlider
					v-model="backgroundImageSettingsStore.tint"
					:min="0"
					:max="1"
					:step="0.01"
					:defaultValue="0.75"
					icon="opacity"
					pending="current"
					:displayValue="backgroundSliderDisplayValue"
				>{{ t.background.tint }}</SettingsSlider>
				<SettingsSlider
					v-model="backgroundImageSettingsStore.blur"
					:min="0"
					:max="64"
					:step="1"
					:defaultValue="0"
					icon="opacity"
					pending="current"
					:displayValue="backgroundSliderDisplayValue"
				>{{ t.background.blurIntensity }}</SettingsSlider>
			<!-- TODO: 滑块上方的气泡定位有问题。 -->
			</template>
		</section>

		<Subheader icon="more_horiz">{{ t(2).other }}</Subheader>
		<section list>
			<ToggleSwitch v-model="cookieColoredSidebar" v-ripple icon="dehaze">{{ t.appearance.colorful_navbar }}</ToggleSwitch>
		</section>
	</div>
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

	.settings-grid-item:deep() {
		.ripple-circle {
			z-index: 4;
			background-color: c(accent-ripple);
		}
	}

	.palette-card {
		@include square(100%);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 14px 16px;
		color: c(accent);

		.custom-color & {
			color: inherit;
		}

		> * {
			position: relative;
		}

		.icon,
		h3 {
			font-size: calc(16px + 4cqw);
		}

		h3 {
			margin-bottom: calc(2px + 0.1cqh);

			@include mobile {
				display: none;
			}
		}

		p {
			font-size: calc(14px + 1cqw);

			@include mobile {
				font-weight: bold;
			}
		}

		.icon {
			display: block;
			margin-top: calc(8px + 0.1cqh);
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

	.file-picker {
		width: 300px;
		margin: 16px;
	}
</style>
