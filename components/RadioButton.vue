<script setup lang="ts" generic="T">
	const props = withDefaults(defineProps<{
		/** 禁用。 */
		disabled?: boolean;
		/** 值。 */
		value?: T;
		/** 当前绑定值。 */
		modelValue?: T;
		/** 打开，兼容使用。 */
		on?: boolean;
	}>(), {
		disabled: false,
		value: undefined,
		modelValue: undefined,
	});

	type Movement = "previous" | "next";

	const emits = defineEmits<{
		(event: "update:modelValue", value: T): void;
		(event: "move", value: Movement): void;
	}>();

	const radio = ref<HTMLInputElement>();
	const isChecked = computed(() => {
		if (props.modelValue && props.value)
			return props.modelValue === props.value;
		else return !!props.on;
	});
	/**
	 * 数据改变事件。
	 */
	const onChange = () => {
		if (!radio.value) return;
		emits("update:modelValue", radio.value.value as T);
	};

	// 如果单选框勾选情况与 prop 不同，就强制使其相同。
	watch(() => radio.value?.checked, () => {
		if (radio.value && isChecked.value !== radio.value.checked)
			radio.value.checked = isChecked.value;
	}, { immediate: true });

	/**
	 * 键盘按下方向键时移动到前一个或后一个单选框事件。
	 * @param e - 键盘事件。
	 */
	function onKeydown(e: KeyboardEvent) {
		const movePrev = e.key === "ArrowUp" || e.key === "ArrowLeft";
		const moveNext = e.key === "ArrowDown" || e.key === "ArrowRight";
		if (!movePrev && !moveNext) return;
		e.preventDefault();
		emits("move", moveNext ? "next" : "previous");
	}
</script>

<template>
	<kira-component :tabindex="isChecked ? 0 : -1" class="radio-button" :class="{ disabled }" @click="onChange" @keydown="onKeydown">
		<input ref="radio" type="radio" :checked="isChecked" :value="props.value" :disabled="disabled" />
		<div class="radio-focus">
			<div class="radio-shadow">
				<div class="radio"></div>
			</div>
		</div>
		<slot></slot>
	</kira-component>
</template>

<style scoped lang="scss">
	$size: 20px;
	$white-size: 16px;
	$dot-size: 10px;
	$border-size: 2px;
	$duration-half: 200ms;
	$component-class: ".radio-button";

	#{$component-class} {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	@mixin short-transition {
		transition: $fallback-transitions;
	}

	.radio-shadow {
		@include square($size);
		@include circle;
	}

	.radio {
		@include square($size);
		@include circle;
		position: relative;
		margin: 0;
		overflow: hidden;
		box-shadow: inset 0 0 0 $border-size c(icon-color);
		transition: $fallback-transitions, all $ease-in-out-max calc($duration-half * 2), background-color $ease-out-max 200ms;
		animation: outer-border-change-back $duration-half $duration-half $ease-in-max reverse;
		appearance: none;

		#{$component-class}:is(:hover, :active) & {
			background-color: c(gray, 50%);
		}

		&::before {
			@include square($size);
			@include circle;
			position: absolute;
			display: block;
			background-color: c(icon-color);
			opacity: 0;
			transition: $fallback-transitions, all $ease-in-out-max calc($duration-half * 2);
			animation:
				inner-resize-back $duration-half $ease-out-max reverse,
				cut-out $duration-half step-start;
			content: "";
			scale: 0.5;
		}
	}

	input:checked + .radio-focus {
		animation: pressing $duration-half $ease-in alternate 2;

		.radio-shadow {
			@include button-shadow;
			@include short-transition;

			#{$component-class}:hover & {
				@include button-shadow-hover;
			}

			#{$component-class}:active & {
				box-shadow: none !important;
			}
		}

		.radio {
			box-shadow: inset 0 0 0 2px c(accent);
			animation: outer-border-change $duration-half $ease-in-max;

			&::before {
				@include short-transition;
				background-color: c(accent);
				opacity: 1;
				animation:
					inner-resize $duration-half $duration-half $ease-out-max,
					cut-in $duration-half step-start;

				#{$component-class}:hover & {
					scale: 0.6;
				}

				#{$component-class}:active & {
					scale: 0.4;
				}
			}
		}
	}

	.radio-focus {
		@include square($size);
		@include circle;
		animation: pressing-back $duration-half $ease-in alternate 2;

		#{$component-class}:focus & {
			@include large-shadow-unchecked-focus;
		}

		#{$component-class}:focus input:checked + & {
			@include large-shadow-focus;
		}
	}

	input {
		display: none;
	}

	.no-animation {
		&,
		* {
			&,
			&::before,
			&::after {
				animation: none !important;
			}
		}
	}

	.disabled {
		filter: grayscale(1);
		pointer-events: none;
	}

	// TODO: 接下来请你编写 disabled 样式和 unchecked 的 hover、pressed、disabled 样式。

	@each $key in "", "-back" { // 故意把动画写两遍，让 CSS 以为是两个动画。
		@keyframes outer-border-change#{$key} {
			from {
				box-shadow: inset 0 0 0 $border-size c(icon-color);
			}

			to {
				box-shadow: inset 0 0 0 calc($size / 2) c(accent);
			}
		}

		@keyframes inner-resize#{$key} {
			from {
				scale: 1;
			}

			to {
				scale: 0.5;
			}
		}

		@keyframes pressing#{$key} {
			from {
				scale: 1;
			}

			to {
				scale: calc(18 / 20);
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
