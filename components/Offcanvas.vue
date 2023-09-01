<docs>
	# 缩放式侧滑导航菜单（类旧版手机 QQ）
</docs>

<script setup lang="ts">
	
</script>

<template>
	<Comp>
		<div class="user">
			<UserAvatar />
			<p class="username">艾了个拉</p>
			<p class="bio">Kind and Kawaii, Forever!</p>
		</div>
		<div class="menu"></div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 16px;
	}

	.username {
		margin: 16px 0 8px;
		font-weight: bold;
		font-size: 16px;
	}
	
	.bio {
		font-size: 12px;
	}
</style>
