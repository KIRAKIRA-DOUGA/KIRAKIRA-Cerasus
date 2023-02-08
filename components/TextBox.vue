<script setup lang="ts">
	const props = defineProps<{
		small?: boolean;
		big?: boolean;
		error?: boolean;
		placeholder: string;
		icon?: string;
	}>();
</script>

<template>
	<div class="textbox" :class="{ small, big, error, 'icon-enabled': icon }">
		<div class="wrapper">
			<NuxtIcon v-if="icon" :name="icon" class="front-icon" :tabindex="-1" />
			<input required type="text" :placeholder="placeholder" />
			<label v-if="big">{{ placeholder }}</label>
			<NuxtIcon v-if="error" name="error" class="error-icon" :tabindex="-1" />
		</div>
		<div v-if="big" class="big-stripe"></div>
		<div class="focus-stripe"></div>
	</div>
</template>

<style scoped lang="scss">
	$focus-stripe-height: 2px;
	$default-height: 36px;
	$small-height: 28px;
	$big-height: 44px;
	$front-indent: 12px;

	.textbox {
		@include radius-small;
		height: $default-height;
		overflow: hidden;
		background-color: c(inner-color);
		border: 0;
		box-shadow: inset 0 4px 4px c(black, 4%);

		&.small {
			height: $small-height;
		}

		&.big {
			height: $big-height;
		}

		&.error {
			.focus-stripe {
				background-color: c(red) !important;
				transform: scaleX(1);
			}

			.front-icon,
			label {
				color: c(red) !important;
			}
		}

		&:focus-within {
			.focus-stripe {
				background-color: c(accent);
				transform: scaleX(1);
			}

			label {
				color: c(accent);
				transform: scale(0.7) translateY(calc($big-height / -2 + 9px));

				// TODO: 判断input内容是否为空以控制label浮动
			}

			.front-icon {
				color: c(accent);
			}
		}
	}

	.big-stripe {
		width: 100%;
		height: $focus-stripe-height;
		margin-top: -$focus-stripe-height;
		background-color: c(icon-color-400);
	}

	.focus-stripe {
		width: 100%;
		height: $focus-stripe-height;
		margin-top: -$focus-stripe-height;
		background-color: c(accent);
		transform: scaleX(0);
	}

	.wrapper {
		display: flex;
		align-items: center;
		height: 100%;
	}

	label {
		position: absolute;
		display: block;
		width: 100%;
		margin-top: -3px;
		margin-left: $front-indent;
		color: c(icon-color);
		transform: scale(1) translateY(0);
		transform-origin: left;
		pointer-events: none;

		.front-icon ~ & {
			margin-left: calc($front-indent + 24px + 16px);
		}
	}

	input {
		display: block;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		color: c(text-color);
		text-indent: $front-indent;
		background: transparent;
		border: 0;
		border-radius: 4px 0 0 4px;
		appearance: none;

		::placeholder {
			color: c(icon-color);
		}

		&:valid ~ label {
			transform: scale(0.7) translateY(calc($big-height / -2 + 9px));
		}

		.front-icon ~ & {
			text-indent: calc($front-indent + 24px + 4px);

			.big & {
				text-indent: calc($front-indent + 24px + 16px);
			}
		}

		.big & {
			padding-top: calc($big-height / 2 - 11px);

			&::placeholder {
				color: transparent;
			}
		}
	}

	.front-icon {
		position: absolute;
		margin-left: 8px;
		color: c(icon-color);
		font-size: 24px;
		pointer-events: none;

		.big & {
			margin-left: 12px;
			text-indent: calc($front-indent + 24px + 16px);
		}
	}

	.error-icon {
		margin: 0 12px;
		color: c(red);
		font-size: 24px;
		pointer-events: none;
	}
</style>
