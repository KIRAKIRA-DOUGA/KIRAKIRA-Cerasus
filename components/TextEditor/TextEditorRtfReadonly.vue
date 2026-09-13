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
			StarterKit,
			Underline,
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
		overflow: clip;
		// background-color: c(inset-bg);

		> :first-child {
			display: block;
			min-height: 3em;
			// padding: 12px;
		}
	}
</style>
