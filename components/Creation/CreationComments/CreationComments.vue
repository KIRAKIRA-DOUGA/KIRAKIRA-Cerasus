<docs>
	### 稿件评论
</docs>

<script setup lang="ts">
	import type { JSONContent } from "@tiptap/vue-3";

	const { t } = useI18n();

	const props = withDefaults(defineProps<{
		/** 视频 ID。 */
		videoId: number;
		/** 是否可以编辑（用户如果被屏蔽等情况下无法编辑） */
		editable?: boolean;
	}>(), {
		editable: true,
	});

	const pageSize = 20; // 每页评论数
	const comments = ref<GetVideoCommentByKvidResponseDto["videoCommentList"]>([]); // 评论数据
	const commentsCount = ref(0); // 评论数目。
	const currentPage = ref(1); // 当前页码
	const loading = ref(false); // 是否正在加载评论？
	const error = ref(false); // 是否加载失败？
	const pinned = ref(false);
	const search = ref("");
	const pageCount = computed(() => Math.max(1, Math.ceil(commentsCount.value / pageSize)));
	const sort = ref<SortModel>(["rating", "descending"]); // 排序方式
	const isSendingComment = ref(false); // 是否正在发送评论？
		
	const selfUserInfoStore = useSelfUserInfoStore();

	/**
	 * 发送评论
	 * @param contentJson - 评论内容（JSON）
	 * @param contentText - 评论内容（纯文本）
	 * @param clearContent - 清空内容的回调函数，调用后会清空编辑器内容并将文本长度重置为 0
	 */
	async function sendComment(contentJson: JSONContent, contentText: string, clearContent: () => void) {
		try {
			isSendingComment.value = true;
			// TODO: // WARN 需要对用户输入的文字进行 Base64 编码
			const emitVideoCommentRequest: EmitVideoCommentRequestDto = {
				videoId: props.videoId,
				text: contentJson ? JSON.stringify(contentJson) : "", // 发送转化为字符串的 JSON 内容
			};
			// TODO: 虽然我很想非阻塞地发送评论，但是楼层号必须在评论成功提交给后端后才会获得。emmmm...
			const emitVideoCommentResult = await api.videoComment.emitVideoComment(emitVideoCommentRequest);
			const videoComment = emitVideoCommentResult.videoComment;
			if (emitVideoCommentResult?.success && videoComment) {
				clearContent();
				useEvent("videoComment:emitVideoComment", videoComment);
				useToast(t("toast.comment_sent"), "success", 5000);
			} else {
				useToast(t("toast.something_went_wrong"), "error", 5000);
				console.error("ERROR", "Failed to send comment: request failed.");
			}
			isSendingComment.value = false;
		} catch (error) {
			useToast(t("toast.something_went_wrong"), "error", 5000);
			console.error("ERROR", "Failed to send comment:", error);
			isSendingComment.value = false;
		}
	}

	/**
	 * 监听发送评论事件，将发送的评论添加到评论列表中
	 */
	useListen("videoComment:emitVideoComment", videoComment => {
		comments.value.push(videoComment);
		commentsCount.value++;
	});

	/**
	 * 监听删除评论事件，根据被删除的评论路由来过滤评论列表
	 * // TODO: 性能改进
	 */
	useListen("videoComment:deleteVideoComment", commentRoute => {
		comments.value = comments.value.filter(comment => comment.commentRoute !== commentRoute);
		commentsCount.value--;
	});

	/**
	 * 获取视频的评论数据
	 */
	async function fetchVideoCommentData() {
		const getVideoCommentByKvidRequest: GetVideoCommentByKvidRequestDto = {
			videoId: props.videoId,
			pagination: {
				page: currentPage.value,
				pageSize,
			},
		};
		loading.value = true;
		error.value = false;
		const videoCommentsResponse = await api.videoComment.getVideoCommentByKvid(getVideoCommentByKvidRequest);
		loading.value = false;
		if (videoCommentsResponse.success) {
			comments.value = videoCommentsResponse.videoCommentList ?? [];
			commentsCount.value = videoCommentsResponse.videoCommentCount ?? 0;
		} else
			error.value = true;
	}

	if (environment.client)
		fetchVideoCommentData();

	watch(currentPage, fetchVideoCommentData);
</script>

<template>
	<Comp>
		<HeadingComments :count="commentsCount" />
		<div class="send">
			<UserAvatar :avatar="selfUserInfoStore.userInfo.avatar" />
			<TextEditorRtf
				:editorFeatures="['bold', 'italic', 'underline', 'strike', 'mention', 'kaomoji', 'video-component']"
				:submittable="true"
				:isSubmitting="isSendingComment"
				:editable="props.editable"
				@handleSubmit="sendComment"
			/>
		</div>
		<div class="toolbar">
			<div class="left">
				<Sort v-model="sort">
					<SortItem id="rating">{{ $t("rating") }}</SortItem>
					<SortItem id="date">{{ $t("send_date") }}</SortItem>
				</Sort>
			</div>
			<div class="right">
				<SoftButton icon="deletion_history" />
				<template v-if="commentsCount !== 0">
					<TextBox v-model="search" :placeholder="$t('search')" icon="search" />
					<Pagination v-model="currentPage" :pages="pageCount" :displayPageCount="7" :disabled="loading" />
				</template>
			</div>
		</div>
		<div v-if="!error" class="items-container" :class="{ loading }">
			<div class="items" :inert="loading">
				<CreationCommentsItem
					v-for="comment in comments"
					:key="comment._id"
					v-model:upvote="comment.upvoteCount"
					v-model:downvote="comment.downvoteCount"
					v-model:isUpvoted="comment.isUpvote"
					v-model:isDownvoted="comment.isDownvote"
					v-model:pinned="pinned"
					:commentId="comment._id"
					:videoId
					:uid="comment.uid"
					:index="comment.commentIndex"
					:commentRoute="comment.commentRoute"
					:nickname="comment.userInfo?.userNickname"
					:username="comment.userInfo?.username"
					:avatar="comment.userInfo?.avatar"
					:date="new Date(comment.editDateTime)"
					:upvote_score="comment.upvoteCount"
				>
					<TextEditorRtfReadonly :contentJsonString="comment.text" :editable="false" />
				</CreationCommentsItem>
				<ContentUnavailable v-if="!loading && commentsCount === 0" icon="chat_bubble" :title="$t('empty.comments')" />
			</div>
			<div v-if="loading" class="loading-indicator">
				<ProgressRing />
			</div>
		</div>
		<ContentUnavailable v-else type="error" />
		<div v-if="commentsCount !== 0" class="toolbar bottom">
			<Pagination v-model="currentPage" :pages="pageCount" :displayPageCount="7" :disabled="loading" />
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		header {
			margin-bottom: 16px;
		}
	}

	.heading-comments {
		@include tablet {
			display: none;
		}
	}

	.send {
		display: flex;
		gap: 12px;
		margin-bottom: 16px;

		.user-avatar {
			--size: 40px;
		}

		&:deep(.text-editor-rtf) {
			flex-grow: 1;
		}
	}

	.toolbar {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		padding-block: 6px;

		&.bottom {
			justify-content: end;
		}

		> * {
			display: flex;
			flex-wrap: wrap;
			gap: 16px;
			justify-content: end;
			align-items: center;
		}

		.sort {
			grid-auto-flow: column;
		}

		.soft-button {
			--wrapper-size: 36px;
			--ripple-size: 48px;
		}

		.text-box {
			width: 200px;
		}
	}

	.items-container {
		position: relative;

		&.loading .items {
			opacity: 0;
		}

		.loading-indicator {
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			display: flex;
			justify-content: center;
			padding-block: 48px;
		}
	}
</style>
