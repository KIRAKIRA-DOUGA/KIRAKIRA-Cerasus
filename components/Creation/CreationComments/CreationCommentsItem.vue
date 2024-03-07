<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 评论唯一 ID */
		commentId: string;
		/** 评论所在的视频的 ID */
		videoId: number;
		/** 评论发布者头像网址。 */
		avatar?: string;
		/** 评论发布者昵称。 */
		username?: string;
		/** 评论序号。 */
		index?: number; // 我不赞成在序号前导 0，因为你怎敢假定评论数在绝大多数情况下小于或等于两位数？
		/** 评论发布日期。 */
		date?: Date;
		/** 用户 UID。 */
		uid?: number;
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
	const date = computed(() => formatDateWithLocale(props.date, { time: true }));
	const menu = ref<FlyoutModel>();
	/** 是否已置顶？ */
	const pinned = defineModel("pinned", { default: false });
	const unpinnedCaption = computed(() => pinned.value ? "unpin" : "pin");

	const voteLock = ref(false);

	const userSelfInfoStore = useSelfUserInfoStore();

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

		if (voteLock.value) { // 如果请求的"悲观锁"处于锁定状态，则弹出错误提示并停止
			useToast("操作过于频繁，请稍后再试~", "error"); // TODO: 使用多语言
			return;
		}

		if (!userSelfInfoStore.isLogined) { // 如果用户未登录，则不允许点赞/点踩
			useToast("请登录后再操作~", "error"); // TODO: 使用多语言
			return;
		}

		if (button === "upvote") // 判断是点赞还是点踩
			if (isUpvoted.value) // 如果被点赞的视频评论此前已经被点赞，则取消点赞，否则点赞
				// 取消点赞
				cancelVideoCommentUpvote(commentId, videoId);
			else
				// 点赞
				emitVideoCommentUpvote(commentId, videoId);
		else
			if (isDownvoted.value) // 如果被踩的视频评论此前已经被点踩，则取消点踩，否则点踩
				// 取消点踩
				cancelVideoCommentDownvote(commentId, videoId);
			else
				// 点踩
				emitVideoCommentDownvote(commentId, videoId);
	}

	/**
	 * 点赞视频评论
	 * @param commentId 视频评论 ID
	 * @param videoId 视频 ID
	 */
	function emitVideoCommentUpvote(commentId: string, videoId: number) {
		voteLock.value = true; // 请求锁：锁定
		const emitVideoCommentUpvoteRequest: EmitVideoCommentUpvoteRequestDto = { id: commentId, videoId };
		api.videoComment.emitVideoCommentUpvote(emitVideoCommentUpvoteRequest).catch(error => {
			voteLock.value = false; // 请求锁：释放
			useToast("点赞失败！", "error"); // TODO: 使用多语言
			console.error("ERROR", "点赞失败！", error);
		}).finally(() => {
			voteLock.value = false; // 请求锁：释放
		});

		isUpvoted.value = true; // 设置点赞 ICON 高亮
		upvote.value++; // 赞数增加
		if (isDownvoted.value) { // 如果用户在点赞操作前，已经有点踩，则取消点踩的高亮，并减少点踩数量
			isDownvoted.value = false;
			downvote.value--;
		}
	}

	/**
	 * 取消视频评论点赞
	 * @param commentId 视频评论 ID
	 * @param videoId 视频 ID
	 */
	function cancelVideoCommentUpvote(commentId: string, videoId: number) {
		voteLock.value = true; // 请求锁：锁定
		const cancelVideoCommentUpvoteRequest: CancelVideoCommentUpvoteRequestDto = { id: commentId, videoId };
		api.videoComment.cancelVideoCommentUpvote(cancelVideoCommentUpvoteRequest).catch(error => {
			voteLock.value = false; // 请求锁：释放
			useToast("取消点赞失败！", "error"); // TODO: 使用多语言
			console.error("ERROR", "取消点赞失败！", error);
		}).finally(() => {
			voteLock.value = false; // 请求锁：释放
		});

		isUpvoted.value = false; // 取消点赞 ICON 高亮
		upvote.value--; // 赞数减少
	}

	/**
	 * 视频评论点踩
	 * @param commentId 视频评论 ID
	 * @param videoId 视频 ID
	 */
	function emitVideoCommentDownvote(commentId: string, videoId: number) {
		voteLock.value = true; // 请求锁：锁定
		const emitVideoCommentDownvoteRequest: EmitVideoCommentDownvoteRequestDto = { id: commentId, videoId };
		api.videoComment.emitVideoCommentDownvote(emitVideoCommentDownvoteRequest).catch(error => {
			voteLock.value = false; // 请求锁：释放
			useToast("点踩失败！", "error"); // TODO: 使用多语言
			console.error("ERROR", "点踩失败！", error);
		}).finally(() => {
			voteLock.value = false; // 请求锁：释放
		});

		isDownvoted.value = true; // 设置点踩 ICON 高亮
		downvote.value++; // 踩数增加
		if (isUpvoted.value) { // 如果用户在点踩操作前，已经有点赞，则取消点赞的高亮，并减少点赞数量
			upvote.value--;
			isUpvoted.value = false;
		}
	}

	/**
	 * 取消视频评论点踩
	 * @param commentId 视频评论 ID
	 * @param videoId 视频 ID
	 */
	function cancelVideoCommentDownvote(commentId: string, videoId: number) {
		voteLock.value = true; // 请求锁：锁定
		const cancelVideoCommentDownvoteRequest: CancelVideoCommentDownvoteRequestDto = { id: commentId, videoId };
		api.videoComment.cancelVideoCommentDownvote(cancelVideoCommentDownvoteRequest).catch(error => {
			voteLock.value = false; // 请求锁：释放
			useToast("取消点踩失败！", "error"); // TODO: 使用多语言
			console.error("ERROR", "取消点踩失败！", error);
		}).finally(() => {
			voteLock.value = false; // 请求锁：释放
		});

		isDownvoted.value = false; // 取消点踩 ICON 高亮
		downvote.value--; // 踩数减少
	}

	/**
	 * // TODO: 删除评论。
	 * @param commentId - 评论 ID。
	 */
	async function deleteComment(commentId: number | undefined) {
		if (!commentId) return;
		const api = useApi();
		await api.deleteComment(commentId);
		// TODO: trigger reload in parent
	}
</script>

<template>
	<Comp>
		<UserAvatar :avatar :uid />
		<div class="content">
			<div class="header">
				<Icon v-if="pinned" name="pin" class="pin" />
				<span class="username">{{ username }}</span>
			</div>
			<div class="comments">
				<slot>
					ふたりの時間、選びとる未来。<br />
					艾拉是整个 KIRAKIRA 开发组最笨的笨蛋です。
				</slot>
			</div>
			<div class="footer">
				<div class="left">
					<div v-if="index !== undefined">#{{ index }}</div>
					<div>{{ date }}</div>
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
						<MenuItem icon="delete" @click="deleteComment(index)">{{ t.delete }}</MenuItem>
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

		.username {
			font-weight: bold;
			font-size: 16px;
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
