import { mergeAttributes, Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import Component from "./TextEditorComponent.vue";
import KaomojiBar from "./TextEditorSmallKaomojiBar.vue";

const kaomoji = Node.create({
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
});
const thumbVideo = Node.create({
	name: "thumbVideo",
	group: "block",
	atom: true,
	parseHTML() {
		return [{
			tag: "thumb-video",
		}];
	},
	renderHTML({ HTMLAttributes }) {
		return ["thumb-video", mergeAttributes(HTMLAttributes)];
	},
	addNodeView() {
		return VueNodeViewRenderer(Component);
	},
});

export default {
	thumbVideo,
	kaomoji,

};

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
