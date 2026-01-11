<docs>
	# 关注/取消关注按钮。
</docs>

<script setup lang="ts">
	const props = defineProps<{
		/** 用户 UID。 */
		uid: number;
		/** 是否已关注？（初始化时的） */
		isFollowing: boolean;
	}>();

	const { t } = useI18n();

	const isFollowing = ref(props.isFollowing); // 是否正在关注
	const isTogglingFollow = ref(false); // 是否正在发送关注或取消关注用户的请求
	const followButton = ref<InstanceType<typeof Button>>(); // 关注按钮实例
	const unfollowMenu = ref<FlyoutModel>(); // 点击「已关注」按钮时会出现的取消关注菜单

	// 监听 props 变化，同步更新内部状态
	watch(() => props.isFollowing, newValue => {
		isFollowing.value = newValue;
	});

	// 获取刷新关注统计的函数（如果存在）
	const refreshFollowStats = inject<Ref<(() => void) | undefined>>("refreshFollowStats", ref(undefined));

	/**
	 * 关注按钮点击事件。
	 * @param e - 鼠标事件。
	 */
	async function onFollowButtonClick(e: MouseEvent) {
		const button = e.target as HTMLButtonElement;
		if (!isFollowing.value)
			await animateSize(button, async () => {
				await followingUser();
			});
		else
			unfollowMenu.value = [e, "y"];
	}

	/**
	 * 取消关注按钮点击事件。
	 */
	async function onUnfollowButtonClick() {
		if (!followButton.value) return;
		const button = followButton.value.$el as HTMLButtonElement;
		await animateSize(button, async () => {
			await unfollowingUser();
		});
	}

	/**
	 * 关注当前 URL 所对应的用户。
	 */
	async function followingUser() {
		isTogglingFollow.value = true;
		try {
			const followingUploaderRequest: FollowingUploaderRequestDto = {
				followingUid: props.uid ?? -1,
			};
			const response = await api.feed.followingUploader(followingUploaderRequest);
			if (response.success) {
				isFollowing.value = true;
				// 刷新关注统计
				if (refreshFollowStats.value)
					refreshFollowStats.value();
			} else
				useToast(t("toast.something_went_wrong"), "error", 5000);
		} catch (error) {
			useToast(t("toast.something_went_wrong"), "error", 5000);
			console.error("ERROR", "关注用户时出错：", error);
		}
		isTogglingFollow.value = false;
	}

	/**
	 * 取关当前 URL 所对应的用户。
	 */
	async function unfollowingUser() {
		isTogglingFollow.value = true;
		try {
			const unfollowingUploaderRequest: UnfollowingUploaderRequestDto = {
				unfollowingUid: props.uid ?? -1,
			};
			const response = await api.feed.unfollowingUploader(unfollowingUploaderRequest);
			if (response.success) {
				isFollowing.value = false;
				// 刷新关注统计
				if (refreshFollowStats.value)
					refreshFollowStats.value();
			} else {
				isFollowing.value = true;
				useToast(t("toast.something_went_wrong"), "error", 5000);
			}
		} catch (error) {
			isFollowing.value = true;
			useToast(t("toast.something_went_wrong"), "error", 5000);
			console.error("ERROR", "取消关注用户时出错：", error);
		}
		isTogglingFollow.value = false;
	}
</script>

<template>
	<Button
		ref="followButton"
		class="follow-button"
		:icon="isFollowing ? 'check' : 'add'"
		:disabled="isTogglingFollow"
		:loading="isTogglingFollow"
		@click="onFollowButtonClick"
	>
		{{ isFollowing ? $t("following") : $t("follow_verb") }}
		<Menu v-model="unfollowMenu">
			<MenuItem icon="close" @click="onUnfollowButtonClick">{{ $t("unfollow") }}</MenuItem>
		</Menu>
	</Button>
</template>
