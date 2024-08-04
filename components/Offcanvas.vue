<docs>
	# 缩放式侧滑导航菜单（类旧版手机 QQ）
</docs>

<script setup lang="ts">
	const shown = defineModel<boolean>({ default: false });

	const drawerItems: { name: string; icon: DeclaredIcons; route?: string }[] = [
		{ name: t.history, icon: "history", route: "/history" },
		{ name: t.favorite, icon: "star", route: "/favorite" },
		{ name: t.upload, icon: "upload", route: "/upload" },
	];

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
				v-tooltip="selfUserInfoStore.isLogined ? selfUserInfoStore.userNickname : t.login"
				:avatar="selfUserInfoStore.isLogined ? selfUserInfoStore.userAvatar : undefined"
				@click="onClickUser"
			/>
			<p class="nickname">{{ selfUserInfoStore.isLogined ? selfUserInfoStore.userNickname : t.pleaseLogin }}</p>
			<p v-if="selfUserInfoStore.isLogined" class="username">@{{ selfUserInfoStore.username }}</p>
			<p v-if="selfUserInfoStore.isLogined && selfUserInfoStore.signature" class="bio">{{ selfUserInfoStore.signature }}</p>
		</div>
		<div class="grid">
			<div v-for="item in drawerItems" :key="item.icon" v-ripple class="drawer-item" @click="to(item.route)">
				<Icon :name="item.icon" />
				<label>{{ item.name }}</label>
			</div>
		</div>
		<div class="tab-bar vertical"><!-- 假装是 TabBar -->
			<TabItem id="settings" v-ripple icon="settings" _internalIsVertical @click="to('/settings')">{{ t.settings }}</TabItem>
		</div>
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

	.tab-bar {
		margin: 0 -14px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
		margin: 12px 0;

		.drawer-item {
			@include round-large;
			@include card-in-card-shadow;
			display: flex;
			flex-direction: column;
			gap: 4px;
			align-items: center;
			padding: 12px 0;
			color: c(icon-color);
			font-size: 13px;
			background-color: c(main-bg, 50%);

			.icon {
				font-size: 32px;
			}

			&:any-hover {
				@include chip-shadow;
			}

			&:active {
				@include button-scale-pressed;
			}
		}
	}
</style>
