<script setup lang="ts">
	const currentSetting = computed({
		get: () => currentSettingsPage(),
		set: id => navigate(`/settings/${id}`),
	});
	const search = ref("");
	const main = ref<HTMLElement>();
	const showDrawer = ref(false);
	const ti = (id: string) => t[new VariableName(id).snake];
	const title = computed(() => ti(currentSetting.value));
	const htmlTitle = computed(() => title.value + " - " + t.settings);
	const logout = () => useEvent("user:login", false);

	useEventListener("window", "resize", () => {
		if (window.innerWidth > 991) showDrawer.value = false;
	});

	const settings = {
		personal: [
			{ id: "dashboard", icon: "dashboard" },
			{ id: "profile", icon: "badge" },
			{ id: "traces", icon: "history" },
			{ id: "privacy", icon: "shield" },
			{ id: "security", icon: "lock" },
			{ id: "account-linking", icon: "groups" },
			{ id: "blocklist", icon: "block" },
		],
		general: [
			{ id: "appearance", icon: "palette" },
			{ id: "player", icon: "play" },
			{ id: "danmaku", icon: "clear_all" },
			{ id: "preference", icon: "star" },
			{ id: "language", icon: "translate" },
			{ id: "accessibility", icon: "accessibility" },
			{ id: "about", icon: "info" },
			{ id: "acknowledgement", icon: "campaign" },
		],
	};

	useHead({ title: htmlTitle });
</script>

<template>
	<div v-bind="$attrs" class="settings">
		<ShadingIcon icon="settings" position="right top" rotating elastic />

		<nav :class="{ show: showDrawer }">
			<div class="content">
				<header class="title content padding-end">
					<header class="title nav-header">
						<h1>{{ t.settings }}</h1>
						<TextBox v-model="search" type="search" :placeholder="t.search_settings" />
					</header>
					<TabBar v-model="currentSetting" vertical>
						<Subheader icon="person">{{ t.user_settings }}</Subheader>
						<TabItem v-for="setting in settings.personal" :id="setting.id" :key="setting.id" :icon="setting.icon" @click="showDrawer = false">{{ ti(setting.id) }}</TabItem>
						<Subheader icon="apps">{{ t.app_settings }}</Subheader>
						<TabItem v-for="setting in settings.general" :id="setting.id" :key="setting.id" :icon="setting.icon" @click="showDrawer = false">{{ ti(setting.id) }}</TabItem>
					</TabBar>
					<div class="nav-bottom-buttons">
						<Button icon="logout" @click="logout">{{ t.logout }}</Button>
						<Button href="/components">组件测试页</Button>
					</div>
				</header>
			</div>
		</nav>

		<div class="card"></div>
		<main ref="main">
			<div class="content padding-end">
				<header class="title page-header">
					<div class="show-drawer-wrapper">
						<SoftButton icon="dehaze" @click="showDrawer = true" />
					</div>
					<div class="page-title-wrapper">
						<Transition>
							<h2 :key="currentSetting">{{ title }}</h2>
						</Transition>
					</div>
				</header>
				<slot></slot>
			</div>
		</main>

		<Transition>
			<div v-if="showDrawer" class="mask" @click="showDrawer = false"></div>
		</Transition>
	</div>
</template>

<style scoped lang="scss">
	@use "styles/elements/toolbox-card" as *;

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
		background-color: c(gray-5);
		transition: $fallback-transitions, width 0s, height 0s, min-height 0s;
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
			display: flex;
			flex-direction: column;
			gap: 10px;
			max-height: 100dvh;
			padding: 0 $nav-padding-x;
			overflow-y: overlay;
			transition: none;
			// scrollbar-gutter: stable; // WARN: Chromium 114 开始，overflow 的 overlay 成了 auto 的别名，因此只能提前占位显示来确保不晃动。目前甚至 Chromium 自己的设置页都在依赖于 overlay，太荒谬了。https://bugs.chromium.org/p/chromium/issues/detail?id=1450927

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
		display: flex;
		flex-direction: column;
		gap: 8px;
		
		> button {
			width: 100%;
		}
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
		transition: $fallback-transitions, width 0s, height 0s, min-height 0s;

		> .content {
			position: relative;
			z-index: 1;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			max-width: $max-width;
			padding: 0 $main-padding-x;

			> :deep(.router-view) {
				display: flex;
				flex-direction: column;
				gap: 1rem;
			}
		}
	}

	.padding-end {
		@include fix-page-end-padding(false);
	}

	h1,
	h2,
	.page-title-wrapper {
		color: c(accent);
		font-weight: bold;
		font-size: calc(1.275rem + 0.3dvw);
	}

	.page-title-wrapper {
		position: relative;
		width: 100%;
		height: 1.5em;
		margin-top: -0.1em;
		margin-bottom: -0.15em;
		overflow-y: hidden;

		@include computer {
			margin-top: 0;
			margin-bottom: -0.25em;
		}
	}

	h2 {
		position: absolute;

		&.v-enter-active,
		&.v-leave-active {
			transition: all $ease-out-smooth 700ms;
		}

		&.v-leave-to {
			translate: 0 -100%;
		}

		&.v-enter-from {
			translate: 0 100%;
		}
	}

	.title {
		position: sticky;
		top: 0;
		z-index: 4;
		padding-top: $title-padding-top;

		&.nav-header,
		&.page-header {
			backdrop-filter: blur(4px);
		}
	}

	.nav-header {
		margin-right: #{-$nav-padding-x};
		margin-bottom: -10px;
		margin-left: #{-$nav-padding-x};
		padding-right: $nav-padding-x;
		padding-bottom: 10px;
		padding-left: $nav-padding-x;
		background-color: c(gray-5, 80%);

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

			.soft-button {
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
		@include full-screen(fixed);
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

	%chip,
	:deep(.chip) {
		@include chip-shadow;
		@include round-large;
		overflow: hidden;
		background-color: c(surface-color);
	}

	:deep(section) {
		@extend %chip;
		$padding: 10px 20px;
		overflow: hidden;
		
		&[list] > * {
			$extra-padding: 16px;
			padding: $padding;
			overflow: visible;

			&:has(.ripple-circle) {
				overflow: hidden;
			}

			&:first-child {
				padding-top: $extra-padding;
			}

			&:last-child {
				padding-bottom: $extra-padding;
			}

			&:any-hover {
				background-color: c(hover-overlay);
			}
		}
		
		&[grid] {
			@include videos-grid;
			padding: $padding;
		}
	}

	:deep(.submit) {
		display: flex;
		gap: 5px;
		justify-content: flex-end;
	}
</style>
