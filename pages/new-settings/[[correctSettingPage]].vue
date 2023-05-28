<script setup lang="ts">
	import { TestUserSetting, TestVideoSetting } from "#components";

	const currentSetting = ref("appearance");
	const showDrawer = ref(false);

	useEventListener("window", "resize", () => {
		if (window.innerWidth > 991) showDrawer.value = false;
	});

	useHead({ title: t.settings });

	// FIXME 如果本次 useRoute().params.correctSettingPage 没有取到 correctSettingPage 的值，那么就会使用上一次获取到的值时的缓存
	const correctSettingRouteName = computed(() => useRoute().params.correctSettingPage as string || "testUserSetting"); // 这里获取路由值并且设置路由值为空时默认显示的组件

	const settingPageComponentsMap = { // 这里配置路由值和显示的组件的对应列表
		testUserSetting: TestUserSetting,
		testVideoSetting: TestVideoSetting,
	};
	
	const correctSettingPage = shallowRef();

	const getCorrectSettingPage = (routeName: string) => {
		if (routeName === "testUserSetting" || routeName === "testVideoSetting") // WARN 这里必须和 settingPageComponentsMap 的 key 一致，但在 if 里穷举逻辑运算表达式一定不是最优雅的写法
			return settingPageComponentsMap[routeName];
		else
			return null;
	};
	onMounted(() => {
		correctSettingPage.value = getCorrectSettingPage(correctSettingRouteName.value);
	});
	const watchRouteCallback = () => {
		correctSettingPage.value = getCorrectSettingPage(correctSettingRouteName.value);
	};

	watchRoute(watchRouteCallback);
</script>

<template>
	<div v-bind="$attrs" class="settings">
		<ShadingIcon icon="settings" position="right top" rotating elastic />

		<nav :class="{ show: showDrawer }">
			<div class="content">
				<header class="title content padding-end">
					<TabBar v-model="currentSetting" vertical>
						<Subheader icon="person">用户设置</Subheader>

						<!-- // FIXME 在 TabItem 外面直接套 NuxtLink 的话，样式直接炸啦！ 请 TabItem 组件暴露一个可选的路由跳转地址属性。 -->
						<div>（Tab 的样式呢？）</div>

						<!-- // WARN 根据路由值动态切换活跃的 Tab 的功能还没做！ -->
						<NuxtLink to="/new-settings/testUserSetting">
							<TabItem id="my-account" icon="account_circle">aaaaaa用户设置</TabItem>
						</NuxtLink>
						<NuxtLink to="/new-settings/testVideoSetting">
							<TabItem id="personal-information" icon="badge">bbbbbb视频设置</TabItem>
						</NuxtLink>
					</TabBar>
					
				</header>
			</div>
		</nav>

		<div class="card">
			Route: {{ correctSettingRouteName }}
			<br />
			Component: {{ correctSettingPage }}
			<!-- // WARN 请修正动画效果 -->
			<Transition name="page-forward">
				<component :is="correctSettingPage" />
			</Transition>
		</div>

		<Transition>
			<div v-if="showDrawer" class="mask" @click="showDrawer = false"></div>
		</Transition>
	</div>
</template>

<style scoped lang="scss">
	$title-padding-top: 26px;
	$nav-padding-x: 24px;
	$main-padding-x: 48px;
	$show-drawer-duration: 500ms;
	$nav-width: 245px + 2 * $nav-padding-x;
	$max-width: 960px;

	.settings {
		--side-width: calc(max((100% - #{$max-width + $nav-width}) / 2, 0px)); // 注意这里的 0px 一旦省略 px 就会报错，因此不能去掉单位。
		position: relative;
		min-height: 100dvh;
		background-color: c(gray-20);
	}

	nav {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 5;
		width: $nav-width;
		height: 100%;
		margin-left: var(--side-width);

		@include tablet {
			@include system-card;
			background-color: c(acrylic-bg, 75%);
			transition-duration: $show-drawer-duration;

			&:not(.show) {
				translate: -$nav-width - 16px;
			}
		}

		@include computer {
			display: block !important;
		}

		> .content > .title.content {
			@include flex-block;
			gap: 10px;
			max-height: 100dvh;
			padding: 0 $nav-padding-x;
			overflow-y: overlay;
			transition: none;

			> * {
				flex-shrink: 0;
			}
		}

		.subheader {
			margin: 10px 0;
			cursor: default;
		}
	}

	.nav-bottom-buttons {
		@include flex-block;
		flex-direction: column;
		gap: 8px;
	}

	:is(nav, main) > .content {
		height: 100%;

		> * {
			flex-shrink: 0;
		}
	}

	.card {
		@include card-shadow;
		@include square(100%);
		position: absolute;
		z-index: 5;
		pointer-events: none;
	}

	.card,
	main {
		--margin-left: calc(var(--side-width) + #{$nav-width});

		@include computer {
			margin-left: var(--margin-left);

			> .content {
				width: calc(100% - var(--margin-left));
			}
		}
	}

	main {
		position: relative;
		z-index: 2;
		width: 100%;
		min-height: 100dvh;
		background-color: c(main-bg);
		transition: $fallback-transitions, width 0s, height 0s;

		> .content {
			@include flex-block;
			position: relative;
			z-index: 1;
			gap: 1rem;
			max-width: $max-width;
			padding: 0 $main-padding-x;
		}
	}

	.padding-end {
		@include fix-page-end-padding(false);
	}

	h1,
	h2 {
		color: c(accent);
		font-weight: bold;
		font-size: calc(1.275rem + 0.3dvw);
	}

	.title {
		position: sticky;
		top: 0;
		z-index: 2;
		padding-top: $title-padding-top;
		backdrop-filter: blur(4px);
	}

	.nav-header {
		margin-right: #{-$nav-padding-x};
		margin-bottom: -10px;
		margin-left: #{-$nav-padding-x};
		padding-right: $nav-padding-x;
		padding-bottom: 10px;
		padding-left: $nav-padding-x;
		background-color: c(gray-20, 80%);

		h1 {
			margin-bottom: 10px;
		}
	}

	.page-header {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		margin-right: #{-$main-padding-x};
		margin-bottom: -0.5rem;
		margin-left: #{-$main-padding-x};
		padding-right: $main-padding-x;
		padding-bottom: 0.5rem;
		padding-left: $main-padding-x;
		background-color: c(main-bg, 80%);

		.show-drawer-wrapper {
			position: relative;
			width: 20px;
			height: 100%;

			.soft-key {
				position: absolute;
				top: calc((var(--wrapper-size) - 100%) / -2);
				left: -10px;
			}

			@include computer {
				display: none;
			}
		}
	}

	.mask {
		@include full-screen(absolute);
		z-index: 4;
		background-color: c(main-bg, 50%);
		transition-duration: $show-drawer-duration;

		&.v-enter-from,
		&.v-leave-to {
			opacity: 0;
		}

		&.v-leave-active {
			pointer-events: none;
		}

		@include computer {
			display: none;
		}
	}

	.chip {
		@include chip-shadow;
		@include radius-large;
		overflow: hidden;
	}

	.radio-group .radio-button {
		$extra-padding: 16px;
		padding: 10px 20px;

		&:first-child {
			padding-top: $extra-padding;
		}

		&:last-child {
			padding-bottom: $extra-padding;
		}
	}
</style>
