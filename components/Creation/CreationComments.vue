<docs>
	### 稿件评论
</docs>

<script setup lang="ts">
	const props = defineProps<{
		count: number | string;
	}>();
</script>

<template>
	<Comp>
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
