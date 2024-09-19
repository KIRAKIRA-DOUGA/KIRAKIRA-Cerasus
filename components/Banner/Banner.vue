<docs>
	页面顶部的 Banner（横幅）。
</docs>

<script setup lang="ts">
	const page = ref("other");
	const pageListStandard = [
		{ name: "search", englishName: "Search", icon: "search" },
		{ name: "history", englishName: "History", icon: "history" },
		{ name: "favorite", englishName: "Favorite", icon: "star" },
		{ name: "feed", englishName: "Feed", icon: "feed" },
		{ name: "upload", englishName: "Upload", icon: "upload" },
	] as const;

	/**
	 * 检测当前页面并更新 page 的值。
	 */
	function updateCurrentPage() {
		const localedRoute = getRoutePath();
		if (localedRoute === "") page.value = "home";
		else if (localedRoute.startsWith("user")) page.value = "user";
		else if (localedRoute.startsWith("search")) page.value = "search";
		else if (localedRoute.startsWith("history")) page.value = "history";
		else if (localedRoute.startsWith("favorite")) page.value = "favorite";
		else if (localedRoute.startsWith("feed")) page.value = "feed";
		else if (localedRoute.startsWith("upload")) page.value = "upload";
		else page.value = "other";
	}

	// SSR 首屏加载。
	updateCurrentPage();

	// CSR 切换页面。
	const nuxtApp = useNuxtApp();
	nuxtApp.hook("page:finish", () => {
		updateCurrentPage();
	});

	const banner = "/static/images/banner-20220717.png";
</script>

<template>
	<Transition>
		<Comp v-if="page !== 'other'" class="opened" role="banner">
			<div class="bg">
				<Transition :duration="{ enter: 1000, leave: 100 }">
					<BannerBackgroundHistory v-if="page === 'history'" />
					<BannerBackgroundFavorite v-else-if="page === 'favorite'" />
				</Transition>
			</div>
			<Transition name="page-jump">
				<LogoCover v-if="page === 'home'" noAnimation />
				<NuxtImg v-else-if="page === 'user'" class="page-user" :src="banner" :key="banner" />
				<BannerStandard
					v-else
					:name="t[pageListStandard.find(i => i.name === page)!.name]"
					:icon="pageListStandard.find(i => i.name === page)!.icon"
					:englishName="pageListStandard.find(i => i.name === page)!.englishName"
				/>
			</Transition>
			<div class="shadow"></div>
		</Comp>
	</Transition>
</template>

<style scoped lang="scss">
	:comp {
		@include flex-center;
		position: relative;
		width: 100%;
		overflow: clip;

		> * {
			&:not(.logo-cover) {
				@include square(100%);
				position: absolute;
				inset: 0;
			}
		}

		> .logo-cover {
			--width: 100dvw;
			--height: 280px;
			--full-logo: true;

			@media (width < 625px) {
				--full-logo: false;
			}
		}

		> .page-user {
			object-fit: cover;
		}

		&.opened {
			height: $banner-height;

			> .shadow {
				position: absolute;
				bottom: 0;
				width: 100%;
				height: 100%;
				background: linear-gradient(transparent 95%, c(black, 25%) 100%);
				opacity: 0.1;
				pointer-events: none;
			}

			&.v-enter-from,
			&.v-leave-to {
				height: 0;

				> .shadow {
					background: linear-gradient(transparent 30%, c(black, 5%) 100%);
					opacity: 1;
				}
			}
		}

		&,
		* {
			transition: all $ease-out-smooth 600ms;
		}

		.bg > {
			.v-enter-from,
			.v-leave-to {
				opacity: 0;
			}
		}
	}
</style>
