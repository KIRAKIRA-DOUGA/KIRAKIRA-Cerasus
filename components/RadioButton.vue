<script setup lang="ts">
	const _props = withDefaults(defineProps<{
		checked?: boolean;
		/** 禁用。 */
		disabled?: boolean;
		value: string;
		modelValue: string;
	}>(), {
		checked: false,
		disabled: false,
	});

	const emits = defineEmits<{
		(event: "update:modelValue", arg: Event): void;
	}>();
	// FIXME: 目前模型部分全是问题，赶快修。
</script>

<template>
	<div class="item" @click="e => emits('update:modelValue', e)">
		<input
			class="radio"
			type="radio"
			name="稍后更改模型"
			value="value"
			modelValue="modelValue"
			@change="e => emits('update:modelValue', e)"
		/>
		<slot></slot>
	</div>
</template>

<style scoped lang="scss">
	.item {
		display: flex;
		align-items: center;
	}

	$size: 20px;
	$white-size: 16px;
	$dot-size: 10px;
	$border-size: 2px;
	$duration-half: 250ms;

	.radio {
		--color: #{$light-mode-icon-color-400};

		appearance: none;
		margin: 0;
		margin-right: 0.5rem;
		width: $size;
		height: $size;
		background-color: transparent;
		box-shadow: inset 0 0 0 $border-size var(--color);
		border-radius: 100%;
		position: relative;
		animation:
			outer-border-change-back $duration-half $duration-half $ease-in-max reverse,
			pressing-back $duration-half $ease-in alternate 2;
		overflow: hidden;

		&::before {
			content: "";
			width: $dot-size;
			height: $dot-size;
			background-color: var(--color);
			display: block;
			border-radius: 100%;
			$margin: calc(($size - $dot-size) / 2);
			position: absolute;
			left: $margin;
			top: $margin;
			opacity: 0;
			animation:
				inner-resize-back $duration-half $ease-out-max reverse,
				cut-out $duration-half step-start;
		}

		&:checked {
			--color: #{$brand-pink-50};

			animation:
				outer-border-change $duration-half $ease-in-max,
				pressing $duration-half $ease-in alternate 2;

			&::before {
				opacity: 1;
				animation:
					inner-resize $duration-half $duration-half $ease-out-max,
					cut-in $duration-half step-start;
			}
		}
	}

	$animation-key: "", "-back"; // 故意把动画写两遍，让 CSS 以为是两个动画。

	@each $key in $animation-key {
		@keyframes outer-border-change#{$key} {
			from {
				box-shadow: inset 0 0 0 $border-size var(--color);
			}

			to {
				box-shadow: inset 0 0 0 calc($size / 2) var(--color);
			}
		}

		@keyframes inner-resize#{$key} {
			from {
				transform: scale(2);
			}

			to {
				transform: scale(1);
			}
		}

		@keyframes pressing {
			from {
				transform: scale(1);
			}

			to {
				transform: scale(calc(18 / 20));
			}
		}
	}

	@keyframes cut-in {
		from,
		to {
			opacity: 0;
		}
	}

	@keyframes cut-out {
		from,
		to {
			opacity: 1;
		}
	}
</style>
