<script setup lang="ts">
	import background from "assets/styles/css-doodles/background.css-doodle";
	import Settings from "./Settings.vue";

	const showBanner = ref(false);
	const localedRoute = computed(() => getRoutePath());
	const SETTINGS = "settings";
	const pageTransition = ref("page-forward");
	const isSettings = computed(() => getRoutePath().includes(SETTINGS));

	watchRoute(() => {
		showBanner.value = localedRoute.value === "";
	}, true);

	watchRoute((route, prevRoute) => {
		[route, prevRoute] = [removeI18nPrefix(route), removeI18nPrefix(prevRoute)];
		pageTransition.value = "page-jump";
		if (prevRoute.includes(route)) pageTransition.value = "page-backward";
		if (route.includes(prevRoute)) pageTransition.value = "page-forward";
		if (route.includes(SETTINGS) !== prevRoute.includes(SETTINGS)) pageTransition.value = "";
		if (prevRoute === route) pageTransition.value = "page-backward";
	});
</script>

<template>
	<Transition>
		<CssDoodle v-show="appConfig.showCssDoodle" :rule="background" class="background" />
	</Transition>
	<SideBar class="sidebar" />
	<div class="container" :class="{ scroll: isSettings }">
		<Transition name="settings" mode="out-in">
			<main v-if="!isSettings" class="scroll">
				<Banner :collapsed="!showBanner" />
				<Transition :name="pageTransition" mode="out-in">
					<div :key="localedRoute">
						<slot></slot>
					</div>
				</Transition>
			</main>
			<Settings v-else>
				<Transition name="page-jump" mode="out-in">
					<div :key="localedRoute" class="router-view">
						<slot></slot>
					</div>
				</Transition>
			</Settings>
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
		max-width: 1920px;
		margin: 0 auto;

		&:has(> .settings) {
			max-width: unset;
		}
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
	}
</style>
