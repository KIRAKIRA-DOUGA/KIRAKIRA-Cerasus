<script setup lang="ts">
	// import { numbers } from "virtual:scss-var:theme/_variables";
	// onMounted(() => console.log(numbers));
	// const windowSize = useWindowSize();
	// const isMobile = computed(() => windowSize.width.value <= numbers.mobileMaxWidth);
	// 以后使用以上代码可获取在 SCSS 文件中定义的移动端宽度值。

	const selfUserInfoStore = useSelfUserInfoStore();
	const showLogin = ref(false);
	const isCurrentSettings = ref(false);
	const [DefineAvatar, Avatar] = createReusableTemplate();
	const scopeId = useParentScopeId()!;
	const flyoutNotification = ref<FlyoutModel>();

	// SSR
	isCurrentSettings.value = !!currentSettingsPage();
	// CSR
	const nuxtApp = useNuxtApp();
	nuxtApp.hook("page:finish", () => {
		isCurrentSettings.value = !!currentSettingsPage();
	});

	/**
	 * 判断用户是否合法，或者判断用户是否已经登录
	 */
	async function checkUser(): Promise<boolean> {
		const checkUserResult = await api.user.checkUserToken();
		return checkUserResult.success && !!checkUserResult.userTokenOk;
	}

	/**
	 * 如果用户已登录，则根据 cookie 中的 uid 和 token 来获取用户信息（同时具有验证用户 token 的功能）
	 * 如果未登录或验证不成功，则清空全局变量中的用户信息并清空残留 cookie
	 */
	async function getUserInfo() {
		const checkUserResult = await checkUser();
		if (checkUserResult)
			try {
				await api.user.getSelfUserInfo();
			} catch (error) {
				console.error("无法获取用户信息，请尝试重新登录", error);
				useToast("无法获取用户信息，请尝试重新登录", "error", 7000); // TODO: 使用多语言
			}
		else {
			// TODO: 如果用户未登录，要怎样？要引导登录吗？
			api.user.userLogout(); // 如果未登录或验证不成功，则清空全局变量中的用户信息并清空残留 cookie
			console.warn("WARN", "用户未登录或身份验证失败");
		}
	}

	/**
	 * 点击用户头像事件。未登录时提示登录，已登录时导航到个人主页。
	 */
	function onClickUser() {
		if (!selfUserInfoStore.isLogined) showLogin.value = true;
		else navigate(`/user/${selfUserInfoStore.uid}`);
	}

	/**
	 * 显示移动端抽屉。
	 */
	function onClickDrawer() {
		useEvent("app:showDrawer");
	}

	// 事件总线
	// 发生尝试唤起登录窗口事件，唤起登录窗口
	useListen("app:requestLogin", () => showLogin.value = true);
	// 发生用户登录事件时获取用户信息
	useListen("user:login", async loginStatus => {
		if (loginStatus)
			await getUserInfo();
	});

	// 生命周期钩子
	// mounted 时获取用户信息
	onMounted(async () => { await getUserInfo(); });
</script>

<template>
	<DefineAvatar>
		<UserAvatar
			v-tooltip="selfUserInfoStore.isLogined ? selfUserInfoStore.userNickname : t.login"
			:avatar="selfUserInfoStore.isLogined && !selfUserInfoStore.tempHideAvatarFromSidebar ? selfUserInfoStore.userAvatar : undefined"
		/>
	</DefineAvatar>

	<FlyoutNotification v-model="flyoutNotification" />

	<aside
		:class="{
			'hide-topbar': isCurrentSettings,
		}"
		:[scopeId]="''"
		role="toolbar"
		aria-label="side bar"
		aria-orientation="vertical"
	>
		<div class="top icons">
			<SoftButton v-tooltip="t.home" icon="home" href="/" />
			<SoftButton v-tooltip="t.search" icon="search" href="/search" />
			<SoftButton v-tooltip="t.history" icon="history" href="/history" />
			<SoftButton v-tooltip="t.favorites" icon="star" href="/favorite" />
			<SoftButton v-tooltip="t.feed" icon="feed" href="/feed" />
			<SoftButton v-tooltip="t.upload" icon="upload" href="/upload" />
		</div>

		<div class="center">
			<div class="open-offcanvas pe" @click="onClickDrawer">
				<Icon name="dehaze" class="decorative-icon" />
				<Avatar />
			</div>
			<div class="stripes">
				<div v-for="i in 2" :key="i" class="stripe"></div>
			</div>
			<LogoText />
		</div>

		<div class="bottom icons">
			<Avatar class="pc" @click="onClickUser" />
			<SoftButton v-if="selfUserInfoStore.isLogined" v-tooltip="t.notification" icon="notifications" :active="!!flyoutNotification" @click="e => flyoutNotification = [e]" />
			<SoftButton v-tooltip="t.settings" class="pc icon-settings" icon="settings" href="/settings" :active="isCurrentSettings" />
			<SoftButton v-tooltip="t.search" class="pe" icon="search" href="/search" />
		</div>

		<LoginWindow v-model="showLogin" />
	</aside>

	<nav :[scopeId]="''">
		<div class="icons">
			<BottomNavItem icon="home" href="/">{{ t.home }}</BottomNavItem>
			<BottomNavItem icon="category" href="/category">{{ t.category }}</BottomNavItem>
			<BottomNavItem icon="feed" href="/feed">{{ t.feed }}</BottomNavItem>
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
		overflow: clip;
		background-color: c(main-bg);

		:root.colored-sidebar & {
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
				@include not-mobile {
					margin-top: -100%;
				}
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

			@include mobile {
				@include square(48px);
				--ripple-size: 48px;
			}

			&.icon-settings:deep() {
				&:active i {
					rotate: -30deg;
				}

				i {
					transition: $fallback-transitions, rotate 1s $ease-out-smooth;
				}

				&:active .router-link-active i {
					rotate: 90deg;
				}

				.router-link-active i {
					rotate: 120deg;
				}
			}
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
				gap: 8px;
				padding-left: 4px;
				rotate: 0deg;

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

			&.hide-topbar {
				display: none;

				~ :deep(.container) {
					padding-top: 0;
				}
			}
		}
	}

	.icons {
		@include flex-center;
		flex-direction: column;
		gap: $icons-gap;

		.soft-button {
			&::after {
				@include oval(left);
				content: "";
				position: absolute;
				right: 0;
				z-index: 3;
				display: block;
				width: 3px;
				height: 24px;
				background-color: var(--color);
				scale: 1 0;

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

		@media (height <= 432px) {
			@include not-mobile {
				gap: 0;
			}
		}

		@include mobile {
			flex-direction: row;
			gap: 0;
		}
	}

	.user-avatar {
		--size: 40px;
	}

	.open-offcanvas {
		@include flex-center;
		gap: 8px;
		cursor: pointer;

		> * {
			pointer-events: none;
		}

		.offcanvas ~ * &,
		&:any-hover,
		&:active {
			:deep(.icon) {
				color: c(accent);
			}

			.user-avatar {
				--hover: true;
				background-color: c(accent-5);
			}
		}

		.offcanvas ~ * & .user-avatar {
			--tint: true;
		}

		&:any-hover {
			opacity: 1;
		}

		&:active {
			opacity: 0.6;

			.decorative-icon {
				scale: 1 0.75;
			}
		}
	}

	.decorative-icon {
		$size: 24px;
		margin-left: calc($size / -2 - 4px);
		color: c(icon-color);
		font-size: $size;
		cursor: pointer;
	}

	nav {
		@include sidebar-shadow;
		z-index: 30;
		padding: $icons-gap 0;
		overflow: clip;
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
