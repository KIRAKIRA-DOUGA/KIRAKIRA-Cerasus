<script setup lang="ts">
	import { useEditor, EditorContent } from "@tiptap/vue-3";
	import StarterKit from "@tiptap/starter-kit";

	import { Editor } from "@tiptap/core";
	import Document from "@tiptap/extension-document";
	import Paragraph from "@tiptap/extension-paragraph";
	import Text from "@tiptap/extension-text";

	import VueComponent from "./Extension";

	const editor = shallowRef();

	onMounted(() => {
		const targetElement = document.querySelector(".element");
		editor.value = new Editor({
			element: targetElement || undefined,
			extensions: [
				StarterKit,
				VueComponent,
			],
			content: `
				<p>I'm running Tiptap with Vue.js. 🎉</p>
				<vue-component></vue-component>
				<p>Did you see that? That's a Vue component. We are really living in the future.</p>
			`,
			autofocus: true,
			editable: true,
			injectCSS: false,
		});
	});

	const black = () => {
		editor.value && editor.value.chain().focus().toggleBold().run();
	};

	const addVueComponents = () => {
		console.log("aaaa");
	};

	onBeforeUnmount(() => {
		editor.value.destroy();
	});
</script>

<template>
	<div class="container">
		<LocaleLink to="/">Home</LocaleLink>

		<br />

		<ThumbVideo
			link="video"
			uploader="艾了个拉"
			:date="new Date()"
			:watchedCount="233_0000"
			:duration="new Duration(2, 33)"
		>测试视频</ThumbVideo>
		
		<div>
			基于 <a href="https://tiptap.dev/introduction">Tiptap</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;代码位置：components/TextEditor/*&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;以下为富文本测试...
		</div>
		<div>
			基本的样式，比如选中加粗是可以实现的，但是<a href="https://tiptap.dev/guide/node-views/vue">加载 Vue 组件作为富文本的 node</a> 的步骤并不顺利...
		</div>

		<div class="element text-editor">
			<div class="menu">
				<span class="menu-item" @click="black()">加粗</span>
				<span class="menu-item" @click="addVueComponents()">Add Vue Components</span>
			</div>
		</div>

	</div>
</template>

<i18n lang="json5">
	{
		zh: {
			editor: "富文本编辑器",
		},
		en: {
			editor: "Text Editor",
		},
		ja: {
			editor: "テキストエディタ",
		},
	}
</i18n>

<style scoped lang="scss">
	.text-editor {
		background-color: #EEEEEE;
	}
	.menu {
		position: relative;
		top: 5px;
		left: 5px;

		margin-bottom: 10px;
	}
	.menu-item {
		text-align: center;
		background-color: #DDDDDD;

		margin: 5px;
	}
	.menu-item:hover {
		background-color: #CCCCCC;
		cursor: pointer;
	}
</style>
