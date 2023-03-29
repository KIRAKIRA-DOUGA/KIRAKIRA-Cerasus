import { mergeAttributes, Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";

import Component from "./Component.vue";

export default Node.create({
	name: "tiptapThumbVideo",

	group: "block",

	atom: true,

	parseHTML() {
		return [
			{
				tag: "tiptap-thumb-video",
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		return ["tiptap-thumb-video", mergeAttributes(HTMLAttributes)];
	},

	addNodeView() {
		return VueNodeViewRenderer(Component);
	},
});

// export const tiptapThumbVideoComponents = Node.create({
// 	name: "vueComponent",

// 	group: "block",

// 	atom: true,

// 	parseHTML() {
// 		return [
// 			{
// 				tag: "vue-component",
// 			},
// 		];
// 	},

// 	renderHTML({ HTMLAttributes }) {
// 		return ["vue-component", mergeAttributes(HTMLAttributes)];
// 	},

// 	addNodeView() {
// 		return VueNodeViewRenderer(Component);
// 	},
// });
