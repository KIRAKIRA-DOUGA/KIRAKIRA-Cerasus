<script setup lang="ts">
	// import { numbers } from "virtual:scss-var:theme/_variables";
	// onMounted(() => console.log(numbers));
	// const windowSize = useWindowSize();
	// const isMobile = computed(() => windowSize.width.value <= numbers.mobileMaxWidth);
	// 以后使用以上代码可获取在 SCSS 文件中定义的移动端宽度值。

	const avatar = "/static/images/avatars/aira.webp";
	const showLogin = ref(false);
	const isLogined = ref(false);
	const isCurrentSettings = computed(() => !!currentSettingsPage());
	const [DefineAvatar, Avatar] = createReusableTemplate();
	const scopeId = useParentScopeId()!;

	useListen("app:requestLogin", () => showLogin.value = true);
	useListen("user:login", value => isLogined.value = value);

	/**
	 * 点击用户头像事件。未登录时提示登录，已登录时导航到个人主页。
	 */
	function onClickUser() {
		if (!isLogined.value) showLogin.value = true;
		else navigate("/user");
	}

	/**
	 * 显示移动端抽屉。
	 */
	function onClickDrawer() {
		useEvent("app:showDrawer");
	}
</script>

<template>
	<DefineAvatar>
		<UserAvatar
			v-tooltip="isLogined ? '艾草' : t.login"
			:avatar="isLogined ? avatar : undefined"
			@click="onClickUser"
		/>
	</DefineAvatar>

	<aside :class="{ colored: useAppSettingsStore().coloredSideBar }" :[scopeId]="''" role="toolbar" aria-label="side bar" aria-orientation="vertical">
		<div class="top icons">
			<SoftButton v-tooltip="t.home" icon="home" href="/" />
			<SoftButton v-tooltip="t.search" icon="search" href="/search" />
			<SoftButton v-tooltip="t.history" icon="history" />
			<SoftButton v-tooltip="t.favorites" icon="star" />
			<SoftButton v-tooltip="t.feed" icon="feed" />
			<SoftButton v-tooltip="t.upload" icon="upload" href="/upload" />
		</div>

		<div class="center">
			<Icon name="dehaze" class="pe decorative-icon" @click="onClickDrawer" />
			<Avatar class="pe" />
			<div class="stripes">
				<div v-for="i in 2" :key="i" class="stripe"></div>
			</div>
			<LogoText />
		</div>

		<div class="bottom icons">
			<Avatar class="pc" />
			<SoftButton v-tooltip="t.messages" icon="email" href="/test-rich-text-editor" />
			<SoftButton v-tooltip="t.settings" class="pc" icon="settings" href="/settings" :active="isCurrentSettings" />
			<SoftButton v-tooltip="t.search" class="pe" icon="search" href="/search" />
		</div>

		<LoginWindow v-model="showLogin" />
	</aside>

	<nav :[scopeId]="''">
		<div class="icons">
			<MobileBottomNavItem icon="home" href="/">{{ t.home }}</MobileBottomNavItem>
			<MobileBottomNavItem icon="category" href="/category">{{ t.category }}</MobileBottomNavItem>
			<MobileBottomNavItem icon="feed" href="/audio">{{ t.feed }}</MobileBottomNavItem>
		</div>
	</nav>
</template>

<style scoped lang="scss">
	$icons-gap: 8px;

	aside {
		@include sidebar-shadow;
		@include flex-center;
		--color: #{c(accent)};
		z-index: 30;
		flex-direction: column;
		justify-content: space-between;
		padding: $icons-gap 0;
		overflow: hidden;
		background-color: c(main-bg);

		&.colored {
			@include sidebar-shadow-colored;
			--color: white;
			background-color: c(accent);

			.soft-button {
				--white: true;
			}

			.decorative-icon,
			.logo-text {
				color: white;
			}
		}

		> * {
			flex-grow: 0;
			width: $sidebar-width;
		}

		&.ready {
			[style*="--i"] {
				animation: jump-in 300ms calc(var(--i) * 50ms) $ease-out-back both;
			}
		}

		.center {
			@include flex-center;
			width: max-content;
			rotate: -100grad;
			transition: $fallback-transitions, rotate 0s, padding 0s;

			.stripes {
				display: flex; // 结论：池沼 block 布局会恶意在元素之间加空隙还找不出原因。
				margin-right: 24px;
				transform: skewX(30deg);

				.stripe {
					display: inline-block;
					width: 8px;
					height: $sidebar-width;
					margin-right: 12px;
					background-color: var(--color);
				}

				@media (height < 678px) {
					margin-right: 0;
				}

				@media (height < 540px) {
					transform: none;
					opacity: 0;
				}
			}

			.logo-text {
				--form: hidden;

				@media (height >= 678px) {
					--form: half;
				}

				@media (height >= 765px) {
					--form: full;
				}
			}

			@media (height < 540px) {
				margin-top: -100%;
			}

			/* &.v-enter-from,
			&.v-leave-to {
				opacity: 0;

				.stripes {
					transform: none;
				}
			} */
		}

		.bottom {
			transition: $fallback-transitions, margin 0s;

			~ * {
				display: none;
			}
		}

		.soft-button {
			--ripple-size: 40px;
		}

		@include not-mobile {
			.pe {
				display: none;
			}
		}

		@include mobile {
			flex-direction: row;

			.top,
			.pc {
				display: none;
			}

			> * {
				width: initial;
			}

			.center {
				rotate: 0deg;
				gap: 8px;
				padding-left: 4px;

				.stripes {
					display: none;
				}

				.logo-text {
					--form: half !important;
				}
			}

			.bottom {
				margin-right: 4px;
			}

			.user-avatar {
				margin-right: 4px;
			}
		}
	}

	.icons {
		@include flex-center;
		flex-direction: column;
		gap: $icons-gap;

		@media (height <= 432px) {
			gap: 0;
		}

		.soft-button {
			&::after {
				@include oval(left);
				position: absolute;
				right: 0;
				z-index: 3;
				display: block;
				width: 3px;
				height: 24px;
				scale: 1 0;
				background-color: var(--color);
				content: "";

				@include mobile {
					display: none;
				}
			}

			&:has(.router-link-active)::after {
				scale: 1;
			}

			&:active::after {
				height: 14px;
			}
		}

		@include mobile {
			flex-direction: row;
		}
	}

	.user-avatar {
		--size: 40px;
	}

	.decorative-icon {
		$size: 24px;
		margin-left: calc($size / -2 - 4px);
		color: c(icon-color);
		font-size: $size;
		cursor: pointer;

		&:any-hover {
			color: c(accent);
		}

		&:active {
			opacity: 0.6;
		}
	}

	nav {
		@include sidebar-shadow;
		z-index: 30;
		padding: $icons-gap 0;
		overflow: hidden;
		background-color: c(main-bg);

		.icons {
			@include square(100%);
			justify-content: space-evenly;
		}
	}

	@keyframes jump-in {
		from {
			translate: -$sidebar-width;
		}
	}
</style>
