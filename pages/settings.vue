<script setup lang="ts">
	definePageMeta({
		pageTransition: {
			name: "settings",
			mode: "out-in",
		},
	});

	// 已请求的设置页面。
	const currentSettingsRequested = ref("");
	// 已渲染的设置页面。
	const currentSettingsRendered = ref("");

	// 当前地址栏路由地址。
	const currentSettingsRoute = computed(() => currentSettingsPage());

	// 先判断当前是否在设置页面，然后赋值给 currentSettingsRequested，防止退出页面时数值异常。
	watch(currentSettingsRoute, currentSettingsRoute => {
		if (currentSettingsRoute !== "")
			currentSettingsRequested.value = currentSettingsRoute;
	}, { immediate: true });

	// SSR 首屏加载时确保内容不是空的。
	currentSettingsRendered.value = currentSettingsRequested.value;

	// CSR 切换页面。
	const nuxtApp = useNuxtApp();
	nuxtApp.hook("page:finish", () => {
		currentSettingsRendered.value = currentSettingsRequested.value;
	});

	const search = ref("");
	const main = ref<HTMLElement>();
	const showDrawer = ref(false);
	const ti = (id: string) => t[new VariableName(id).snake];
	const title = computed(() => ti(currentSettingsRendered.value));
	const settingsString = t.settings; // HACK: Bypass "A composable that requires access to the Nuxt instance was called outside of a plugin."
	const htmlTitle = computed(() => title.value + " - " + settingsString);

	const selfUserInfoStore = useSelfUserInfoStore();
	const isAdmin = computed(() => selfUserInfoStore.role === "admin");
	const isDevMode = toNewRef(isAdmin);
	provide("isDevMode", isDevMode);

	// 彩色侧边栏
	const cookieColoredSidebar = useCookie<boolean>(COOKIE_KEY.coloredSidebarCookieKey);

	useEventListener("window", "resize", () => {
		if (window.innerWidth > 991) showDrawer.value = false;
	});

	/**
	 * 手势滑动事件。左右滑动即可收起/展开导航菜单。
	 * 已暂时禁用，因为会导致所有元素按下去后拖到外部会仍然执行而不会取消。
	 * 原本使用方法是在当前文件的根 div 上放置 v-drag="onSwipe"
	 */
	function onSwipe({ dragging, direction, distance, axis }: GestureDragEvent) {
		const MIN_DISTANCE = 100;
		if (!dragging && axis === "x" && distance >= MIN_DISTANCE)
			showDrawer.value = direction[0] > 0;
	}

	const settings = {
		personal: [
			{ id: "dashboard", icon: "dashboard" },
			{ id: "profile", icon: "badge" },
			{ id: "traces", icon: "history" },
			{ id: "privacy", icon: "shield" },
			{ id: "security", icon: "lock" },
			{ id: "account-linking", icon: "groups" },
			{ id: "blocklist", icon: "block" },
			{ id: "invitation-code", icon: "gift" },
		],
		general: [
			{ id: "appearance", icon: "palette" },
			{ id: "player", icon: "play" },
			{ id: "danmaku", icon: "danmaku" },
			{ id: "preference", icon: "star" },
			{ id: "language", icon: "translate" },
			{ id: "experimental", icon: "science" },
			{ id: "shortcut-key", icon: "keyboard" },
			{ id: "about", icon: "info" },
			{ id: "acknowledgement", icon: "campaign" },
		],
		admin: [
			{ id: "content", icon: "category" },
			{ id: "user-block", icon: "account_circle" },
			{ id: "user-info", icon: "account_circle" },
		],
	};

	if (!selfUserInfoStore.isLogined && settings.personal.some(setting => setting.id === currentSettingsRequested.value))
		navigate("/settings/appearance");

	/**
	 * 登出。
	 */
	async function logout() {
		const logoutResult = await api.user.userLogout();
		if (logoutResult.success) {
			const curPage = currentSettingsPage();
			if (settings.general.findIndex(({ id }) => id === curPage) === -1)
				navigate("/settings/appearance");
			useToast("你已成功登出！", "success"); // TODO: 使用多语言
			useEvent("user:login", false);
		}
	}

	useHead({ title: htmlTitle });
</script>

<template>
	<div v-bind="$attrs" class="settings" :class="{ transparent: useAppSettingsStore().showCssDoodle || useAppSettingsStore().backgroundImage.image.data }">
		<ShadingIcon icon="settings" position="right top" rotating />

		<nav :class="{ show: showDrawer }">
			<div class="content">
				<header class="title content padding-end">
					<header class="title nav-header">
						<h1>{{ t.settings }}</h1>
						<TextBox v-model="search" type="search" :placeholder="t.settings.search" icon="search" />
					</header>
					<TabBar v-model="currentSettingsRequested" vertical>
						<Subheader v-if="selfUserInfoStore.isLogined" icon="person">{{ t.settings.user }}</Subheader>
						<template v-if="selfUserInfoStore.isLogined">
							<TabItem v-for="setting in settings.personal" :id="setting.id" :key="setting.id" :icon="setting.icon" :to="`/settings/${setting.id}`" @click="showDrawer = false">{{ ti(setting.id) }}</TabItem>
						</template>
						<Subheader icon="apps">{{ t.settings.app }}</Subheader>
						<TabItem v-for="setting in settings.general" :id="setting.id" :key="setting.id" :icon="setting.icon" :to="`/settings/${setting.id}`" @click="showDrawer = false">{{ ti(setting.id) }}</TabItem>
						<!-- TODO: 使用多语言 -->
						<Subheader v-if="isAdmin" icon="build_circle">管理设置</Subheader>
						<template v-if="isAdmin">
							<TabItem v-for="setting in settings.admin" :id="setting.id" :key="setting.id" :icon="setting.icon" :to="`/settings/${setting.id}`" @click="showDrawer = false">{{ ti(setting.id) }}</TabItem>
						</template>
					</TabBar>
					<div class="nav-bottom-buttons">
						<template v-if="isAdmin || isDevMode">
							<Button icon="build" href="/dev">{{ t.development_test_page }}</Button>
							<Button icon="apps" href="/dev/components">{{ t.components_test_page }}</Button>
						</template>
						<Button v-if="selfUserInfoStore.isLogined" icon="logout" @click="logout">{{ t.logout }}</Button>
					</div>
				</header>
			</div>
		</nav>

		<div class="card"></div>
		<main ref="main">
			<div class="content padding-end">
				<header class="title page-header" :class="{ colored: cookieColoredSidebar }">
					<div class="show-drawer-wrapper page-title-icon-wrapper">
						<SoftButton icon="dehaze" @click="showDrawer = true" />
					</div>
					<div class="page-title-wrapper">
						<Transition>
							<h2 :key="currentSettingsRendered">{{ title }}</h2>
						</Transition>
					</div>
					<div class="close-button-wrapper page-title-icon-wrapper">
						<SoftButton href="/settings/exit" icon="close" />
					</div>
				</header>

				<div class="router-view">
					<NuxtPage :transition="{ name: 'page-jump', mode: 'out-in' }" />
				</div>
			</div>
		</main>

		<Transition>
			<div v-if="showDrawer" class="mask" @click="showDrawer = false"></div>
		</Transition>
	</div>
</template>

<style scoped lang="scss">
	@use "styles/elements/toolbox-card" as *;

	$title-padding-top: 26px;
	$nav-padding-x: 24px;
	$mobile-nav-padding-x: 16px;
	$main-padding-x: 48px;
	$mobile-padding: $page-padding-x-mobile;
	$show-drawer-duration: 500ms;
	$nav-width: 245px + 2 * $nav-padding-x;
	$max-width: 960px;
	$backdrop-filter: blur(4px);
	$submit-margin-y: 2rem;

	.settings {
		--side-width: calc(max((100% - #{$max-width + $nav-width}) / 2, 0px)); // 注意这里的 0px 一旦省略 px 就会报错，因此不能去掉单位。
		position: relative;
		min-height: 100dvh;
		background-color: c(gray-5);
		transition: $fallback-transitions, width 0s, height 0s, min-height 0s;

		&.transparent {
			background: none;
		}
	}

	nav {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 5;
		width: $nav-width;
		height: 100%;
		margin-left: var(--side-width);

		@include tablet {
			@include system-card;
			@include acrylic-background;
			transition-duration: $show-drawer-duration;

			&:not(.show) {
				translate: -$nav-width - 16px;
			}
		}

		@include computer {
			display: block !important;
		}

		> .content > .title.content {
			display: flex;
			flex-direction: column;
			gap: 10px;
			max-height: 100dvh;
			padding: 0 $nav-padding-x;
			overflow: hidden overlay;
			overscroll-behavior-y: contain;
			scrollbar-gutter: stable; // WARN: Chromium 114 开始，overflow 的 overlay 成了 auto 的别名，因此只能提前占位显示来确保不晃动。目前甚至 Chromium 自己的设置页都在依赖于 overlay，太荒谬了。https://bugs.chromium.org/p/chromium/issues/detail?id=1450927
			transition: none;

			@include mobile {
				max-height: calc(100dvh - $sidebar-width);
				padding: 0 $mobile-nav-padding-x;
			}

			> * {
				flex-shrink: 0;
			}
		}

		.subheader {
			margin: 10px 0;
			cursor: default;
		}
	}

	.nav-bottom-buttons {
		display: flex;
		flex-direction: column;
		gap: 8px;

		> button {
			width: 100%;
		}
	}

	:is(nav, main) > .content {
		height: 100%;

		> * {
			flex-shrink: 0;
		}
	}

	.card {
		@include square(100%);
		position: absolute;
		z-index: 5;
		pointer-events: none;

		@include computer {
			@include card-shadow;
		}
	}

	.card,
	main {
		--margin-left: calc(var(--side-width) + #{$nav-width});

		@include computer {
			margin-left: var(--margin-left);

			> .content {
				width: calc(100% - var(--margin-left));
			}
		}
	}

	main {
		position: relative;
		z-index: 2;
		width: 100%;
		min-height: 100dvh;
		background-color: c(main-bg);
		transition: $fallback-transitions, width 0s, height 0s, min-height 0s;

		.settings.transparent & {
			background: none;
		}

		> .content {
			position: relative;
			z-index: 1;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			max-width: $max-width;
			padding: 0 $main-padding-x;

			@include mobile {
				padding: 0 $mobile-padding;
			}

			.router-view {
				:deep(> div) {
					display: flex;
					flex-direction: column;
					gap: 1rem;

					@include mobile {
						padding-top: $mobile-toolbar-height + $mobile-padding;
						padding-bottom: $mobile-toolbar-height + $mobile-padding;
					}
				}
			}
		}
	}

	.padding-end {
		@include fix-page-end-padding(false);
	}

	h1,
	h2,
	.page-title-wrapper {
		color: c(accent);
		font-size: calc(1.275rem + 0.3dvw);
		font-weight: bold;
	}

	.page-title-wrapper {
		position: relative;
		display: flex;
		flex-grow: 1;
		align-items: center;
		height: 1.5em;
		overflow-y: hidden;
	}

	h2 {
		position: absolute;

		&.v-enter-active,
		&.v-leave-active {
			transition: all $ease-out-smooth 700ms;
		}

		&.v-leave-to {
			translate: 0 -120%;
		}

		&.v-enter-from {
			translate: 0 120%;
		}
	}

	.title {
		position: sticky;
		top: 0;
		z-index: 11;
		padding-top: $title-padding-top;

		&.nav-header,
		&.page-header {
			backdrop-filter: $backdrop-filter;
		}
	}

	.nav-header {
		margin-right: (-$nav-padding-x);
		margin-bottom: -10px;
		margin-left: (-$nav-padding-x);
		padding-right: $nav-padding-x;
		padding-bottom: 10px;
		padding-left: $nav-padding-x;
		background-color: c(gray-5, 80%);

		h1 {
			margin-bottom: 10px;
		}

		@include mobile {
			margin-right: (-$mobile-nav-padding-x);
			margin-left: (-$mobile-nav-padding-x);
			padding-right: $mobile-nav-padding-x;
			padding-left: $mobile-nav-padding-x;
		}
	}

	.page-header {
		display: flex;
		gap: 1rem;
		align-items: center;
		background-color: c(main-bg, 80%);

		@include not-mobile {
			margin-right: (-$main-padding-x);
			margin-bottom: -0.5rem;
			margin-left: (-$main-padding-x);
			padding-right: $main-padding-x;
			padding-bottom: 0.5rem;
			padding-left: $main-padding-x;
		}

		@include mobile {
			@include sidebar-shadow;
			position: fixed;
			align-items: center;
			width: 100%;
			height: $mobile-toolbar-height;
			margin: 0 (-$mobile-padding);
			padding: 0 4px;
		}

		.soft-button {
			--wrapper-size: 48px;
			--ripple-size: var(--wrapper-size);
		}

		.page-title-icon-wrapper {
			position: relative;
			display: flex;
			flex-shrink: 0;
			align-items: center;
			margin-top: -4px;
			margin-bottom: -4px;

			@include mobile {
				width: 48px;
			}
		}

		.show-drawer-wrapper {
			@include computer {
				display: none;
			}
		}

		@include mobile {
			&.colored {
				background-color: c(accent, 80%);

				:deep(*) {
					color: white;
				}
			}
		}
	}

	.mask {
		@include fullscreen(fixed);
		z-index: 4;
		background-color: c(main-bg, 50%);
		transition-duration: $show-drawer-duration;

		&.v-enter-from,
		&.v-leave-to {
			opacity: 0;
		}

		&.v-leave-active {
			pointer-events: none;
		}

		@include computer {
			display: none;
		}
	}

	%chip {
		@include chip-shadow;
		@include round-large;
		overflow: clip;
		background-color: c(surface-color);
	}

	:deep() {
		.chip {
			@extend %chip;
		}

		section {
			@extend %chip;

			&[list] > * {
				$extra-padding: 16px;
				padding: 10px 20px;
				overflow: visible;

				&:has(.ripple-circle) {
					overflow: clip;
				}

				&:first-child {
					padding-top: $extra-padding;
				}

				&:last-child {
					padding-bottom: $extra-padding;
				}

				&:any-hover {
					background-color: c(hover-overlay);
				}
			}

			&[grid] {
				@include settings-grid;
				padding: 20px;

				&[force-multi-column] {
					@include mobile {
						--force-multi-column: true;
						grid-template-columns: 1fr 1fr;
					}
				}
			}
		}

		.submit {
			position: sticky;
			right: 0;
			bottom: 0;
			z-index: 4;
			display: flex;
			gap: 8px;
			justify-content: flex-end;
			margin: 0 (-$main-padding-x) (-$submit-margin-y);
			margin-top: 0;
			padding: 0 $main-padding-x $submit-margin-y;
			background-color: c(main-bg, 80%);
			backdrop-filter: $backdrop-filter;
		}
	}

	@keyframes float-up {
		from {
			translate: 0 1rem;
			opacity: 0;
		}
	}
</style>
