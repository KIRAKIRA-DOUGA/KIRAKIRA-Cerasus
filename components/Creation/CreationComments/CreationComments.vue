<docs>
	### 稿件评论
</docs>

<script setup lang="ts">
	const props = defineProps<{
		/** 评论数目。 */
		count: number | string;
		comments: Comments200ResponseInner[];
		videoId: number;
	}>();

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
				v-model:like="like"
				v-model:dislike="dislike"
				v-model:likeClicked="likeClicked"
				v-model:dislikeClicked="dislikeClicked"
				v-model:pinned="pinned"
				:index="1"
				:message="comment.content"
			>
				ふたりの時間、選びとる未来。<br />
				艾拉是整个 KIRAKIRA 开发组最笨的笨蛋です。
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
