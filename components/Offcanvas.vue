<docs>
	# 缩放式侧滑导航菜单（类旧版手机 QQ）
</docs>

<script setup lang="ts">
	const shown = defineModel<boolean>({ default: false });
	const { t } = useI18n();

	const drawerItems: Record<string, { id: string; name: string; icon: DeclaredIcons; route?: string }[]> = {
		general: [
			{ id: "history", name: t("history"), icon: "history", route: "/history" },
			{ id: "collections", name: t("collection.title", 2), icon: "star", route: "/collections" },
			{ id: "upload", name: t("upload.title"), icon: "upload", route: "/upload" },
		],
		extra: [
			{ id: "settings", name: t("settings.title"), icon: "settings", route: "/settings" },
		],
	};

	const currentPageRequested = ref("");
	const currentRoute = computed(() => getRoutePath());
	watch(currentRoute, route => {
		const firstSegment = route.split("/")[0] ?? "";
		currentPageRequested.value = firstSegment;
	}, { immediate: true });

	/**
	 * 前往路由。
	 * @param route - 路由。
	 */
	function to(route?: string) {
		if (route === undefined) return;
		shown.value = false;
		navigate(route);
	}

	const selfUserInfoStore = useSelfUserInfoStore();

	/**
	 * 点击用户头像事件。未登录时提示登录，已登录时导航到个人主页。
	 */
	function onClickUser() {
		shown.value = false;
		if (!selfUserInfoStore.isLogined) useEvent("app:requestLogin");
		else to("/user");
	}
</script>

<template>
	<Comp>
		<div class="user">
			<UserAvatar
				v-tooltip:y="selfUserInfoStore.isLogined ? selfUserInfoStore.userInfo.userNickname : $t('login')"
				:avatar="selfUserInfoStore.isLogined ? selfUserInfoStore.userInfo.avatar : undefined"
				@click="onClickUser"
			/>
			<p class="nickname">{{ selfUserInfoStore.isLogined ? selfUserInfoStore.userInfo.userNickname : $t("please_login") }}</p>
			<p v-if="selfUserInfoStore.isLogined" class="username">@{{ selfUserInfoStore.userInfo.username }}</p>
			<p v-if="selfUserInfoStore.isLogined && selfUserInfoStore.userInfo.signature" class="bio">{{ selfUserInfoStore.userInfo.signature }}</p>
		</div>
		<TabBar v-model="currentPageRequested" vertical>
			<TabItem
				v-for="item in drawerItems.general"
				:id="item.id"
				:key="item.id"
				:icon="item.icon"
				:to="item.route"
				@click="shown = false"
			>{{ item.name }}</TabItem>
			<hr />
			<TabItem
				v-for="item in drawerItems.extra"
				:id="item.id"
				:key="item.id"
				:icon="item.icon"
				:to="item.route"
				@click="shown = false"
			>{{ item.name }}</TabItem>
		</TabBar>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 60dvw;
		padding: 24px;
	}

	.user {
		.nickname {
			margin-top: 16px;
			font-size: 16px;
			font-weight: bold;
		}

		.username {
			margin-top: 4px;
			color: c(icon-color);
			font-size: 12px;
		}

		.bio {
			margin-top: 12px;
			font-size: 12px;
		}
	}

	@keyframes scale-y-in {
		from {
			scale: 1 0;
		}
	}

	.tab-bar {
		margin-block-start: 12px;
		margin-inline: -14px;

		.offcanvas.v-enter-active &:deep(.indicator) {
			display: none;
		}

		.offcanvas:not(.v-enter-active) &:deep(.indicator) {
			animation: scale-y-in 200ms $ease-out-expo backwards 100ms;
		}

		hr {
			width: calc(100% - 28px);
			margin-block: 6px;
			margin-inline: 14px;
		}
	}
</style>
