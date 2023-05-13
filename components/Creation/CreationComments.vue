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
		<HeaderComments :count="count" />
		<TextEditorRich />
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		margin-top: 70px;
	}
</style>
