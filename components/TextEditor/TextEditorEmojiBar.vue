<script setup lang="ts">
	import { nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
	defineProps(nodeViewProps);
	const emojis = ["aa", "bb", "vv", "4", "5"];
</script>

<template>
	<NodeViewWrapper>
		<EmojiBar :emoji="emojis" />
	</NodeViewWrapper>
</template>
