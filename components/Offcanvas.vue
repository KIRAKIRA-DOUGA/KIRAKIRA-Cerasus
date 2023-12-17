<docs>
	# 缩放式侧滑导航菜单（类旧版手机 QQ）
</docs>

<script setup lang="ts">
	const shown = defineModel<boolean>({ default: false });

	const drawerItems: { name: string; icon: DeclaredIcons; route?: string }[] = [
		{ name: t.history, icon: "history" },
		{ name: t.favorite, icon: "star" },
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
		if (!selfUserInfoStore.isLogined) useEvent("app:requestLogin");
		else to("/user");
	}
</script>

<template>
	<Comp>
		<div class="user">
			<UserAvatar
				v-tooltip="selfUserInfoStore.isLogined ? selfUserInfoStore.username : t.login"
				:avatar="selfUserInfoStore.isLogined ? selfUserInfoStore.userAvatar : undefined"
				@click="onClickUser"
			/>
			<p class="username">艾了个拉</p>
			<p class="bio">Kind and Kawaii, Forever!</p>
		</div>
		<div class="grid">
			<div v-for="item in drawerItems" :key="item.icon" v-ripple class="drawer-item" @click="to(item.route)">
				<Icon :name="item.icon" />
				<label>{{ item.name }}</label>
			</div>
		</div>
		<div class="tab-bar vertical"><!-- 假装是 TabBar -->
			<TabItem id="settings" v-ripple icon="settings" @click="to('/settings')">{{ t.settings }}</TabItem>
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
		.username {
			margin: 16px 0 8px;
			font-weight: bold;
			font-size: 16px;
		}

		.bio {
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
