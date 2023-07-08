<script setup lang="ts">
	const props = defineProps<{
		/** 头像网址。 */
		avatar: string;
		/** 用户名。 */
		username: string;
		/** 粉丝数。 */
		fans: number;
		/** 是否已关注？ */
		isFollowed?: boolean;
	}>();
</script>

<template>
	<Comp>
		<UserAvatar :avatar="avatar" link="/user" />
		<div class="text">
			<div class="username">{{ username }}</div>
			<div class="fans">{{ fans }} 粉丝</div>
		</div>
		<Button v-if="!isFollowed">关注</Button>
		<Button v-else disabled>已关注</Button>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		display: flex;
		gap: 12px;
		align-items: center;

		> :not(.text) {
			flex-shrink: 0;
		}

		.text {
			width: 100%;

			.username {
				margin-bottom: 4px;
				font-weight: bold;
				font-size: 18px;
			}
		}
	}
</style>
