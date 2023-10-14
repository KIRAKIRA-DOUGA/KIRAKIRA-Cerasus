<docs>
	# 响应式布局
</docs>

<script setup lang="ts">
	import background from "assets/styles/css-doodles/background.css-doodle";
	import Settings from "./settings.vue";
	import UserPage from "./user-page.vue";
	import { usePageTransition } from "helpers/page-transition";

	const container = ref<HTMLDivElement>();
	const containerMain = ref<HTMLElement>();
	const showBanner = ref(false);
	const localedRoute = computed(() => getRoutePath());
	const SETTINGS = "settings";
	const pageTransition = usePageTransition();
	const isSettings = computed(() => getLocaleRouteSlug()[0] === SETTINGS);
	const isUserPage = computed(() => getLocaleRouteSlug()[0] === "user");
	const cssDoodle = refComp();
	const showCssDoodle = computed(() => useAppSettingsStore().showCssDoodle);
	const isToggleSettings = ref(false);
	const scrollToTop = () => [container, containerMain].forEach(c => c.value?.scrollTo(0, 0));
	const transitionProps = (aboutSettings: boolean) => {
		const attrs: AnyObject = { mode: "out-in", onBeforeEnter: scrollToTop };
		if (aboutSettings)
			Object.assign(attrs, { onBeforeLeave: () => isToggleSettings.value = true, onAfterEnter: () => isToggleSettings.value = false });
		return attrs;
	};
	const [onContentEnter, onContentLeave] = simpleAnimateSize("height", 700, eases.easeInOutSmooth);
	const showDrawer = ref(false);

	useListen("app:showDrawer", () => showDrawer.value = true);

	watchRoute(() => {
		showBanner.value = localedRoute.value === "" || localedRoute.value.startsWith("user");
	}, true);

	onMounted(() => {
		setDisplayVisible(cssDoodle.value, showCssDoodle.value);
	});
</script>

<template>
	<Transition>
		<Offcanvas v-if="showDrawer" v-model="showDrawer" />
	</Transition>
	<div class="viewport">
		<Transition>
			<CssDoodle v-show="showCssDoodle" ref="cssDoodle" :rule="background" class="background" />
		</Transition>
		<SideBar />
		<div ref="container" class="container" :class="{ scroll: isSettings, 'toggle-settings': isToggleSettings }">
			<Transition name="settings" v-bind="transitionProps(true)">
				<Settings v-if="isSettings">
					<Transition name="page-jump" v-bind="transitionProps(true)">
						<div :key="localedRoute" class="router-view">
							<slot></slot>
						</div>
					</Transition>
				</Settings>
				<main v-else ref="containerMain" class="scroll">
					<Banner :collapsed="!showBanner" />
					<Transition :css="false" @enter="onContentEnter" @leave="onContentLeave">
						<UserPage v-if="isUserPage" />
					</Transition>
					<Transition :name="pageTransition" v-bind="transitionProps(false)">
						<div :key="localedRoute" :class="{ 'user-center-slot': isUserPage }">
							<slot></slot>
						</div>
					</Transition>
				</main>
			</Transition>
		</div>
		<div v-if="showDrawer" class="hide-drawer-mask" @click="showDrawer = false"></div>
	</div>
</template>

<style scoped lang="scss">
	.container {
		position: relative;
		z-index: 1;
		padding-left: $sidebar-width;
		transition: $fallback-transitions, width 0s, height 0s;

		@layer layout {
			> main > div:deep > .container {
				padding: 26px 100px;

				@include tablet {
					padding: 26px 40px;
				}

				@include mobile {
					padding: 16px;
				}
			}
		}
	}

	main {
		transition: none;

		// max-width: 1920px;
		// margin: 0 auto;

		// &:has(> .settings) {
		// 	max-width: unset;
		// }
	}

	aside {
		top: 0;
		width: $sidebar-width;
		height: 100dvh;
	}

	nav {
		bottom: 0;
	}

	aside,
	nav {
		position: fixed;
		left: 0;
		transition: background-color $ease-out-max 250ms;
	}

	@include not-mobile {
		nav {
			display: none;
		}
	}

	@include mobile {
		.container {
			padding-top: $mobile-toolbar-height;
			padding-left: 0;
		}

		aside,
		nav {
			width: 100dvw;
			height: $mobile-toolbar-height;
		}

		.scroll {
			height: calc(100dvh - 2 * $mobile-toolbar-height);

			&.container {
				height: calc(100dvh - $mobile-toolbar-height);
			}
		}
	}

	.background {
		opacity: 0.3;

		&.v-enter-from,
		&.v-leave-to {
			opacity: 0;
		}
	}

	.scroll {
		height: 100dvh;
		overflow: hidden overlay;
		// scrollbar-gutter: stable; // WARN: Chromium 114 开始，overflow 的 overlay 成了 auto 的别名，因此只能提前占位显示来确保不晃动。目前甚至 Chromium 自己的设置页都在依赖于 overlay，太荒谬了。https://bugs.chromium.org/p/chromium/issues/detail?id=1450927

		&.toggle-settings {
			overflow: hidden;
		}
	}

	.viewport {
		height: 100dvh;
		background-color: c(main-bg);

		&:has(> .hide-drawer-mask) {
			transition-duration: 600ms;

			&:any-hover:active {
				transform-origin: left center !important;
				scale: 0.975;
			}
		}
	}

	.offcanvas {
		position: fixed;
		height: 100dvh;
		transform-origin: -100% center;

		&:not(.v-leave-active) ~ .viewport {
			@include system-card;
			@include round-large;
			position: relative;
			overflow: hidden;
			transform: translateX(50dvw) scale(0.8);
			transform-origin: left center;
		}

		&.v-enter-active,
		&.v-leave-active {
			&,
			~ .viewport {
				transition-duration: 600ms;
			}
		}

		&.v-enter-from,
		&.v-leave-to {
			opacity: 0;
			scale: 0.8;
		}
	}

	.hide-drawer-mask {
		position: absolute;
		inset: 0;
		z-index: 99;
		cursor: pointer;
	}
</style>
