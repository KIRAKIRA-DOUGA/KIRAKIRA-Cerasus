<script setup lang="ts">
	import { useEditor, EditorContent } from "@tiptap/vue-3";
	import StarterKit from "@tiptap/starter-kit";
	import VueComponent from "./Extension";

	const editor = useEditor({
		extensions: [
			StarterKit,
			VueComponent,
		],
		// <vue-component></vue-component> is a custom Vue Component
		content: `
				<p>I'm running Tiptap with Vue.js. 🎉</p>
				<tiptap-thumb-video></tiptap-thumb-video>
				<p>Did you see that? That's a Vue component. We are really living in the future.</p>
			`,
		autofocus: true,
		editable: true,
		injectCSS: false,
	});

	/**
	 * 切换文本加粗。
	 */
	function toggleBoldText() {
		editor.value?.chain().focus().toggleBold().run();
	}

	/**
	 * 切换文本倾斜。
	 */
	function toggleItalicText() {
		editor.value?.chain().focus().toggleItalic().run();
	}

	/**
	 * 切换文本删除线。
	 */
	function toggleStrikeText() {
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
	<div class="container">
		<LocaleLink to="/">Home</LocaleLink>

		<h3>富文本示例</h3>

		<div class="components-demo">
			<p>这是一个不正常的视频卡片组件在 Nuxt3 中的渲染效果：</p>
			<ThumbVideo
				link="video"
				uploader="艾了个拉"
				:date="new Date()"
				:watchedCount="233_0000"
				:duration="new Duration(2, 33)"
			>测试视频</ThumbVideo>
		</div>

		<div class="introduce">
			<p>基于 <a href="https://tiptap.dev/introduction">Tiptap</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;代码位置：components/TextEditor/*&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;下方灰色部分为富文本编辑器本体，比较粗糙，仅供演示...</p>
			<p>目前实现的是：加粗或取消加粗选中的文本，或者在光标所在位置<a href="https://tiptap.dev/guide/node-views/vue">追加一个 Vue 组件</a>, 尝试一下？</p>
			<p>比较遗憾的是, Tiptap 原生不支持 Markdown 格式的输入和输出，仅支持 Json 或者 HTML 字符串</p>
		</div>

		<div class="element text-editor">
			<div class="menu">
				<span class="menu-item" :class="{ active: editor?.isActive('bold') }" @click="toggleBoldText"><b>B</b></span>
				<span class="menu-item" :class="{ active: editor?.isActive('italic') }" @click="toggleItalicText"><i>I</i></span>
				<span class="menu-item" :class="{ active: editor?.isActive('strike') }" @click="toggleStrikeText"><s>S</s></span>
				<span class="menu-item" @click="addVueComponents">Add Vue Components</span>
			</div>
			<EditorContent :editor="editor" />
		</div>

	</div>
</template>

<style scoped lang="scss">
	.text-editor {
		padding: 5px;
		background-color: c(main-bg);
		border: 1px solid black;
	}

	.menu {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 10px;
	}

	.menu-item {
		display: block;
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

	.components-demo {
		margin: 5px 0;
		padding: 5px;
		border: 1px solid black;
	}

	.introduce {
		margin: 5px 0;
		padding: 5px;
		border: 1px solid black;
	}
</style>
