<script setup lang="ts">
	const props = defineProps<{
		/** 头像网址。 */
		avatar?: string;
		/** 昵称。 */
		nickname: string;
		/** 用户名。 */
		username: string;
		/** 角色。 */
		roles?: string[];
		/** 粉丝数。 */
		followers: number;
		/** 是否已关注？ */
		isFollowing: boolean;
		/** 是否是自己？ */
		isSelf?: boolean;
		/** 用户 UID。 */
		uid: number;
	}>();

	const emit = defineEmits<{
		/** 关注状态变化时触发 */
		"update:isFollowing": [value: boolean];
	}>();
</script>

<template>
	<Comp>
		<UserContent :avatar="avatar" :nickname="nickname" :followers="followers" :uid="uid" center>
			<template #description>
				{{ followers }} {{ $t("follower", followers) }}
			</template>
		</UserContent>
		<FollowButton v-if="!isSelf" :uid :isFollowing="isFollowing" @update:isFollowing="emit('update:isFollowing', $event)" />
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		display: flex;
		gap: 12px;
		align-items: center;

		> :not(.user-content) {
			flex-shrink: 0;
		}

		.user-content {
			width: 100%;
		}
	}
</style>
