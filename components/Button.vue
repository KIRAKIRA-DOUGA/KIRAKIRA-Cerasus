<script setup lang="ts">
	const _emits = defineEmits<{
		(event: "click"): void;
	}>();
</script>

<template>
	<button v-ripple @click="$emit('click')">
		<slot></slot>
	</button>
</template>

<style scoped lang="scss">
	button {
		appearance: none;
		background: var(--accent);
		box-shadow: 0 4px 4px #f06e8e4d;
		border-radius: 4px;
		border: none;
		padding: 8px 16px;
		color: white;
		transition: all $ease-out-back 250ms;

		&:hover {
			background: var(--accent-hover);
			box-shadow: 0 9px 9px #f06e8e4d;
		}

		&:active {
			background: var(--accent);
			transform: scale(calc(35 / 36));
			box-shadow: none !important;
		}

		&[disabled] {
			background: var(--accent-disabled);
			box-shadow: none !important;
		}

		&:focus {
			box-shadow: 0 4px 4px #f06e8e4d, 0 0 0 3px #f8afb880;
		}

		&:hover:focus {
			box-shadow: 0 9px 9px #f06e8e4d, 0 0 0 3px #f8afb880;
		}
	}
</style>
