<script setup lang="ts">
	const props = defineProps<{
		/** 头像网址。 */
		avatar?: string;
		/** 用户名。 */
		username: string;
		/** 粉丝数。 */
		fans: number;
		/** 是否已关注？ */
		isFollowed?: boolean;
		/** 用户 UID。 */
		uid?: number;
	}>();
</script>

<template>
	<Comp>
		<UserAvatar :avatar="avatar" :uid="uid" />
		<div class="text">
			<div class="username">{{ username }}</div>
			<div class="fans">{{ fans }} {{ t(fans).fans }}</div>
		</div>
		<Button v-if="!isFollowed" icon="add">{{ t.follow_verb }}</Button>
		<Button v-else disabled icon="check">{{ t.following }}</Button>
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
