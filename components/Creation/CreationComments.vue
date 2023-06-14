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
	<Comp role="application">
		<HeadingComments :count="count" />
		<TextEditorRich />
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		margin-top: 2.5rem;
	}

	.text-editor-rich {
		margin-top: 1rem;
	}
</style>
