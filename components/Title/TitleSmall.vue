<script setup lang="ts">

</script>

<template>
	<div class="sub">
		<slot></slot>
	</div>
</template>

<style scoped lang="scss">
	.sub {
		color: c(accent);
		font-weight: 700;
		font-size: 30px;
		font-family: TitleSmall, $fallback-fonts;
		font-style: italic;
		text-transform: uppercase;
		background-clip: text;
		-webkit-text-stroke-width: 1px;
		-webkit-text-fill-color: transparent;
		opacity: 0.4;
	}
</style>
