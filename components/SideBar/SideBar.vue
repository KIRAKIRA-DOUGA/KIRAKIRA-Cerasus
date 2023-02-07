<script setup lang="ts">
	import { LogoTextFormType } from "components/Logo/Text.vue";

	const logoTextForm = ref<LogoTextFormType>("hidden");
	const showStripes = ref(false);
	const ready = ref(false);

	onMounted(() => {
		/**
		 * 窗口大小改变时的回调函数。
		 */
		function onResize() {
			const height = window.innerHeight;
			logoTextForm.value = height < 678 ? "hidden" : height < 765 ? "half" : "full";
			showStripes.value = height >= 540;
		}
		window.addEventListener("resize", onResize);
		onResize();
		ready.value = true;
		setTimeout(() => (ready.value = false), 2000); // 定时移除开场动画。
	});
</script>

<template>
	<div class="sidebar" :class="{ ready }">
		<div class="top icons">
			<SideBarButton v-i="0" title="主页" icon="home" to="/" />
			<SideBarButton v-i="1" title="搜索" icon="search" to="/search" />
			<SideBarButton v-i="2" title="历史" icon="history" />
			<SideBarButton v-i="3" title="收藏" icon="star" />
			<SideBarButton v-i="4" title="关注" icon="feed" />
			<SideBarButton v-i="5" title="投稿" icon="upload" />
		</div>

		<Transition name="stripes">
			<div v-if="showStripes" v-i="6" class="center">
				<div class="stripes">
					<div v-for="i in 2" :key="`stripe-${i}`" class="stripe"></div>
				</div>
				<LogoText :form="logoTextForm" />
			</div>
		</Transition>

		<div class="bottom icons">
			<SideBarButton v-i="7" title="我的" icon="person" />
			<SideBarButton v-i="8" title="消息" icon="email" />
			<SideBarButton v-i="9" title="设置" icon="settings" to="/settings" />
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

		> * {
			flex-grow: 0;
			width: $sidebar-width;
		}

		&.ready [style*="--i"] {
			animation: jump-in 300ms calc(var(--i) * 50ms) $ease-out-back both;
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
				display: flex; // 结论：池沼 block 布局会恶意在元素之间加空隙还找不出原因。
				margin-right: 24px;
				transform: skewX(30deg);

				.stripe {
					display: inline-block;
					width: 8px;
					height: $sidebar-width;
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

	@keyframes jump-in {
		from {
			translate: -$sidebar-width;
		}
	}
</style>
