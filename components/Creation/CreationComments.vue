<docs>
	### 稿件评论
</docs>

<script setup lang="ts">
	const props = defineProps<{
		/** 评论数目。 */
		count: number | string;
	}>();
</script>

<template>
	<Comp>
		<HeadingComments :count="count" />
		<TextEditorRtf />
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
