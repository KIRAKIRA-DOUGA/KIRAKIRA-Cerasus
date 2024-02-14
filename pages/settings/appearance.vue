<script setup lang="ts">
	import { coloredSidebarCookieKey, cookieBinding, themeColorCookieKey, themeTypeCookieKey } from "~/modules/theme/cookieBinding";

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

	const userSettingsCookieBasicOption = { expires: new Date("9999/9/9"), sameSite: true, httpOnly: false, watch: true };

	const selfUserInfoStore = useSelfUserInfoStore();
	const appSettingsStore = useAppSettingsStore();
	const isAllowSyncThemeSettings = computed(() => appSettingsStore.isAllowSyncThemeSettings && selfUserInfoStore.isLogined);

	/**
	 * 发送后端请求，更新用户设置
	 * @param updateOrCreateUserSettingsRequest 用户发生修改的设置
	 */
	function updateUserSetting(updateOrCreateUserSettingsRequest: UpdateOrCreateUserSettingsRequestDto) {
		api.user.updateUserSettings(updateOrCreateUserSettingsRequest);
	}
	
	// WARN 15 请参照此部分 ↓ ↓ ↓
	// 主题
	const cookieThemeType = useCookie<ThemeSetType>(themeTypeCookieKey, userSettingsCookieBasicOption);
	watch(cookieThemeType, themeType => { // 当设置值发送改变时，发送后端请求，并触发 cookieBinding 更新页面样式
		if (process.client) {
			window.localStorage.setItem(themeTypeCookieKey, themeType); // WARN useStorage 更新数据会导致 cookieBinding 中获取到的 localStorage 数据不是最新数据，可能是 vue 响应式延迟
			if (isAllowSyncThemeSettings.value) { // 如果允许同步样式设置，则发送后端请求，非阻塞
				const updateOrCreateUserSettingsRequest: UpdateOrCreateUserSettingsRequestDto = {
					themeType: cookieThemeType.value as ThemeSetType,
				};
				updateUserSetting(updateOrCreateUserSettingsRequest);
			}
			cookieBinding();
		}
	});
	// WARN 15 请参照此部分 ↑ ↑ ↑

	// 个性色
	const cookieThemeColor = useCookie<string>(themeColorCookieKey, userSettingsCookieBasicOption);
	watch(cookieThemeColor, themeColor => { // 当设置值发送改变时，发送后端请求，并触发 cookieBinding 更新页面样式
		if (process.client) {
			window.localStorage.setItem(themeColorCookieKey, themeColor); // WARN useStorage 更新数据会导致 cookieBinding 中获取到的 localStorage 数据不是最新数据，可能是 vue 响应式延迟
			if (isAllowSyncThemeSettings.value) { // 如果允许同步样式设置，则发送后端请求，非阻塞
				const updateOrCreateUserSettingsRequest: UpdateOrCreateUserSettingsRequestDto = {
					themeColor: cookieThemeColor.value,
				};
				updateUserSetting(updateOrCreateUserSettingsRequest);
			}
			cookieBinding();
		}
	});

	// TODO 自定义个性色

	// 彩色侧边栏
	const cookieColoredSidebar = useCookie<boolean>(coloredSidebarCookieKey, userSettingsCookieBasicOption);
	watch(cookieColoredSidebar, coloredSidebar => { // 当设置值发送改变时，发送后端请求，并触发 cookieBinding 更新页面样式
		if (process.client) {
			window.localStorage.setItem(coloredSidebarCookieKey, `${coloredSidebar}`); // WARN useStorage 更新数据会导致 cookieBinding 中获取到的 localStorage 数据不是最新数据，可能是 vue 响应式延迟
			if (isAllowSyncThemeSettings.value) { // 如果允许同步样式设置，则发送后端请求，非阻塞
				const updateOrCreateUserSettingsRequest: UpdateOrCreateUserSettingsRequestDto = {
					coloredSideBar: cookieColoredSidebar.value,
				};
				updateUserSetting(updateOrCreateUserSettingsRequest);
			}
			cookieBinding();
		}
	});

	onMounted(() => {
		if (paletteSection.value)
			for (const item of paletteSection.value.children) {
				item.classList.remove("light", "dark");
				item.classList.add(actualTheme.value);
			}
	});

	// 发生用户登录事件时，要手动触发 cookie 更新（cookie 更新会触发 cookieBinding 更新页面样式）
	useListen("user:login", () => {
		cookieThemeType.value = useCookie<ThemeSetType>(themeTypeCookieKey, userSettingsCookieBasicOption).value;
		cookieThemeColor.value = useCookie<string>(themeColorCookieKey, userSettingsCookieBasicOption).value;
		cookieColoredSidebar.value = useCookie<boolean>(coloredSidebarCookieKey, userSettingsCookieBasicOption).value;
	});
</script>

<template>
	<Subheader icon="brightness_medium">{{ t.scheme }}</Subheader>
	<div class="chip sample">
		<PlayerVideoController :currentTime="30" :duration="110" :buffered="60" />
	</div>
	<section grid>
		<SettingsGridItem
			v-for="item in themeList"
			:id="item"
			:key="item"
			v-model="cookieThemeType"
			:title="t.scheme[item]"
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
			v-model="cookieThemeColor"
			:title="t.palette[item.color]"
			class="force-color"
			:class="[item.color, actualTheme]"
		>
			<div class="content">
				<img :src="getPaletteImage(item.color)" alt="Is the Order a Rabbit?" />
				<div class="overlay light"></div>
				<div class="overlay color"></div>
				<Icon name="palette" />
				<h3>{{ t.palette[item.color] }}</h3>
				<p>{{ item.subtitle }}</p>
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

		@container style(--column: single) {
			p {
				display: none;
			}

			.icon {
				margin-top: -0.25em;
			}
		}
	}
</style>
~/modules/theme/cookieBinding
