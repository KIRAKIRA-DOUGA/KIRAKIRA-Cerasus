<script setup lang="ts">
	import background from "assets/styles/css-doodles/background.css-doodle";
	import Settings from "./Settings.vue";
	import UserCenter from "./UserCenter.vue";
	import usePageTransition from "helpers/page-transition";

	const container = ref<HTMLDivElement>();
	const containerMain = ref<HTMLElement>();
	const showBanner = ref(false);
	const localedRoute = computed(() => getRoutePath());
	const SETTINGS = "settings";
	const pageTransition = usePageTransition();
	const isSettings = computed(() => getLocaleRouteSlug()[0] === SETTINGS);
	const isUserCenter = computed(() => getLocaleRouteSlug()[0] === "user");
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

	watchRoute(() => {
		showBanner.value = localedRoute.value === "" || localedRoute.value.startsWith("user");
	}, true);

	onMounted(() => {
		setDisplayVisible(cssDoodle.value, showCssDoodle.value);
	});
</script>

<template>
	<Transition>
		<CssDoodle v-show="showCssDoodle" ref="cssDoodle" :rule="background" class="background" />
	</Transition>
	<SideBar class="sidebar" />
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
					<UserCenter v-if="isUserCenter" />
				</Transition>
				<Transition :name="pageTransition" v-bind="transitionProps(false)">
					<div :key="localedRoute" :class="{ 'user-center-slot': isUserCenter }">
						<slot></slot>
					</div>
				</Transition>
			</main>
		</Transition>
	</div>
</template>

<style scoped lang="scss">
	.container {
		position: relative;
		z-index: 1;
		padding-left: $sidebar-width;
		transition: $fallback-transitions, width 0s, height 0s;

		> main > div {
			> :deep(.container) {
				padding: 26px 100px;

				@include tablet {
					padding: 26px 40px;
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

	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		height: 100dvh;
		transition: background-color $ease-out-max 250ms;
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
</style>
