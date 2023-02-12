<script setup lang="ts">

</script>

<template>
	<div class="sub">
		<slot></slot>
	</div>
</template>

<style scoped lang="scss">
	.sub {
		margin-bottom: 1px;
		color: c(accent);
		font-weight: 700;
		font-size: 30px;
		font-family: $english-logo-fonts;
		font-style: italic;
		text-transform: uppercase;
		background-clip: text;
		opacity: 0.4;
		-webkit-text-stroke-width: 1px;
		-webkit-text-fill-color: transparent;
	}
</style>
