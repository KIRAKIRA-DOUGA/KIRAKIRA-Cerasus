<script setup lang="ts">

</script>

<template>
	<div class="big">
		<slot></slot>
	</div>
</template>

<style scoped lang="scss">
	.big {
		margin-bottom: -2px;
		color: c(accent);
		font-weight: 900;
		font-size: 40px;
		text-transform: capitalize;
		transform: skewX(-10deg);
		transform-origin: left bottom;
		font-variant-caps: small-caps;
		// 不要使用 `font-style: italic;`，因为太斜了。

		&:lang(en) {
			font-family: $english-logo-fonts;
		}
	}
</style>
