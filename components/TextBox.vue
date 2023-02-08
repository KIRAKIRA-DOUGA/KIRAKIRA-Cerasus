<script setup lang="ts">
	const props = defineProps<{
		small?: boolean;
		big?: boolean;
		placeholder: string;
	}>();
</script>

<template>
	<div class="textbox" :class="{ small, big }">
		<input type="text" :placeholder="placeholder" />
		<div class="bottom-stripe"></div>
	</div>
</template>

<style scoped lang="scss">
	$bottom-stripe-width: 2px;

	.textbox {
		@include radius-small;
		height: 36px;
		overflow: hidden;
		background-color: c(inner-color);
		border: 0;
		box-shadow: inset 0 4px 4px c(black, 4%);

		&.small {
			height: 28px;
		}

		&.big {
			height: 44px;
		}

		input {
			width: 100%;
			height: 100%;
			margin: 0;
			padding: 0;
			color: c(text-color);
			text-indent: 12px;
			background: transparent;
			border: 0;
			border-radius: 4px 0 0 4px;

			&.focus ~,
			&:focus-visible ~ {
				.bottom-stripe {
					background-color: c(accent);
				}
			}
		}
	}

	.bottom-stripe {
		width: 100%;
		height: $bottom-stripe-width;
		margin-top: -$bottom-stripe-width;
		background-color: transparent;

		.big & {
			background-color: c(icon-color-400);
		}
	}
</style>
