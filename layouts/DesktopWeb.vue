<script setup lang="ts">
	import background from "assets/styles/css-doodles/background.css-doodle";
	import Settings from "./settings.vue";

	const props = defineProps<{
		isSettings?: boolean;
	}>();

	const showBanner = ref(false);

	watchRoute(() => {
		const localedRoute = getRoutePath();
		showBanner.value = localedRoute === "";
	}, true);
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
				<div>
					<slot></slot>
				</div>
			</main>
			<Settings v-else>
				<slot></slot>
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
			> :slotted(.container) {
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
