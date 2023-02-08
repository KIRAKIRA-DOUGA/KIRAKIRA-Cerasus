<script setup lang="ts">
	const props = withDefaults(defineProps<{
		illegal?: boolean;
		password?: boolean;
		showPassword?: boolean;
		placeholder: string;
		icon?: string;
		id?: string;
		size?: "small" | "normal" | "large";
		type?: string;
	}>(), {
		icon: undefined,
		size: "normal",
		type: "text",
	});
</script>

<template>
	<div class="textbox" :class="{ small: size === 'small', large: size === 'large', illegal, 'icon-enabled': icon }">
		<div class="wrapper">
			<NuxtIcon v-if="icon" :name="icon" class="before-icon" />
			<input required :type="type" :id="id" :placeholder="placeholder" />
			<label v-if="size === 'large'">{{ placeholder }}</label>
			<div v-ripple v-if="type === 'password'" class="after-icon-wrapper">
				<NuxtIcon name="visibility_off" class="after-icon" />
			</div>
			<div v-if="illegal" class="after-icon-wrapper">
				<NuxtIcon name="error" class="after-icon illegal-icon" />
			</div>
		</div>
		<div v-if="size === 'large'" class="large-stripe"></div>
		<div class="focus-stripe"></div>
	</div>
</template>

<style scoped lang="scss">
	$focus-stripe-height: 2px;
	$default-height: 36px;
	$small-height: 28px;
	$large-height: 44px;
	$front-indent: 12px;

	.textbox {
		@include radius-small;
		@include control-inner-shadow;
		height: $default-height;
		overflow: hidden;
		background-color: c(inner-color);
		border: 0;

		&.small {
			height: $small-height;
		}

		&.large {
			height: $large-height;
		}

		&.illegal {
			.focus-stripe {
				background-color: c(red) !important;
				scale: 1;
			}

			.before-icon,
			label {
				color: c(red) !important;
			}
		}

		&:focus-within {
			.focus-stripe {
				background-color: c(accent);
				scale: 1;
			}

			label {
				color: c(accent);
				scale: 0.7;
			}

			.before-icon {
				color: c(accent);
			}
		}
	}

	.large-stripe {
		width: 100%;
		height: $focus-stripe-height;
		margin-top: -$focus-stripe-height;
		background-color: c(icon-color-400);
		pointer-events: none;
	}

	.focus-stripe {
		width: 100%;
		height: $focus-stripe-height;
		margin-top: -$focus-stripe-height;
		background-color: c(accent);
		scale: 0 1;
		pointer-events: none;
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
		margin-left: $front-indent;
		color: c(icon-color);
		scale: 1;
		translate: 0;
		transform-origin: left;
		pointer-events: none;

		.before-icon ~ & {
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

		&::placeholder {
			color: c(icon-color);
		}

		&::-ms-reveal,
		&::-ms-clear {
			display: none;
		}

		&:valid ~ label,
		&:focus-visible ~ label {
			translate: 0 calc($large-height / -2 + 12px);
			scale: 0.7;
		}

		.before-icon ~ & {
			padding-left: calc($front-indent + 24px + 4px);
			text-indent: 0;

			.large & {
				padding-left: calc($front-indent + 24px + 16px);
			}
		}

		.large & {
			padding-top: calc($large-height / 2 - 11px);

			&::placeholder {
				color: transparent;
			}
		}
	}

	.before-icon {
		position: absolute;
		margin-left: 8px;
		color: c(icon-color);
		font-size: 24px;
		pointer-events: none;

		.large & {
			margin-left: 12px;
			text-indent: calc($front-indent + 24px + 16px);
		}
	}

	.after-icon {
		color: c(icon-color);
		font-size: 24px;
	}

	.illegal-icon {
		color: c(red);
	}

	.after-icon-wrapper {
		@include flex-center;
		@include square($default-height);
		@include circle;
		min-width: $default-height;

		.large & {
			@include square($large-height);
			min-width: $large-height;
		}

		.small & {
			@include square($small-height);
			min-width: $small-height;
		}

		&:nth-last-child {
			margin-right: 4px;
		}
	}
</style>
