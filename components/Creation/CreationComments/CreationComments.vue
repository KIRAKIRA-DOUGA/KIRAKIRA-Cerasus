<docs>
	### 稿件评论
</docs>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 评论数目。 */
		count?: number;
		comments?: GetVideoCommentByKvidResponseDto["videoCommentList"];
		videoId: number;
	}>(), {
		count: 0,
		comments: () => [],
	});

	const pinned = ref(false);
	const search = ref("");
	const pageCount = computed(() => Math.ceil(props.count / 20));
</script>

<template>
	<Comp>
		<HeadingComments :count="count" />
		<TextEditorRtf :videoId="videoId" />
		<div class="toolbar">
			<div class="left">

			</div>
			<div class="right">
				<TextBox v-model="search" :placeholder="t.search" icon="search" />
				<Pagination :current="1" :pages="pageCount" :displayPageCount="7" />
				<SoftButton icon="deletion_history" />
			</div>
		</div>
		<div class="items">
			<CreationCommentsItem
				v-for="comment in comments"
				:key="comment._id"
				v-model:upvote="comment.upvoteCount"
				v-model:downvote="comment.downvoteCount"
				v-model:isUpvoted="comment.isUpvote"
				v-model:isDownvoted="comment.isDownvote"
				v-model:pinned="pinned"
				:commentId="comment._id"
				:videoId="videoId"
				:index="comment.commentIndex"
				:username="comment.userInfo?.username"
				:avatar="comment.userInfo?.avatar"
				:date="new Date(comment.editDateTime)"
				:upvote_score="comment.upvoteCount"
			>
				<!-- eslint-disable-next-line vue/no-v-html -->
				<div v-html="comment.text"></div>
			</CreationCommentsItem>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		margin-top: 2.5rem;

		header {
			margin-bottom: 16px;
		}
	}

	.toolbar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		margin-top: 16px;

		> * {
			display: flex;
			flex-wrap: wrap;
			gap: 16px;
			align-items: center;
			justify-content: flex-end;
		}

		.soft-button {
			--wrapper-size: 36px;
			--ripple-size: 48px;
		}

		.text-box {
			width: 200px;
		}
	}
</style>
