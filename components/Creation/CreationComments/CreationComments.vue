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
	const pageCount = computed(() => Math.floor(props.count / 20) + 1);
</script>

<template>
	<Comp>
		<HeadingComments :count />
		<TextEditorRtf :videoId />
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
				:videoId
				:uid="comment.uid"
				:index="comment.commentIndex"
				:uid="comment.uid"
				:commentRoute="comment.commentRoute"
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
		justify-content: space-between;
		align-items: center;
		margin-top: 16px;

		> * {
			display: flex;
			flex-wrap: wrap;
			gap: 16px;
			justify-content: flex-end;
			align-items: center;
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
