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
	const DEFAULT_PALETTE = "pink" satisfies PaletteType;

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

	// 背景图片
	const backgroundImageSettingsStore = useAppSettingsStore().backgroundImage;
	const backgroundSliderDisplayValue = (value: number) => value.toFixed(2);
	const backgroundImages = useBackgroundImages();
	const backgroundImageItemMenu = ref<[MenuModel | undefined, BackgroundImageRowWithMore, HTMLElement | undefined]>([undefined, DEFAULT_BACKGROUND_IMAGE_ROW, undefined]);
	const confirmDeleteBackgroundImageFlyout = ref<[FlyoutModel | undefined, () => void]>([undefined, useNoop]);

	async function addBackgroundImage() {
		const files = await openFile({ accept: "image/*", multiple: true });
		for (const file of files)
			await backgroundImages.add(file);
	}

	const useCookieAndLocalStorageOptions = { isWatchCookieRef: true, isSyncSettings: false };
	// 在 cookie 和 localStorage 中同步的 Cookie，是否开启主题同步
	const isAllowSyncThemeSettings = useKiraCookie<boolean>(COOKIE_KEY.isAllowSyncThemeSettings, undefined, useCookieAndLocalStorageOptions);
	watch(isAllowSyncThemeSettings, () => {
		// 用户选择开启或关闭 isAllowSyncThemeSettings 的时候会载入数据
		api.user.getUserSettings().then(userSettings => {
			saveUserSetting2BrowserCookieStore(userSettings);
			cookieBinding();
		});
	});

	const selfUserInfoStore = useSelfUserInfoStore();
	const appSettings = useAppSettingsStore();

	onMounted(() => {
		if (paletteSection.value)
			for (const item of paletteSection.value.children)
				item.classList.remove("light", "dark");
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
		<section ref="paletteSection" grid>
			<SettingsGridItem
				v-for="item in paletteList"
				:id="item.color"
				:key="item.color"
				v-model="cookieThemeColor"
				:title="t.palette[item.color]"
				class="force-color"
				:class="[item.color]"
				:checked="item.color === DEFAULT_PALETTE && cookieThemeColor === 'wallpaper' && !backgroundImages.shown || undefined"
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
						<p lang="en">Make It Yours</p>
					</div>
					<Icon name="edit" />
				</div>
			</SettingsGridItem>
			<SettingsGridItem
				v-if="backgroundImages.shown"
				id="wallpaper"
				key="wallpaper"
				v-model="cookieThemeColor"
				:title="t.background"
				class="wallpaper-color force-color"
			>
				<div class="palette-card">
					<img :src="backgroundImages.currentImage" :alt="t.background" />
					<div class="overlay light"></div>
					<div class="overlay color"></div>
					<div>
						<h3>{{ t.background }}</h3>
						<p>{{ t.palette.follow_bg }}</p>
					</div>
					<Icon name="wallpaper" />
				</div>
			</SettingsGridItem>
		</section>

		<ClientOnly>
			<Subheader icon="wallpaper">{{ t.background }}</Subheader>
			<section>
				<Button class="upload-bg-image-btn" icon="upload" @click="addBackgroundImage">{{ t.file_picker.choose }}</Button>
				<section grid force-multi-column class="section-background-images">
					<TransitionGroup appear>
						<SettingsGridItem
							v-for="item in backgroundImages.items"
							:id="item.key"
							:key="item.key"
							v-model="backgroundImages.backgroundImage"
							class="preview-bg-image force-color"
							:style="{ '--accent-50': item.color }"
							@contextmenu.prevent="e => item.key !== -1 && (backgroundImageItemMenu = [e, item, e.currentTarget])"
						>
							<Icon v-if="item.key === -1" name="prohibited" />
							<img v-else :src="item.url" alt="" />
						</SettingsGridItem>
					</TransitionGroup>
				</section>
				<template v-if="backgroundImages.shown">
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
						icon="join_inner"
						pending="current"
						:displayValue="backgroundSliderDisplayValue"
					>{{ t.background.tint }}</SettingsSlider>
					<SettingsSlider
						v-model="backgroundImageSettingsStore.blur"
						:min="0"
						:max="64"
						:step="1"
						:defaultValue="0"
						icon="blur"
						pending="current"
						:displayValue="backgroundSliderDisplayValue"
					>{{ t.background.blur }}</SettingsSlider>
				</template>
			</section>

			<Menu v-model="backgroundImageItemMenu[0]">
				<!-- TODO: 多语言。 -->
				<MenuItem icon="arrow_left" :disabled="backgroundImageItemMenu[1].displayIndex <= 0" @click="backgroundImages.reorder(backgroundImageItemMenu[1].key, backgroundImageItemMenu[1].displayIndex - 1)">往前挪</MenuItem>
				<MenuItem icon="arrow_right" :disabled="backgroundImageItemMenu[1].displayIndex >= backgroundImages.items.length - 2" @click="backgroundImages.reorder(backgroundImageItemMenu[1].key, backgroundImageItemMenu[1].displayIndex + 1)">往后挪</MenuItem>
				<hr />
				<MenuItem icon="delete" @click="confirmDeleteBackgroundImageFlyout = [[backgroundImageItemMenu[2], 'y'], () => backgroundImages.delete(backgroundImageItemMenu[1].key)]">{{ t.delete }}</MenuItem>
			</Menu>

			<Flyout v-model="confirmDeleteBackgroundImageFlyout[0]">
				<div class="flyout-content">
					<h4>{{ t.delete }}</h4>
					<!-- TODO: 多语言。 -->
					<p>确定要删除该背景图像吗？</p>
					<div class="flyout-buttons">
						<Button @click="confirmDeleteBackgroundImageFlyout[0] = undefined">{{ t.step.cancel }}</Button>
						<Button @click="confirmDeleteBackgroundImageFlyout[0] = undefined; confirmDeleteBackgroundImageFlyout[1]();" :style="{ '--appearance': 'secondary' }">{{ t.step.ok }}</Button>
					</div>
				</div>
			</Flyout>
		</ClientOnly>

		<Subheader icon="more_horiz">{{ t(2).other }}</Subheader>
		<section list>
			<ToggleSwitch v-model="cookieColoredSidebar" v-ripple icon="dehaze">{{ t.appearance.colorful_navbar }}</ToggleSwitch>
			<ToggleSwitch v-model="appSettings.akkarinGuestAvatar" v-ripple :icon="appSettings.akkarinGuestAvatar ? 'akkarin' : 'person'">{{ t.appearance.akkarin_guest_avatar }}</ToggleSwitch>
		</section>

		<section list>
			<ToggleSwitch
				v-model="isAllowSyncThemeSettings"
				v-ripple
				:disabled="!selfUserInfoStore.isLogined"
				icon="sync"
			>
				{{ t.sync_color_settings_across_devices }}
			</ToggleSwitch>
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

		.wallpaper-color & {
			color: var(--accent-wallpaper);
		}

		> * {
			position: relative;
		}

		.icon,
		h3 {
			font-size: calc(16px + 4cqw);
		}

		h3 {
			margin-bottom: calc(4px + 0.1cqh);
			line-height: 1;
		}

		p {
			font-size: calc(14px + 1cqw);
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

				.wallpaper-color & {
					background-color: var(--accent-wallpaper);
				}

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
			padding: 8px;

			h3,
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

	section.section-background-images {
		padding-top: 0;

		&:not(:last-child) {
			padding-bottom: 0;
		}
	}

	.upload-bg-image-btn {
		margin: 20px;

		& + section:empty {
			display: none;
		}
	}

	.preview-bg-image {
		img {
			@include square(100%);
			aspect-ratio: inherit;
			object-fit: inherit;
		}

		.icon {
			color: c(icon-color);
			font-size: 48px;
		}

		&.v-enter-from,
		&.v-leave-to {
			scale: 0;
		}

		&.v-leave-active {
			position: absolute;
		}
	}

	.flyout-content {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: min(250px, 100dvw);

		.flyout-buttons {
			display: flex;
			gap: 8px;
		}
	}
</style>
