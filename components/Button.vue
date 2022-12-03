<script setup lang="ts">

</script>

<template>
	<button>
		<slot></slot>
	</button>
</template>

<style scoped lang="scss">
	@import "@/styles/theme.scss";

	button {
		appearance: none;
		background: $brand-pink-50;
		box-shadow: 0 4px 4px #f06e8e4d;
		border-radius: 4px;
		border: none;
		padding: 8px 16px;
		color: white;

		&:hover {
			background: $brand-pink-30;
			box-shadow: 0 9px 9px #f06e8e4d;
		}

		&:active {
			background: $brand-pink-70;
			transform: scale(calc(35 / 36));
			box-shadow: none !important;
		}

		&[disabled] {
			background: $brand-pink-20;
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
