<script setup lang="ts">
	import { nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
	defineProps(nodeViewProps);
</script>

<template>
	<NodeViewWrapper>
		<SmallKaomojiBar />
	</NodeViewWrapper>
</template>
