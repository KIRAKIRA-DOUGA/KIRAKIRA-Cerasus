<docs>
	# 响应式布局
</docs>

<script setup lang="ts">
	import background from "assets/styles/css-doodles/background.css-doodle";

	const container = ref<HTMLDivElement>();
	const containerMain = ref<HTMLElement>();
	const cssDoodle = refComp();
	const showCssDoodle = computed(() => useAppSettingsStore().showCssDoodle);
	const backgroundImageSettingsStore = useAppSettingsStore().backgroundImage;
	const showDrawer = ref(false);
	const isCurrentSettings = ref(false);

	// SSR
	isCurrentSettings.value = !!currentSettingsPage();
	// CSR
	const nuxtApp = useNuxtApp();
	nuxtApp.hook("page:finish", () => {
		isCurrentSettings.value = !!currentSettingsPage();
	});

	useListen("app:showDrawer", () => showDrawer.value = true);

	onMounted(() => {
		setDisplayVisible(cssDoodle.value, showCssDoodle.value);
	});
</script>

<template>
	<Transition>
		<Offcanvas v-if="showDrawer" v-model="showDrawer" />
	</Transition>
	<div class="viewport">
		<ClientOnly>
			<Transition>
				<CssDoodle v-show="showCssDoodle" ref="cssDoodle" :rule="background" class="background-doodle" />
			</Transition>
			<div v-if="backgroundImageSettingsStore.image.data" class="background" :style="{ opacity: backgroundImageSettingsStore.opacity }">
				<img :src="backgroundImageSettingsStore.image.data" :style="{ filter: `blur(${backgroundImageSettingsStore.blur}px)` }" />
				<div class="overlay" :style="{ opacity: backgroundImageSettingsStore.tint }"></div>
			</div>
		</ClientOnly>
		<SideBar />
		<main ref="container" class="container">
			<Banner />
			<div class="router-view" :class="{ 'is-settings': isCurrentSettings }">
				<slot></slot>
			</div>
		</main>
		<div v-if="showDrawer" class="hide-drawer-mask" @click="showDrawer = false"></div>
	</div>
</template>

<style scoped lang="scss">
	.container {
		position: relative;
		padding-left: $sidebar-width;
		transition: $fallback-transitions, width 0s, height 0s;

		@layer layout {
			> .router-view:deep() > .container {
				padding: 26px $page-padding-x;

				@include tablet {
					padding: 26px $page-padding-x-tablet;
				}

				@include mobile {
					padding: $page-padding-x-mobile;
					padding-bottom: $page-padding-x-mobile + $mobile-toolbar-height;
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

	.background-doodle {
		opacity: 0.3;

		&.v-enter-from,
		&.v-leave-to {
			opacity: 0;
		}
	}

	.background {
		position: fixed;
		inset: 0;
		z-index: 0;
		opacity: 0.2;

		img {
			@include square(100%);
			position: fixed;
			inset: 0;
			object-fit: cover;
		}

		.overlay {
			@include square(100%);
			position: fixed;
			inset: 0;
			background-color: c(accent);
			opacity: 0.75;
			mix-blend-mode: screen;
		}
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
	}

	.viewport {
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
			overflow: clip;
			transform: translateX(60dvw) scale(0.8);
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
			scale: 0.8;
			opacity: 0;
		}
	}

	.hide-drawer-mask {
		position: absolute;
		inset: 0;
		z-index: 99;
		cursor: pointer;
	}
</style>

<style lang="scss">
	body:has(.router-view.is-settings) {
		overflow-x: hidden;
		overscroll-behavior: none;
	}
</style>
