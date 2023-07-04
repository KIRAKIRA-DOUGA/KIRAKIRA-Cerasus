<script setup lang="ts">
	useHead({ title: "富文本测试页" });
</script>

<template>
	<div class="container">
		<ShadingIcon icon="email" position="right top" />

		<Heading>富文本示例</Heading>

		<div class="introduce">
			<p>基于 <a target="_blank" href="https://tiptap.dev/introduction">Tiptap</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;代码位置：components/TextEditor/*&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;下方部分为富文本编辑器本体，比较粗糙，仅供演示……</p>
			<p>目前实现的是：加粗或取消加粗选中的文本，或者在光标所在位置<a target="_blank" href="https://tiptap.dev/guide/node-views/vue">追加一个 Vue 组件</a>，尝试一下？</p>
			<p>比较遗憾的是，Tiptap 原生不支持 Markdown 格式的输入和输出，仅支持 JSON 或者 HTML 字符串。</p>
		</div>

		<TextEditorRtf />
	</div>
</template>

<style scoped lang="scss">
	.introduce {
		@include round-large;
		margin: 1rem 0;
		padding: 1rem;
		background-color: c(gray-20);
	}
</style>
