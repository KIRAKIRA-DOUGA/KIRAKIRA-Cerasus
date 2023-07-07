<!-- DELETE: 即将删除！ -->

<script setup lang="ts">
	import { nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
	defineProps(nodeViewProps);
</script>

<template>
	<NodeViewWrapper>
		<ThumbVideo
			link="video"
			uploader="艾了个拉"
			:date="new Date()"
			:watchedCount="233_0000"
			:duration="new Duration(2, 33)"
		>测试视频</ThumbVideo>
	</NodeViewWrapper>
</template>
