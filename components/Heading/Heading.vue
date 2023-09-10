<docs>
	顶部的大标题。

	~~不叫 Title 是因为和 HTML title 标签冲突了。~~
	~~不叫 Head 是因为和 HTML head 标签冲突了。~~
	~~不叫 Header 是因为和 HTML header 标签冲突了。~~
	而 HTML h1~h6 标签的对应类名就是 HTML**Heading**Element。
</docs>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		form?: "main" | "small" | "small-solid";
	}>(), {
		form: "main",
	});
</script>

<template>
	<h1
		:class="{
			sub: form === 'small' || form === 'small-solid',
			stroked: form === 'small',
		}"
	>
		<slot></slot>
	</h1>
</template>

<style scoped lang="scss">
	h1 {
		color: c(accent);

		&:not(.sub) {
			margin-bottom: -2px;
			font-weight: 900;
			font-size: 40px;
			text-transform: capitalize;
			transform: skewX(-10deg); // 不要使用 `font-style: italic;`，因为太斜了。
			transform-origin: left bottom;
			font-variant-caps: small-caps;
			transition: none;

			&:lang-latin {
				font-family: $english-logo-fonts;
				font-style: italic;
				transform: none;
			}
		}

		&.sub {
			margin-bottom: 1px;
			font-weight: bold;
			font-size: 30px;
			font-family: $english-logo-fonts;
			font-style: italic;
			text-transform: uppercase;

			&.stroked {
				background-clip: text;
				opacity: 0.4;
				-webkit-text-stroke-width: 1px;
				-webkit-text-fill-color: transparent;
			}
		}
	}
</style>
