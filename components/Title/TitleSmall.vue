<script setup lang="ts">
	const props = defineProps<{
		solid?: boolean;
	}>();
</script>

<template>
	<div class="sub" :class="{ stroked: !solid }">
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

		&.stroked {
			background-clip: text;
			opacity: 0.4;
			-webkit-text-stroke-width: 1.5px;
			-webkit-text-fill-color: transparent;
		}
	}
</style>
