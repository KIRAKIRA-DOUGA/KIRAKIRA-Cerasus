import { mergeAttributes, Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import Component from "./TextEditorComponent.vue";
import EmojiBar from "./TextEditorEmojiBar.vue";

const emoji = Node.create({
	name: "emojiBar",
	group: "block",
	atom: true,
	parseHTML() {
		return [{
			tag: "emoji-bar",
		}];
	},
	renderHTML({ HTMLAttributes }) {
		return ["emoji-bar", mergeAttributes(HTMLAttributes)];
	},
	addNodeView() {
		return VueNodeViewRenderer(EmojiBar);
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
	emoji,
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
