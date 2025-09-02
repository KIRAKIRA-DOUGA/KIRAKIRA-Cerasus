<docs>
	页面顶部的 Banner（横幅）。
</docs>

<script setup lang="ts">
	const currentPage = ref("other");
	const pageListStandard = [
		{ id: "search", name: "search", englishName: "Search", icon: "search" },
		{ id: "history", name: "history", englishName: "History", icon: "history" },
		{ id: "collections", name: "collection", englishName: "Collections", icon: "star" },
		{ id: "feed_following", name: "feed.following", englishName: "Following", icon: "feed" },
		{ id: "upload", name: "upload", englishName: "Upload", icon: "upload" },
	] as const;

	/**
	 * 检测当前页面并更新 page 的值。
	 */
	function updateCurrentPage() {
		const localedRoute = getRoutePath();
		if (localedRoute === "") currentPage.value = "home";
		else if (localedRoute.startsWith("user")) currentPage.value = "user";
		else if (localedRoute.startsWith("search")) currentPage.value = "search";
		else if (localedRoute.startsWith("history")) currentPage.value = "history";
		else if (localedRoute.startsWith("collections")) currentPage.value = "collections";
		else if (localedRoute.startsWith("feed/following")) currentPage.value = "feed_following";
		else if (localedRoute.startsWith("upload")) currentPage.value = "upload";
		else currentPage.value = "other";
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
		<Comp v-if="currentPage !== 'other'" class="opened" role="banner">
			<div class="bg">
				<Transition :duration="{ enter: 1000, leave: 100 }">
					<BannerBackgroundHistory v-if="currentPage === 'history'" />
					<BannerBackgroundCollections v-else-if="currentPage === 'collections'" />
				</Transition>
			</div>
			<Transition name="page-jump-in">
				<LogoCover v-if="currentPage === 'home'" noAnimation />
				<NuxtImg v-else-if="currentPage === 'user'" class="page-user" :src="banner" :key="banner" />
				<BannerStandard
					v-else
					:name="t(2)[pageListStandard.find(i => i.id === currentPage)!.name]"
					:icon="pageListStandard.find(i => i.id === currentPage)!.icon"
					:englishName="pageListStandard.find(i => i.id === currentPage)!.englishName"
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

		@include mobile {
			display: none;
		}

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
		}

		> .page-user {
			@include square(100%);
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
