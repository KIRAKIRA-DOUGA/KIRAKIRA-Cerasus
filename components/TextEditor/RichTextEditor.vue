<script setup lang="ts">
	import { useEditor, EditorContent } from "@tiptap/vue-3";
	// eslint-disable-next-line import/no-named-as-default
	import StarterKit from "@tiptap/starter-kit"; // > Here we got a eslint warning, So I use eslint ignore
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
	 * 让选中的文本黑体 / 取消选中文本黑体
	 */
	const makeToggleTextBold = () => {
		editor.value && editor.value.chain().focus().toggleBold().run();
	};

	/**
	 * 在富文本编辑器光标处追加一个 Vue 组件
	 */
	const addVueComponents = () => {
		editor.value && editor.value.commands.insertContent("<tiptap-thumb-video></tiptap-thumb-video>");
	};
</script>

<template>
	<div class="container">
		<LocaleLink to="/">Home</LocaleLink>

		<div class="components-demo">
			<p>这是一个正常的在 Vue 中调用的组件的示例：</p>
			<ThumbVideo
				link="video"
				uploader="艾了个拉"
				:date="new Date()"
				:watchedCount="233_0000"
				:duration="new Duration(2, 33)"
			>测试视频</ThumbVideo>
		</div>
		
		<div class="introduce">
			<p>基于 <a href="https://tiptap.dev/introduction">Tiptap</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;代码位置：components/TextEditor/*&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;下方灰色部分为富文本测试。比较粗糙，仅供演示...</p>
			<p>目前实现的是：加粗/取消加粗选中文本，或者<a href="https://tiptap.dev/guide/node-views/vue">追加一个 Vue 组件</a>到富文本编辑器中，尝试一下？</p>
			<p>比较遗憾的是, Tiptap 原生不支持 Markdown 格式的输入 / 输出，仅支持 Json 或者 HTML 字符串</p>
		</div>
		
		<div class="element text-editor">
			<div class="menu">
				<span class="menu-item" :class="{ 'menu-item-is-active': editor && editor.isActive('bold') }" @click="makeToggleTextBold()">加粗</span>
				<span class="menu-item" @click="addVueComponents()">Add Vue Components</span>
			</div>
			<EditorContent :editor="editor" />
		</div>

	</div>
</template>

<style scoped lang="scss">
	.text-editor {
		background-color: #EEEEEE;
		border: 1px solid #000000;
		padding: 5px;
	}
	.menu {
		margin-bottom: 10px;
	}
	.menu-item {
		text-align: center;
		background-color: #CCCCCC;

		margin-right: 5px;
	}
	.menu-item:hover {
		background-color: #999999;
		cursor: pointer;
	}
	.menu-item-is-active {
		background-color: #333333 !important; // FIXME
		color: #FFFFFF;
	}
	.components-demo {
		border: 1px solid #000000;
		margin: 5px 0px;
		padding: 5px;
	}
	.introduce {
		border: 1px solid #000000;
		margin: 5px 0px;
		padding: 5px;
	}
</style>
