<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 评论唯一 ID */
		commentId: string;
		/** 评论所在的视频的 ID */
		videoId: number;
		/** 评论发布者头像网址。 */
		avatar?: string;
		/** 评论发布者昵称。 */
		nickname?: string;
		/** 评论发布者用户名。 */
		username?: string;
		/** 评论序号。 */
		index?: number; // 我不赞成在序号前导 0，因为你怎敢假定评论数在绝大多数情况下小于或等于两位数？
		/** 评论发布日期。 */
		date?: Date;
		/** 用户 UID。 */
		uid: number;
		/** 评论的路由 */
		commentRoute: string;
	}>(), {
		avatar: undefined,
		username: "匿名",
		index: undefined,
		date: () => new Date(),
		uid: undefined,
	});

	/** 为该评论加分的值。 */
	const upvote = defineModel("upvote", { default: 0 });
	/** 是否已点击加分？ */
	const isUpvoted = defineModel("isUpvoted", { default: false });
	/** 为该评论减分的值。 */
	const downvote = defineModel("downvote", { default: 0 });
	/** 是否已点击减分？ */
	const isDownvoted = defineModel("isDownvoted", { default: false });
	const menu = ref<FlyoutModel>();
	/** 是否已置顶？ */
	const pinned = defineModel("pinned", { default: false });
	const unpinnedCaption = computed(() => pinned.value ? "unpin" : "pin");

	const voteLock = ref(false);

	const userSelfInfoStore = useSelfUserInfoStore();
	const isSelfComment = computed(() => props.uid === userSelfInfoStore.uid); // 这条评论是否是自己发送的
	const isAdmin = computed(() => userSelfInfoStore.role === "admin"); // 这条评论是否是自己发送的

	/**
	 * 点击加分、减分按钮事件。
	 * @param button - 点击的按钮是加分还是减分。
	 * @param [noNestingDolls=false] - 禁止套娃，防止递归调用。
	 */
	function onClickVotes(button: "upvote" | "downvote", noNestingDolls: boolean = false) {
		// const states = { upvote, isUpvoted, downvote, isDownvoted };
		// const value = states[button], clicked = states[`${button}Clicked`]; // 面向字符串编程。
		// const another = button === "like" ? "dislike" : "like";
		// const isActive = clicked.value = !clicked.value, gain = isActive ? 1 : -1;
		// value.value += gain;
		// if (isActive && states[`${another}Clicked`].value && !noNestingDolls) onClickUpvote(another, true);

		const commentId = props.commentId; // 视频评论 ID
		const videoId = props.videoId; // 视频 ID

		if (!props.index || !commentId || videoId === undefined || videoId === null) { // 非空验证
			useToast("出错啦！请刷新页面再试~", "error"); // TODO: 使用多语言
			return;
		}

		if (voteLock.value) { // 如果请求的“悲观锁”处于锁定状态，则弹出错误提示并停止
			useToast("操作过于频繁，请稍后再试~", "error"); // TODO: 使用多语言
			return;
		}

		if (!userSelfInfoStore.isLogined) { // 如果用户未登录，则不允许加分/减分
			useToast("请登录后再操作~", "error"); // TODO: 使用多语言
			return;
		}

		if (button === "upvote") // 判断是加分还是减分
			if (isUpvoted.value) // 如果被加分的视频评论此前已经被加分，则取消加分，否则加分
				// 取消加分
				cancelVideoCommentUpvote(commentId, videoId);
			else
				// 加分
				emitVideoCommentUpvote(commentId, videoId);
		else
			if (isDownvoted.value) // 如果被减分的视频评论此前已经被减分，则取消减分，否则减分
				// 取消减分
				cancelVideoCommentDownvote(commentId, videoId);
			else
				// 减分
				emitVideoCommentDownvote(commentId, videoId);
	}

	/**
	 * 视频评论加分
	 * @param commentId 视频评论 ID
	 * @param videoId 视频 ID
	 */
	function emitVideoCommentUpvote(commentId: string, videoId: number) {
		voteLock.value = true; // 请求锁：锁定
		const emitVideoCommentUpvoteRequest: EmitVideoCommentUpvoteRequestDto = { id: commentId, videoId };
		api.videoComment.emitVideoCommentUpvote(emitVideoCommentUpvoteRequest).catch(error => {
			voteLock.value = false; // 请求锁：释放
			useToast("加分失败！", "error"); // TODO: 使用多语言
			console.error("ERROR", "加分失败！", error);
		}).finally(() => {
			voteLock.value = false; // 请求锁：释放
		});

		isUpvoted.value = true; // 设置加分图标高亮
		upvote.value++; // 加分数增加
		if (isDownvoted.value) { // 如果用户在加分操作前，已经有减分，则取消减分的高亮，并减少减分数量
			isDownvoted.value = false;
			downvote.value--;
		}
	}

	/**
	 * 取消视频评论加分
	 * @param commentId 视频评论 ID
	 * @param videoId 视频 ID
	 */
	function cancelVideoCommentUpvote(commentId: string, videoId: number) {
		voteLock.value = true; // 请求锁：锁定
		const cancelVideoCommentUpvoteRequest: CancelVideoCommentUpvoteRequestDto = { id: commentId, videoId };
		api.videoComment.cancelVideoCommentUpvote(cancelVideoCommentUpvoteRequest).catch(error => {
			voteLock.value = false; // 请求锁：释放
			useToast("取消加分失败！", "error"); // TODO: 使用多语言
			console.error("ERROR", "取消加分失败！", error);
		}).finally(() => {
			voteLock.value = false; // 请求锁：释放
		});

		isUpvoted.value = false; // 取消加分图标高亮
		upvote.value--; // 加分数减少
	}

	/**
	 * 视频评论减分
	 * @param commentId 视频评论 ID
	 * @param videoId 视频 ID
	 */
	function emitVideoCommentDownvote(commentId: string, videoId: number) {
		voteLock.value = true; // 请求锁：锁定
		const emitVideoCommentDownvoteRequest: EmitVideoCommentDownvoteRequestDto = { id: commentId, videoId };
		api.videoComment.emitVideoCommentDownvote(emitVideoCommentDownvoteRequest).catch(error => {
			voteLock.value = false; // 请求锁：释放
			useToast("减分失败！", "error"); // TODO: 使用多语言
			console.error("ERROR", "减分失败！", error);
		}).finally(() => {
			voteLock.value = false; // 请求锁：释放
		});

		isDownvoted.value = true; // 设置减分图标高亮
		downvote.value++; // 减分数增加
		if (isUpvoted.value) { // 如果用户在减分操作前，已经有加分，则取消加分的高亮，并减少加分数量
			upvote.value--;
			isUpvoted.value = false;
		}
	}

	/**
	 * 取消视频评论减分
	 * @param commentId 视频评论 ID
	 * @param videoId 视频 ID
	 */
	function cancelVideoCommentDownvote(commentId: string, videoId: number) {
		voteLock.value = true; // 请求锁：锁定
		const cancelVideoCommentDownvoteRequest: CancelVideoCommentDownvoteRequestDto = { id: commentId, videoId };
		api.videoComment.cancelVideoCommentDownvote(cancelVideoCommentDownvoteRequest).catch(error => {
			voteLock.value = false; // 请求锁：释放
			useToast("取消减分失败！", "error"); // TODO: 使用多语言
			console.error("ERROR", "取消减分失败！", error);
		}).finally(() => {
			voteLock.value = false; // 请求锁：释放
		});

		isDownvoted.value = false; // 取消减分图标高亮
		downvote.value--; // 减分数减少
	}

	/**
	 * 删除自己的评论
	 * @param commentRoute - 评论的路由
	 * @param videoId - KVID 视频 ID
	 */
	async function deleteSelfComment(commentRoute?: string, videoId?: number) {
		if (!commentRoute || !videoId) return;
		const deleteSelfVideoCommentRequest: DeleteSelfVideoCommentRequestDto = {
			videoId,
			commentRoute,
		};
		const deleteVideoResult = await api.videoComment.deleteSelfVideoComment(deleteSelfVideoCommentRequest);
		if (deleteVideoResult.success) {
			useToast("删除评论成功！", "success", 5000); // TODO: 使用多语言
			useEvent("videoComment:deleteVideoComment", commentRoute);
		} else
			useToast("删除评论失败！", "error", 5000); // TODO: 使用多语言
			// TODO: 性能问题
	}

	/**
	 * 管理员删除评论
	 * @param commentRoute - 评论的路由
	 * @param videoId - KVID 视频 ID
	 */
	async function adminDeleteVideoComment(commentRoute?: string, videoId?: number) {
		if (!commentRoute || !videoId) return;
		const adminDeleteVideoCommentRequest: AdminDeleteVideoCommentRequestDto = {
			videoId,
			commentRoute,
		};
		const deleteVideoResult = await api.videoComment.adminDeleteVideoComment(adminDeleteVideoCommentRequest);
		if (deleteVideoResult.success) {
			useToast("删除评论成功！", "success", 5000); // TODO: 使用多语言
			useEvent("videoComment:deleteVideoComment", commentRoute);
		} else
			useToast("删除评论失败！", "error", 5000); // TODO: 使用多语言
			// TODO: 性能问题
	}
</script>

<template>
	<Comp>
		<UserAvatar :avatar :uid />
		<div class="content">
			<div class="header">
				<Icon v-if="pinned" name="pin" class="pin" />
				<span v-if="nickname" class="nickname">{{ nickname }}</span>
				<span v-if="username" class="username">@{{ username }}</span>
			</div>
			<div class="comments">
				<slot></slot>
			</div>
			<div class="footer">
				<div class="left">
					<div v-if="index !== undefined">#{{ index }}</div>
					<div><DateTime :dateTime="date" showTime /></div>
					<div class="votes-wrapper">
						<div class="votes">
							<SoftButton v-tooltip:bottom="t.upvote" icon="thumb_up" :active="isUpvoted" @click="onClickVotes('upvote')" />
							<span v-if="upvote">{{ upvote }}</span>
						</div>
						<div class="votes">
							<SoftButton v-tooltip:bottom="t.downvote" icon="thumb_down" :active="isDownvoted" @click="onClickVotes('downvote')" />
							<span v-if="downvote">{{ downvote }}</span>
						</div>
					</div>
				</div>
				<div class="right">
					<SoftButton v-tooltip:bottom="t.reply" icon="reply" />
					<SoftButton v-tooltip:bottom="t.more" icon="more_vert" @click="e => menu = [e, 'y']" />
					<Menu v-model="menu">
						<MenuItem v-if="isSelfComment" icon="delete" @click="deleteSelfComment(commentRoute, videoId)">{{ t.delete }}</MenuItem>
						<!-- TODO: 使用多语言 -->
						<MenuItem v-if="isAdmin" icon="delete" @click="adminDeleteVideoComment(commentRoute, videoId)">{{ t.delete }}（管理员）</MenuItem>
						<MenuItem :icon="unpinnedCaption" @click="pinned = !pinned">{{ t[unpinnedCaption] }}</MenuItem>
						<hr />
						<MenuItem icon="flag">{{ t.report }}</MenuItem>
					</Menu>
				</div>
			</div>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		display: flex;
		gap: 16px;
		margin: 20px 0;
		color: c(text-color);

		.content {
			width: 100%;

			> :not(:last-child) {
				margin-bottom: 8px;
			}
		}
	}

	.header {
		display: flex;
		gap: 4px;
		align-items: center;

		.icon.pin {
			color: c(icon-color);
			font-size: 20px;
		}

		.nickname {
			font-size: 16px;
			font-weight: bold;
		}

		.username {
			color: c(icon-color);
		}
	}

	.comments {
		text-align: justify;

		&,
		:deep(*) {
			user-select: text;
		}
	}

	.footer {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		justify-content: space-between;
		color: c(icon-color);
		font-size: 13px;

		> * {
			display: flex;
			flex-shrink: 0;
			flex-wrap: wrap;
			gap: 20px;
		}

		.right {
			margin-left: auto;
		}

		.votes-wrapper {
			display: flex;
			gap: 14px;
		}

		.votes {
			display: flex;
			gap: 11px;
			align-items: center;
			cursor: pointer;
		}

		.soft-button {
			--wrapper-size: 20px;
			--ripple-size: 40px;
			--icon-size: 18px;
		}
	}
</style>
