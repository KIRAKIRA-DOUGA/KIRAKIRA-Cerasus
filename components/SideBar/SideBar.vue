<script setup lang="ts">
	import { LogoTextFormType } from "components/Logo/Text.vue";

	const logoTextForm = ref<LogoTextFormType>("hidden");
	const showStripes = ref(false);

	onMounted(() => {
		function onResize() {
			const height = window.innerHeight;
			logoTextForm.value = height < 678 ? "hidden" : height < 765 ? "half" : "full";
			showStripes.value = height >= 540;
		}
		window.addEventListener("resize", onResize);
		onResize();
	});
</script>

<template>
	<div class="sidebar">
		<div class="top icons">
			<SideBarButton title="主页" icon="home" to="/" />
			<SideBarButton title="搜索" icon="search" to="/search" />
			<SideBarButton title="历史" icon="history" />
			<SideBarButton title="收藏" icon="star" />
			<SideBarButton title="关注" icon="feed" />
			<SideBarButton title="投稿" icon="upload" />
		</div>

		<Transition name="stripes">
			<div v-if="showStripes" class="center">
				<div class="stripes">
					<div v-for="i in 2" :key="`stripe-${i}`" class="stripe"></div>
				</div>
				<LogoText :form="logoTextForm" />
			</div>
		</Transition>

		<div class="bottom icons">
			<SideBarButton title="我的" icon="person" />
			<SideBarButton title="消息" icon="email" />
			<SideBarButton title="设置" icon="settings" to="/settings" />
		</div>
	</div>
</template>

<style scoped lang="scss">
	$icons-gap: 8px;

	.sidebar {
		@include sidebar-shadow;
		@include flex-center;
		z-index: 50;
		flex-direction: column;
		justify-content: space-between;
		width: $sidebar-width;
		padding: $icons-gap 0;
		overflow: hidden;
		background-color: c(main-bg);

		> div {
			flex-grow: 0;
			width: $sidebar-width;
		}

		.icons {
			@include flex-center;
			flex-direction: column;
			gap: $icons-gap;

			@media (max-height: 432px) {
				gap: 0;
			}
		}

		.center {
			@include flex-center;
			width: max-content;
			rotate: -90deg;

			.stripes {
				margin-right: 24px;
				transform: skewX(30deg);

				.stripe {
					display: inline-block;
					width: 8px;
					height: $sidebar-width * 1.5;
					margin-right: 12px;
					background-color: c(accent);
				}

				&:has(+ .hidden) {
					margin-right: 0;
				}
			}

			&.stripes-enter-from,
			&.stripes-leave-to {
				.stripes {
					transform: none;
					opacity: 0;
				}
			}
		}
	}
</style>
