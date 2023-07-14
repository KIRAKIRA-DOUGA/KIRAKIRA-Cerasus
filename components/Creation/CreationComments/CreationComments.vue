<docs>
	### 稿件评论
</docs>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 评论数目。 */
		count?: number | string;
		comments?: Comments200ResponseInner[];
		videoId?: number;
	}>(), {
		count: 0,
		comments: () => [],
		videoId: undefined,
	});

	const like = ref(0), dislike = ref(0), likeClicked = ref(false), dislikeClicked = ref(false), pinned = ref(false);
</script>

<template>
	<Comp>
		<HeadingComments :count="count" />
		<TextEditorRtf :videoId="videoId" />
		<div class="items">
			<CreationCommentsItem
				v-for="comment in comments"
				:key="comment.id"
				v-model:like="comment.upvoteCount"
				v-model:dislike="dislike"
				v-model:likeClicked="comment.userHasUpvoted"
				v-model:dislikeClicked="dislikeClicked"
				v-model:pinned="pinned"
				:index="comment.id"
				:username="comment.fullname"
				:avatar="comment.profilePictureUrl"
				:date="new Date(comment.created!)"
			>
				<!-- eslint-disable-next-line vue/no-v-html -->
				<div v-html="comment.content"></div>
			</CreationCommentsItem>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		margin-top: 2.5rem;

		header {
			margin-bottom: 1rem;
		}
	}
</style>
