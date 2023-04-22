<script setup lang="ts">
	import { LogoTextFormType } from "components/Logo/LogoText.vue";
	import avatar from "assets/images/aira.jpg";

	const logoTextForm = ref<LogoTextFormType>("hidden");
	const showStripes = ref(false);
	// const ready = ref(false);
	const showLogin = ref(false);
	const isLogined = ref(false);

	/**
	 * 窗口大小改变时的回调函数。
	 */
	function onResize() {
		const height = window.innerHeight;
		logoTextForm.value = height < 678 ? "hidden" : height < 765 ? "half" : "full";
		showStripes.value = height >= 540;
	}

	onMounted(() => {
		onResize();
		window.addEventListener("resize", onResize);
		// ready.value = true;
		// setTimeout(() => ready.value = false, 2000); // 定时移除开场动画。
		// 图标已经支持 SSR，不需要做动画了。
	});

	onUnmounted(() => {
		window.removeEventListener("resize", onResize);
	});

	useListen("app:requestLogin", () => showLogin.value = true);
	useListen("user:login", value => isLogined.value = value);
</script>

<template>
	<aside>
		<div class="top icons">
			<LargeRippleButton v-i="0" title="主页" icon="home" href="/" />
			<LargeRippleButton v-i="1" title="搜索" icon="search" href="search" />
			<LargeRippleButton v-i="2" title="历史" icon="history" />
			<LargeRippleButton v-i="3" title="收藏" icon="star" />
			<LargeRippleButton v-i="4" title="关注" icon="feed" />
			<LargeRippleButton v-i="5" title="投稿" icon="upload" />
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
			<LargeRippleButton
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
			<LargeRippleButton v-i="8" title="消息" icon="email" href="test-rich-text-editor" />
			<LargeRippleButton v-i="9" title="设置" icon="settings" href="settings" />
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
		overflow: hidden;
		background-color: c(main-bg);

		> * {
			flex-grow: 0;
			width: $sidebar-width;
		}

		&.ready {
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
				opacity: 0;

				.stripes {
					transform: none;
				}
			}
		}

		.bottom ~ * {
			display: none;
		}

		.large-ripple-button {
			--ripple-size: 40px;
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
			aspect-ratio: 1 / 1;
			object-fit: cover;

			&:hover {
				scale: 125%;
			}

			&:not(:hover) {
				transition-duration: 1s;
			}
		}
	}

	@keyframes jump-in {
		from {
			translate: -$sidebar-width;
		}
	}
</style>
