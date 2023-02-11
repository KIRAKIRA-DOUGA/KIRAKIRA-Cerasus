<script setup lang="ts">

</script>

<template>
	<div class="big">
		<slot></slot>
	</div>
</template>

<style scoped lang="scss">
	.big {
		color: c(accent);
		font-weight: 900;
		font-size: 40px;
		transform: skewX(-12deg);
		transform-origin: left bottom;
		// 不要使用 `font-style: italic;`，因为太斜了。
	}
</style>
