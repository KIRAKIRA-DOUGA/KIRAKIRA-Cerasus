<script setup lang="ts">
	// import { numbers } from "virtual:scss-var:theme/_variables";
	// onMounted(() => console.log(numbers));
	// const windowSize = useWindowSize();
	// const isMobile = computed(() => windowSize.width.value <= numbers.mobileMaxWidth);
	// 以后使用以上代码可获取在 SCSS 文件中定义的移动端宽度值。

	const props = defineProps<{
		/** 隐藏移动端导航顶栏？ */
		hideAppBar?: boolean;
		/** 使移动端导航顶栏无阴影？ */
		flatAppBar?: boolean;
		/** 隐藏移动端导航底栏？ */
		hideBottomNav?: boolean;
		/** 已进入设置页面？ */
		isSettingsPage?: boolean;
		/** 使用自定义文本替换掉徽标文本。 */
		overrideLogoText?: string;
	}>();

	const selfUserInfoStore = useSelfUserInfoStore();
	const appSettingsStore = useAppSettingsStore();
	const showLogin = ref(false);
	const [DefineAvatar, Avatar] = createReusableTemplate();
	const scopeId = useParentScopeId()!;
	const flyoutNotifications = ref<FlyoutModel>();

	/**
	 * 判断用户是否合法，或者判断用户是否已经登录？
	 * @returns 用户已经登录？
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
				const headerCookie = useRequestHeaders(["cookie"]);
				await api.user.getSelfUserInfo({ getSelfUserInfoRequest: undefined, appSettingsStore, selfUserInfoStore, headerCookie });
			} catch (error) {
				console.error("ERROR", "Failed to get current logged in user info:", error);
				useToast(t.toast.get_current_logged_in_user_info_failed, "error", 7000);
			}
		else {
			// TODO: 如果用户未登录，要怎样？要引导登录吗？
			api.user.userLogout({ appSettingsStore, selfUserInfoStore }); // 如果未登录或验证不成功，则清空全局变量中的用户信息并清空残留 cookie
			console.warn("WARN", "User not logged in or authentication failed.");
		}
	}

	/**
	 * 点击用户头像事件。未登录时提示登录，已登录时导航到个人主页。
	 */
	function onClickUser() {
		if (!selfUserInfoStore.isLogined) showLogin.value = true;
		else navigate(`/user/${selfUserInfoStore.userInfo.uid}`);
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

	// 获取用户信息
	onMounted(async () => await getUserInfo());
</script>

<template>
	<DefineAvatar>
		<UserAvatar
			v-if="selfUserInfoStore.isEffectiveCheckOnce"
			v-tooltip="selfUserInfoStore.isLogined ? selfUserInfoStore.userInfo.userNickname : t.login"
			:avatar="selfUserInfoStore.isLogined && !selfUserInfoStore.tempHideAvatarFromSidebar ? selfUserInfoStore.userInfo.avatar : undefined"
			hoverable
		/>
	</DefineAvatar>

	<FlyoutNotification v-model="flyoutNotifications" />

	<aside
		:class="{
			'hide-appbar': hideAppBar,
			'flat-appbar': flatAppBar,
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
			<SoftButton v-tooltip="t(2).collection" icon="star" href="/collections" />
			<SoftButton v-tooltip="t.feed.following" icon="feed" href="/feed/following" />
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
			<Transition mode="out-in">
				<p v-if="props.overrideLogoText" class="logo-text">{{ props.overrideLogoText }}</p>
				<LocaleLink v-else to="/" class="logo-text-wrapper lite">
					<LogoText />
				</LocaleLink>
			</Transition>
		</div>

		<div class="bottom icons">
			<Avatar class="pc" @click="onClickUser" />
			<SoftButton
				v-if="selfUserInfoStore.isLogined"
				v-tooltip="t.notification"
				icon="notifications"
				:active="!!flyoutNotifications"
				@click="e => flyoutNotifications = [e]"
			/>
			<SoftButton
				v-tooltip="t.settings"
				class="pc icon-settings"
				icon="settings"
				href="/settings"
				:active="isSettingsPage"
			/>
			<SoftButton v-tooltip="t.search" class="pe" icon="search" href="/search" />
		</div>

		<LoginWindow v-model="showLogin" />
	</aside>

	<Transition>
		<nav v-show="!hideBottomNav" :[scopeId]="''">
			<div class="icons">
				<BottomNavItem icon="home" href="/">{{ t.home }}</BottomNavItem>
				<BottomNavItem icon="category" href="/category">{{ t.category }}</BottomNavItem>
				<BottomNavItem icon="feed" href="/feed/following">{{ t.feed.following }}</BottomNavItem>
			</div>
		</nav>
	</Transition>
</template>

<style scoped lang="scss">
	$icons-gap: 8px;

	aside {
		@include flex-center;
		--color: #{c(accent)};
		z-index: 30;
		flex-direction: column;
		justify-content: space-between;
		padding: $icons-gap 0;
		overflow: clip;
		background-color: c(main-bg);

		@include not-mobile {
			@include sidebar-shadow;
		}

		@include mobile {
			background-color: c(main-bg, 75%);
			backdrop-filter: blur(16px);

			&:not(.flat-appbar) {
				@include sidebar-shadow;
			}
		}

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
				color: c(accent);
				font-size: 20px;
				font-weight: 600;

				@media (height >= 678px) {
					--form: visible;
				}

				:deep(.logo-shape) {
					margin-top: 0;
					rotate: 100grad;

					@include mobile {
						display: none;
					}
				}

				&.v-enter-from,
				&.v-leave-to {
					opacity: 0;
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

				.logo-text-wrapper {
					display: flex;
					align-items: center;
					height: 48px;
				}
			}

			.bottom {
				margin-right: 4px;
			}

			.user-avatar {
				margin-right: 4px;
			}

			&.hide-appbar {
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
		background-color: c(main-bg, 75%);
		backdrop-filter: blur(16px);

		.icons {
			@include square(100%);
			justify-content: space-evenly;
		}

		&.v-enter-active {
			transition: translate $ease-out-smooth 700ms;
		}

		&.v-leave-active {
			transition: translate $ease-in-smooth 150ms;
		}

		&.v-enter-from,
		&.v-leave-to {
			translate: 0 100%;
		}
	}

	@keyframes jump-in {
		from {
			translate: -$sidebar-width;
		}
	}
</style>
Zz
