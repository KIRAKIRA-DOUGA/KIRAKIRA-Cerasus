<docs>
	### 稿件评论
</docs>

<script setup lang="ts">
	const props = defineProps<{
		/** 评论数目。 */
		count: number | string;
	}>();

	const like = ref(0), dislike = ref(0), likeClicked = ref(false), dislikeClicked = ref(false);
</script>

<template>
	<Comp>
		<HeadingComments :count="count" />
		<TextEditorRtf />
		<div class="items">
			<CreationCommentsItem
				v-model:like="like"
				v-model:dislike="dislike"
				v-model:likeClicked="likeClicked"
				v-model:dislikeClicked="dislikeClicked"
				:index="1"
			>
				ふたりの時間、選びとる未来。<br />
				ふたりの時間、選びとる未来。艾拉是整个 KIRAKIRA 开发组最笨的笨蛋です。
			</CreationCommentsItem>
		</div>
		<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
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
