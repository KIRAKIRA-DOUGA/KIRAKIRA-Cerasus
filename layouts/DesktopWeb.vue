<script setup lang="ts">
	import background from "assets/styles/css-doodles/background.css-doodle";

	const showBanner = ref(false);

	watchRoute(() => {
		const localedRoute = getRoutePath();
		showBanner.value = localedRoute === "";
	}, true);
</script>

<template>
	<ClientOnly>
		<Transition name="background">
			<CssDoodle v-show="appConfig.showCssDoodle" :rule="background" class="background" />
		</Transition>
	</ClientOnly>
	<SideBar class="sidebar" />
	<div class="container">
		<Banner :collapsed="!showBanner" />
		<main>
			<slot></slot>
		</main>
	</div>
</template>

<style scoped lang="scss">
	.container {
		position: relative;
		z-index: 1;
		height: 100dvh;
		padding-left: $sidebar-width;
		overflow: hidden overlay;
		transition: $fallback-transitions, width 0s, height 0s;

		> main {
			> :slotted(*) {
				transform-origin: center 50dvh;
			}

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

		&.background-enter-from,
		&.background-leave-to {
			opacity: 0;
		}
	}
</style>
