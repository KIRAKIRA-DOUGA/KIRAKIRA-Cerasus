<script setup lang="ts">
	import { useEditor, EditorContent } from "@tiptap/vue-3";
	import StarterKit from "@tiptap/starter-kit";
	import VueComponent from "./Extension";

	const editor = useEditor({
		extensions: [
			StarterKit,
			VueComponent,
		],
		content: `
			<p>我正在用 Vue.js 运行 Tiptap。🎉</p>
			<thumb-video></thumb-video>
			<p>你看到了吗？这是 Vue 组件。我们真的生活在未来。</p>
		`,
		autofocus: true,
		editable: true,
		injectCSS: false,
	});

	/**
	 * 切换文本加粗。
	 */
	function toggleBold() {
		editor.value?.chain().focus().toggleBold().run();
	}

	/**
	 * 切换文本倾斜。
	 */
	function toggleItalic() {
		editor.value?.chain().focus().toggleItalic().run();
	}

	/**
	 * 切换文本删除线。
	 */
	function toggleStrike() {
		editor.value?.chain().focus().toggleStrike().run();
	}

	/**
	 * 在富文本编辑器光标处追加一个 Vue 组件。
	 */
	function addVueComponents() {
		editor.value?.commands.insertContent("<tiptap-thumb-video></tiptap-thumb-video>");
	}
</script>

<template>
	<div class="text-editor">
		<div class="menu">
			<div :class="{ active: editor?.isActive('bold') }" @click="toggleBold"><b>B</b></div>
			<div :class="{ active: editor?.isActive('italic') }" @click="toggleItalic"><i>I</i></div>
			<div :class="{ active: editor?.isActive('strike') }" @click="toggleStrike"><s>S</s></div>
			<div @click="addVueComponents">Add Vue Components</div>
		</div>
		<EditorContent :editor="editor" />
	</div>
</template>

<style scoped lang="scss">
	.text-editor {
		@include radius-large;
		@include card-shadow;
		background-color: c(main-bg);

		> * {
			padding: 12px;
		}

		.menu {
			@include card-in-card-shadow;
			display: flex;
			gap: 0.5rem;

			> * {
				padding: 0 0.5rem;
				text-align: center;
				background-color: c(accent);
				cursor: pointer;

				&:hover {
					background-color: c(accent-hover);
				}

				&.active {
					color: white;
					background-color: #333;
				}
			}
		}
	}
</style>
