import { Extension, Mark, Node, mergeAttributes } from "@tiptap/core";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { Plugin } from "@tiptap/pm/state";
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

/**
 * Count visible text and leaf nodes such as embedded video components.
 * @param doc - ProseMirror document to inspect.
 * @returns The number of visible characters and leaf nodes.
 */
export function getEditorContentLength(doc: ProseMirrorNode) {
	return doc.textBetween(0, doc.content.size, "\n", "\ufffc").length;
}

/** Prevent transactions from growing the document beyond the configured limit. */
const CharacterLimit = Extension.create<{ limit: number }>({
	name: "characterLimit",
	addOptions: () => ({ limit: Number.POSITIVE_INFINITY }),
	addProseMirrorPlugins() {
		return [new Plugin({
			filterTransaction: (transaction, state) => {
				if (!transaction.docChanged) return true;
				const previousLength = getEditorContentLength(state.doc);
				const nextLength = getEditorContentLength(transaction.doc);
				return nextLength <= this.options.limit || nextLength < previousLength;
			},
		})];
	},
});

/** Inline text color mark used without allowing arbitrary inline styles. */
const TextColor = Mark.create({
	name: "textColor",
	addAttributes() {
		return {
			color: {
				default: null,
				parseHTML: element => element.style.color || null,
				renderHTML: attributes => attributes.color ? { style: `color: ${attributes.color}` } : {},
			},
		};
	},
	parseHTML() {
		return [{ tag: "span[style*='color']" }];
	},
	renderHTML({ HTMLAttributes }) {
		return ["span", mergeAttributes(HTMLAttributes), 0];
	},
});

/** Hyperlink mark with a deliberately small, safe set of supported protocols. */
const Link = Mark.create({
	name: "link",
	inclusive: false,
	addAttributes() {
		return {
			href: { default: null },
		};
	},
	parseHTML() {
		return [{
			tag: "a[href]",
			getAttrs: element => {
				const href = (element as HTMLElement).getAttribute("href");
				return href && isSafeEditorLink(href) ? { href } : false;
			},
		}];
	},
	renderHTML({ HTMLAttributes }) {
		const href = String(HTMLAttributes.href ?? "");
		if (!isSafeEditorLink(href)) return ["span", {}, 0];
		return ["a", mergeAttributes(HTMLAttributes, {
			class: "link lite",
			rel: "noopener noreferrer nofollow",
			target: "_blank",
		}), 0];
	},
});

/**
 * Check whether an editor link can be rendered or persisted.
 * @param href - Link target to validate.
 * @returns Whether the target uses an allowed protocol or is a local reference.
 */
export function isSafeEditorLink(href: string) {
	return /^(?:https?:|mailto:|tel:|\/|#)/i.test(href.trim());
}

export default {
	ThumbVideo, CursorShadow, CharacterLimit, TextColor, Link,
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
