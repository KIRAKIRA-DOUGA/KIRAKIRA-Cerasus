<docs>
	# 响应式布局
</docs>

<script setup lang="ts">
	import { Analytics } from "@vercel/analytics/nuxt";

	const backgroundImageSettingsStore = useAppSettingsStore().backgroundImage;
	const backgroundImages = useBackgroundImages();
	const showDrawer = ref(false);
	const isSettingsPage = ref(false);

	const route = useRoute();
	const hideAppBar = ref(false);
	const flatAppBar = ref(false);
	const hideBottomNav = ref(false);
	const appBarTitle = ref<string | undefined>();

	function pageLoaded() {
		isSettingsPage.value = !!currentSettingsPage();
		hideAppBar.value = Boolean(route.meta.hideAppBar);
		flatAppBar.value = Boolean(route.meta.flatAppBar);
		hideBottomNav.value = Boolean(route.meta.hideBottomNav);

		const appBarTitleTemp = route.meta.appBarTitle as string | undefined;
		if (appBarTitleTemp?.startsWith("t.")) appBarTitle.value = t(2)[appBarTitleTemp.slice(2)];
		else appBarTitle.value = route.meta.appBarTitle as string | undefined;
	}

	// SSR
	pageLoaded();
	// CSR
	const nuxtApp = useNuxtApp();
	nuxtApp.hook("page:finish", () => {
		pageLoaded();
	});

	useListen("app:showDrawer", () => showDrawer.value = true);
</script>

<template>
	<ClientOnly>
		<div v-if="backgroundImages.shown" class="background" :style="{ opacity: backgroundImageSettingsStore.opacity }">
			<Transition appear>
				<img :src="backgroundImages.currentImage" :style="{ filter: `blur(${backgroundImageSettingsStore.blur}px)` }" />
			</Transition>
			<div class="overlay" :style="{ opacity: backgroundImageSettingsStore.tint }"></div>
		</div>
	</ClientOnly>
	<Transition>
		<LogoOffcanvasStar v-if="showDrawer" />
	</Transition>
	<Transition>
		<Offcanvas v-if="showDrawer" v-model="showDrawer" />
	</Transition>
	<div class="viewport">
		<Analytics />
		<SideBar :hideAppBar :flatAppBar :hideBottomNav :isSettingsPage :overrideLogoText="showDrawer ? t.navigation.back : undefined" />
		<ScrollContainer
			scrollElId="mainScroller"
			class="container"
			:overflowX="isSettingsPage ? 'hidden' : undefined"
			:style="{ '--padding-top': hideAppBar ? '0' : undefined, '--padding-bottom': hideBottomNav ? '0' : undefined }"
		>
			<Banner />
			<div class="router-view">
				<slot></slot>
			</div>
		</ScrollContainer>
		<div v-if="showDrawer" class="hide-drawer-mask" @click="showDrawer = false"></div>
	</div>
</template>

<style scoped lang="scss">
	.scroll-container {
		position: relative;
		width: 100dvw;
		height: 100dvh;
		transition: $fallback-transitions, width 0s, height 0s;

		@include not-mobile {
			--padding-left: #{$sidebar-width};
		}

		@include mobile {
			--padding-top: #{$mobile-toolbar-height};
			--padding-bottom: #{$mobile-toolbar-height};
		}

		@layer layout {
			> .scroller > .content > .router-view:deep() > .container {
				padding: 26px $page-padding-x;

				@include tablet {
					padding: $page-padding-x-tablet;
				}

				@include mobile {
					padding: $page-padding-x-mobile;
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

	.background {
		position: fixed;
		inset: 0;
		z-index: 0;
		opacity: 0.2;
		transition: $fallback-transitions, scale $ease-out-max 1s;

		img {
			@include square(100%);
			position: fixed;
			inset: 0;
			object-fit: cover;

			&.v-enter-from,
			&.v-leave-to {
				scale: 1.1;
				opacity: 0;
			}

			&.v-enter-active,
			&.v-leave-active {
				transition: scale $ease-out-smooth 1s, opacity ease 1s;
			}
		}

		.overlay {
			@include square(100%);
			position: fixed;
			inset: 0;
			background-color: c(accent);
			opacity: 0.75;
			mix-blend-mode: screen;
		}

		&:has(~ .offcanvas:not(.v-leave-to)) {
			scale: 1.08;
			transition: $fallback-transitions, scale $ease-out-max 500ms;
		}
	}

	@include not-mobile {
		nav {
			display: none;
		}
	}

	@include mobile {
		aside,
		nav {
			width: 100dvw;
			height: $mobile-toolbar-height;
		}
	}

	.viewport:has(> .hide-drawer-mask) {
		transition-duration: 600ms;

		&:any-hover:active {
			transform-origin: 7% center !important;
			scale: 0.975;
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
