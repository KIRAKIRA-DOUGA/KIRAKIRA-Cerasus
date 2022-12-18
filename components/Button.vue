<script setup lang="ts">
	const emits = defineEmits<{
		(event: "click"): void;
	}>();
</script>

<template>
	<button v-ripple @click="emits('click')">
		<slot></slot>
	</button>
</template>

<style scoped lang="scss">
	button {
		padding: 8px 16px;
		color: white;
		background: c(accent);
		border: none;
		border-radius: 4px;
		box-shadow: 0 4px 4px c(accent, 30%);
		transition: all $ease-out-back 250ms;
		appearance: none;

		&:hover {
			background: c(accent-hover);
			box-shadow: 0 9px 9px c(accent, 30%);
		}

		&:active {
			background: c(accent);
			box-shadow: none !important;
			transform: scale(calc(35 / 36));
		}

		&[disabled] {
			background: c(accent-disabled);
			box-shadow: none !important;
			pointer-events: none;
		}

		&:focus {
			box-shadow: 0 4px 4px c(accent, 30%), 0 0 0 3px c(accent-focus, 50%);
		}

		&:hover:focus {
			box-shadow: 0 9px 9px c(accent, 30%), 0 0 0 3px c(accent-focus, 50%);
		}
	}
</style>
