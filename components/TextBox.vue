<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 当前输入是否不合法。 */
		illegal?: boolean;
		/** 内容占位符。 */
		placeholder?: string;
		/** 图标名称。 */
		icon?: string;
		/** 输入框尺寸。 */
		size?: "small" | "normal" | "large";
		/** 输入框类型。 */
		type?: string;
		/** 值。 */
		modelValue: string;
	}>(), {
		icon: undefined,
		size: "normal",
		type: "text",
		placeholder: "",
	});

	const emits = defineEmits<{
		(event: "update:modelValue", value: string): void;
	}>();

	/** 用户是否输入了值。 */
	const typed = computed(() => props.modelValue !== "");
	const value = computed({
		get: () => props.modelValue,
		set: value => emits("update:modelValue", value),
	});
	/** 是否显示密码。 */
	const showPassword = ref(false);
	const type = computed(() => {
		if (props.type !== "password") return props.type;
		return showPassword.value ? "text" : "password";
	});
</script>

<template>
	<kira-component
		class="text-box"
		:class="{
			small: size === 'small',
			large: size === 'large',
			illegal,
			'icon-enabled': icon,
		}"
	>
		<div class="wrapper">
			<NuxtIcon v-if="icon" :name="icon" class="before-icon" />
			<input v-model="value" :type="type" :placeholder="placeholder" :class="{ typed }" />
			<label v-if="size === 'large'">{{ placeholder }}</label>
			<div v-if="props.type === 'password'" v-ripple class="after-icon-wrapper password-button" @click="showPassword = !showPassword">
				<NuxtIcon :name="showPassword ? 'visibility' : 'visibility_off'" class="after-icon" />
			</div>
			<Transition name="scale">
				<div v-if="illegal" class="after-icon-wrapper">
					<NuxtIcon name="error" class="after-icon illegal-icon" />
				</div>
			</Transition>
		</div>
		<div v-if="size === 'large'" class="large-stripe"></div>
		<div class="focus-stripe"></div>
	</kira-component>
</template>

<style scoped lang="scss">
	$focus-stripe-height: 2px;
	$default-height: 36px;
	$small-height: 28px;
	$large-height: 44px;
	$front-indent: 12px;

	.text-box {
		@include radius-large;
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
			margin-left: $front-indent + 24px + 16px;
		}
	}

	input {
		@include radius-large;
		display: block;
		flex-grow: 1;
		height: 100%;
		margin: 0;
		padding: 0;
		color: c(text-color);
		font-size: inherit;
		text-indent: $front-indent;
		background: transparent;
		border: 0;
		appearance: none;

		&::placeholder {
			color: c(icon-color);
		}

		&::-ms-reveal,
		&::-ms-clear {
			display: none;
		}

		&.typed ~ label,
		&:focus-visible ~ label {
			translate: 0 calc($large-height / -2 + 12px);
			scale: 0.7;
		}

		.before-icon ~ & {
			padding-left: $front-indent + 24px + 4px;
			text-indent: 0;

			.large & {
				padding-left: $front-indent + 24px + 16px;
			}
		}

		.large & {
			padding-top: calc($large-height / 2 - 11px);

			&::placeholder {
				color: transparent;
			}
		}

		.illegal &::selection {
			background-color: c(red);
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
			text-indent: $front-indent + 24px + 16px;
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
		@include square(var(--size));
		@include radius-large(left); // TODO: 我还是感觉输入框右边的按钮在按下时有点格格不入。
		--size: #{$default-height};
		transform-origin: right center;

		.large & {
			--size: #{$large-height};
		}

		.small & {
			--size: #{$small-height};
		}

		&:nth-last-child {
			margin-right: 4px;
		}
	}

	.password-button {
		cursor: pointer;
	}

	.scale-enter-active {
		transition: scale 300ms $ease-out-max;
	}

	.scale-leave-active {
		transform: scale 300ms $ease-in-max;
	}

	.scale-enter-to,
	.scale-leave-from {
		scale: 1;
	}

	.scale-enter-from,
	.scale-leave-to {
		scale: 0;
	}
</style>
