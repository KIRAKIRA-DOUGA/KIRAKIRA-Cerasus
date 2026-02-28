<docs>
	# 用户卡片
	用于在列表中显示用户信息，包括头像、昵称、用户名、关注按钮等。
</docs>

<script setup lang="ts">
	const props = defineProps<{
		/** 用户 UID。 */
		uid: number;
		/** 用户头像。 */
		avatar?: string;
		/** 用户昵称。 */
		userNickname?: string;
		/** 用户名。 */
		username?: string;
		/** 是否已关注？ */
		isFollowing?: boolean;
		/** 是否是自己？ */
		isSelf?: boolean;
	}>();

	const emit = defineEmits<{
		/** 关注状态变化时触发 */
		"update:isFollowing": [value: boolean];
	}>();

	const selfUserInfoStore = useSelfUserInfoStore();
	const isSelf = computed(() => props.uid === selfUserInfoStore.userInfo.uid);
</script>

<template>
	<Comp class="user-card">
		<UserContent
			:avatar="avatar"
			:uid="uid"
			:nickname="userNickname"
			:username="username"
			size="large"
			center
		>
			<template #actionButtons>
				<FollowButton v-if="!isSelf && !props.isSelf" :uid="uid" :isFollowing="isFollowing ?? false" @update:isFollowing="emit('update:isFollowing', $event)" />
			</template>
		</UserContent>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		padding: 8px 12px;
		transition: opacity 0.2s;

		&:any-hover {
			opacity: 0.8;
		}

		:deep(.user-content) .user-avatar {
			--size: 48px;
		}

		:deep(.container.link.lite) {
			padding: 8px 0 8px 12px;
		}
	}
</style>
