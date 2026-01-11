<docs>
# 用户列表
用于显示关注列表或粉丝列表，支持无限滚动加载。
</docs>

<script setup lang="ts">
	const props = defineProps<{
		/** 目标用户 UID */
		targetUid: number;
		/** 列表类型：'following' 关注列表，'followers' 粉丝列表 */
		listType: "following" | "followers";
	}>();

	const emit = defineEmits<{
		/** 当关注列表中的用户被取消关注时触发，传递被取消关注的用户 UID */
		unfollow: [uid: number];
	}>();

	const userList = ref<UserInfoForFollowList[]>([]);
	const isLoadingList = ref(false);
	const hasMore = ref(true);
	const currentPage = ref(1);
	const PAGE_SIZE = 18;

	/**
	 * 获取列表数据
	 * @param reset - 是否为重新加载？
	 */
	async function fetchList(reset = false) {
		// 如果是重置模式，先重置状态（即使正在加载或没有更多数据也要重置）
		if (reset) {
			currentPage.value = 1;
			userList.value = [];
			hasMore.value = true;
			// 如果正在加载，先停止当前加载
			if (isLoadingList.value)
				isLoadingList.value = false;
		} else
			// 如果不是重置模式，检查是否可以加载
			if (isLoadingList.value || !hasMore.value) return;

		isLoadingList.value = true;
		try {
			const headerCookie = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;
			const response = props.listType === "following" ?
				await api.feed.getFollowingList(props.targetUid, currentPage.value, PAGE_SIZE, headerCookie) :
				await api.feed.getFollowerList(props.targetUid, currentPage.value, PAGE_SIZE, headerCookie);
			if (response.success && response.result) {
				if (reset)
					userList.value = response.result;
				else
					userList.value.push(...response.result);
				hasMore.value = userList.value.length < (response.totalCount ?? 0);
				if (hasMore.value)
					currentPage.value++;
			} else
				hasMore.value = false;
		} catch (error) {
			console.error(`Failed to fetch ${props.listType} list:`, error);
			hasMore.value = false;
		}
		isLoadingList.value = false;
	}

	/**
	 * 处理用户关注状态更新
	 */
	async function handleUpdateIsFollowing(uid: number, value: boolean) {
		if (props.listType === "following") {
			// 关注列表：如果取消关注，从列表中移除
			if (!value) {
				const index = userList.value.findIndex(u => u.uid === uid);
				if (index !== -1) {
					userList.value.splice(index, 1);
					emit("unfollow", uid);
				}
			}
		} else {
			// 粉丝列表：更新用户的关注状态，然后刷新列表以确保数据是最新的
			const targetUser = userList.value.find(u => u.uid === uid);
			if (targetUser) {
				targetUser.isFollowing = value;
				// 使用 nextTick 确保在下一个事件循环中执行，避免与当前操作冲突
				await nextTick();
				fetchList(true);
			}
		}
	}

	const listContainer = ref<HTMLElement>();

	/**
	 * 处理滚动，实现无限加载
	 */
	function handleScroll(event: Event) {
		// 事件冒泡，实际滚动的是父容器 .toolbox-card.center
		const target = (event.currentTarget || event.target) as HTMLElement;
		if (!target) return;
		const scrollTop = target.scrollTop;
		const scrollHeight = target.scrollHeight;
		const clientHeight = target.clientHeight;
		// 当滚动到距离底部 200px 时加载更多
		if (scrollTop + clientHeight >= scrollHeight - 200 && hasMore.value && !isLoadingList.value)
			fetchList();
	}

	// 监听父容器的滚动事件
	onMounted(() => {
		// 查找父容器 .toolbox-card.center
		const parentContainer = listContainer.value?.closest(".toolbox-card.center");
		if (parentContainer) {
			parentContainer.addEventListener("scroll", handleScroll);
			onUnmounted(() => {
				parentContainer.removeEventListener("scroll", handleScroll);
			});
		}
	});

	// 暴露方法供父组件调用
	defineExpose({
		fetchList,
	});
</script>

<template>
	<div ref="listContainer" class="user-list">
		<UserCard
			v-for="user in userList"
			:key="user.uid"
			:uid="user.uid"
			:avatar="user.avatar"
			:userNickname="user.userNickname"
			:username="user.username"
			:isFollowing="listType === 'following' ? true : user.isFollowing"
			@update:isFollowing="(value) => handleUpdateIsFollowing(user.uid, value)"
		/>
		<div v-if="isLoadingList" class="loading">
			<ProgressRing />
		</div>
		<div v-else-if="!hasMore && userList.length === 0" class="empty">
			¯\_(ツ)_/¯
		</div>
	</div>
</template>

<style scoped lang="scss">
	.user-list {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.loading {
		@include flex-center;
		padding: 20px;
	}

	.empty {
		@include flex-center;
		padding: 40px 20px;
		color: c(icon-color, 50%);
		text-align: center;
	}
</style>
