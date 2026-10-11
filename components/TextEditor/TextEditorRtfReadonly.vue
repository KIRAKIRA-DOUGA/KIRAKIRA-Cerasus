<script setup lang="tsx">
	import { Underline } from "@tiptap/extension-underline";
	import StarterKit from "@tiptap/starter-kit";
	import { EditorContent, type JSONContent, useEditor } from "@tiptap/vue-3";
	import VueComponent from "helpers/editor-extension";

	const props = defineProps<{
		/** 富文本内容（转换为字符串的 JSON） */
		contentJsonString: string;
	}>();

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				hardBreak: { HTMLAttributes: { class: "soft-break" } },
			}),
			Underline,
			VueComponent.Link,
			VueComponent.TextColor,
			VueComponent.ThumbVideo,
			VueComponent.CursorShadow,
		],
		content: parseTiptapContent(props.contentJsonString),
		autofocus: false,
		editable: false,
		injectCSS: false,
	});

	/**
	 * 解析 Tiptap 内容字符串为 JSONContent 对象，如果无法解析，则直接将字符串原文格式化。
	 * @param content - 待解析的内容字符串
	 * @returns 解析后的 JSONContent 对象
	 */
	function parseTiptapContent(content: string): JSONContent {
		try {
			const json = JSON.parse(content);

			if (json && json.type === "doc")
				return json;
		} catch {}

		return {
			type: "doc",
			content: [
				{
					type: "paragraph",
					content: content ?
						[
							{
								type: "text",
								text: String(content),
							},
						] :
						[],
				},
			],
		};
	}
</script>

<template>
	<ClientOnly>
		<EditorContent :editor />
	</ClientOnly>
</template>

<style scoped lang="scss">
	:comp {
		@include round-large;
		@include control-inner-shadow;
		min-width: 0;
		max-width: 100%;
		overflow: clip;
		// background-color: c(inset-bg);

		> :first-child {
			display: block;
			min-width: 0;
			max-width: 100%;
			min-height: 3em;
			// padding: 12px;
		}

		:deep(.tiptap) {
			min-width: 0;
			max-width: 100%;
			overflow-wrap: anywhere;
		}

		// Enter has the normal line height. Shift+Enter uses a tighter hard break.
		:deep(br.soft-break) {
			content: "";
			display: block;
			margin-top: -0.22em;
		}

		:deep(code) {
			padding: 0 0.3em;
			color: c(text-color);
			font-size: 0.9em;
			line-height: 1.2;
			background-color: c(main-fg, 10%);
			border-radius: 3px;
			box-shadow: 0 0 0 1px c(main-fg, 18%) inset;
			box-decoration-break: clone;
		}

		:deep(pre) {
			@include round-small;
			max-width: 100%;
			margin-block: 0.75em;
			padding: 12px 14px;
			overflow: auto;
			color: c(text-color);
			background-color: c(main-fg, 8%);
			border: 1px solid c(main-fg, 18%);
			white-space: pre-wrap;
			overflow-wrap: normal;
			word-break: normal;
			tab-size: 4;

			code {
				padding: 0;
				font-size: inherit;
				line-height: inherit;
				background: none;
				border: 0;
				border-radius: 0;
				box-shadow: none;
				white-space: inherit;
			}
		}
	}
</style>
