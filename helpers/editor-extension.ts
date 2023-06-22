import { mergeAttributes, Node, Mark } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import TextEditorComponent from "components/TextEditor/TextEditorComponent.vue";

const ThumbVideo = Node.create({
	name: "thumbVideo",
	group: "block",
	atom: true,
	parseHTML() {
		return [{
			tag: "thumb-video",
		}];
	},
	renderHTML({ HTMLAttributes }) {
		return ["thumb-video", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
	},
	addNodeView() {
		return VueNodeViewRenderer(TextEditorComponent);
	},
});

const CursorShadow = Mark.create({
	name: "cursorShadow",
	parseHTML() {
		return [{
			tag: "cursor",
		}];
	},
	renderHTML({ HTMLAttributes }) {
		return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
	},
	addAttributes() {
		return {
			id: {
				default: null,
				renderHTML: attributes => ({
					"data-id": attributes.id,
				}),
			},
		};
	},
});

export default {
	ThumbVideo, CursorShadow,
};

/* const kaomoji = Node.create({
	name: "smallKaomojiBar",
	group: "block",
	atom: true,
	parseHTML() {
		return [{
			tag: "small-kaomoji-bar",
		}];
	},
	renderHTML({ HTMLAttributes }) {
		return ["small-kaomoji-bar", mergeAttributes(HTMLAttributes)];
	},
	addNodeView() {
		return VueNodeViewRenderer(KaomojiBar);
	},
}); */

/* export const tiptapThumbVideoComponents = Node.create({
	name: "vueComponent",
	group: "block",
	atom: true,
	parseHTML() {
		return [
			{
				tag: "vue-component",
			},
		];
	},
	renderHTML({ HTMLAttributes }) {
		return ["vue-component", mergeAttributes(HTMLAttributes)];
	},
	addNodeView() {
		return VueNodeViewRenderer(Component);
	},
}); */

/* <script setup lang="ts">
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
</template> */

/* <script setup lang="ts">
	import { nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
	defineProps(nodeViewProps);
</script>

<template>
	<NodeViewWrapper>
		<SmallKaomojiBar />
	</NodeViewWrapper>
</template> */
