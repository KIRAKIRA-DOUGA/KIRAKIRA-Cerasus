<script setup lang="ts">
	import { LogoTextFormType } from "components/Logo/LogoText.vue";
	import avatar from "assets/images/aira.jpg";

	const logoTextForm = ref<LogoTextFormType>("hidden");
	const showStripes = ref(false);
	const ready = ref(false);
	const showLogin = ref(false);
	const isLogined = ref(false);

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
		setTimeout(() => ready.value = false, 2000); // 定时移除开场动画。
	});

	useListen("app:requestLogin", () => showLogin.value = true);
	useListen("user:login", value => isLogined.value = value);
</script>

<template>
	<aside :class="{ ready }">
		<div class="top icons">
			<SideBarButton v-i="0" title="主页" icon="home" to="/" />
			<SideBarButton v-i="1" title="搜索" icon="search" to="search" />
			<SideBarButton v-i="2" title="历史" icon="history" />
			<SideBarButton v-i="3" title="收藏" icon="star" />
			<SideBarButton v-i="4" title="关注" icon="feed" />
			<SideBarButton v-i="5" title="投稿" icon="upload" />
		</div>

		<Transition name="stripes">
			<div v-show="showStripes" v-i="6" class="center">
				<div class="stripes">
					<div v-for="i in 2" :key="i" class="stripe"></div>
				</div>
				<LogoText :form="logoTextForm" />
			</div>
		</Transition>

		<div class="bottom icons">
			<SideBarButton
				v-if="!isLogined"
				v-i="7"
				title="我的"
				icon="person"
				class="person"
				@click="showLogin = true"
			/>
			<div
				v-else
				v-i="7"
				v-ripple
				title="艾草"
				class="person logined"
				@click="showLogin = true"
			>
				<img :src="avatar" alt="avatar" draggable="false" />
			</div>
			<SideBarButton v-i="8" title="消息" icon="email" to="test-rich-text-editor" />
			<SideBarButton v-i="9" title="设置" icon="settings" to="components" />
		</div>

		<LoginWindow v-model="showLogin" />
	</aside>
</template>

<style scoped lang="scss">
	$icons-gap: 8px;

	aside {
		@include sidebar-shadow;
		@include flex-center;
		z-index: 30;
		flex-direction: column;
		justify-content: space-between;
		width: $sidebar-width;
		padding: $icons-gap 0;
		background-color: c(main-bg);

		> * {
			flex-grow: 0;
			width: $sidebar-width;
		}

		&.ready {
			overflow: hidden;

			[style*="--i"] {
				animation: jump-in 300ms calc(var(--i) * 50ms) $ease-out-back both;
			}
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
			rotate: -100grad;

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

		.bottom ~ * {
			display: none;
		}
	}

	.person {
		@include square(40px);
		@include circle;
		overflow: hidden;

		&:has(svg) {
			background: c(gray-30);
		}

		> img {
			z-index: 1;
			width: 100%;
		}

		&.logined {
			transform-origin: left center;

			&:hover {
				scale: 200%;
			}
		}
	}

	@keyframes jump-in {
		from {
			translate: -$sidebar-width;
		}
	}
</style>
