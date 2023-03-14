<script setup lang="ts" generic="T">
	import { Movement } from "./Checkbox.vue";

	const props = withDefaults(defineProps<{
		/** 禁用。 */
		disabled?: boolean;
		/** 值。 */
		value?: string; // 稍后改为泛型 T。
		/** 当前绑定值。 */
		modelValue?: string; // 稍后改为泛型 T。
		/** 已勾选，单向绑定使用。 */
		checked?: boolean;
	}>(), {
		value: undefined,
		modelValue: undefined,
	});
	// TODO: [兰音] 随着 volar 的更新，似乎泛型功能被弄坏了。

	const emits = defineEmits<{
		(event: "update:modelValue", value: string): void; // 稍后改为泛型 T。
		(event: "change", arg: { value: string; checked: boolean }): void;
		(event: "move", value: Movement): void;
	}>();

	const radio = ref<HTMLInputElement>();
	const isChecked = computed(() => {
		if (props.modelValue && props.value)
			return props.modelValue === props.value;
		else return !!props.checked;
	});
	const isAnimating = ref(false);

	/**
	 * 数据改变事件。
	 */
	const onChange = () => {
		if (!radio.value) return;
		emits("update:modelValue", radio.value.value);
		emits("change", { value: radio.value.value, checked: true });
	};

	// 如果单选框勾选情况与 prop 不同，就强制使其相同。
	watch(() => radio.value?.checked, () => {
		if (!radio.value) return;
		if (isChecked.value !== radio.value.checked)
			radio.value.checked = isChecked.value;
	}, { immediate: true });

	watch(isChecked, async () => {
		isAnimating.value = true;
		await delay(400); // $duration-half 记得及时如果更新。
		isAnimating.value = false;
	});

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
	<kira-component
		:tabindex="isChecked && !disabled ? 0 : -1"
		class="radio-button"
		@click="onChange"
		@keydown="onKeydown"
	>
		<input
			ref="radio"
			type="radio"
			:value="props.value"
			:checked="isChecked"
			:disabled="disabled"
		/>
		<div class="radio-focus">
			<div class="radio-shadow">
				<div class="radio" :class="{ 'is-animating': isAnimating }"></div>
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
	$duration: $duration-half * 2;
	$component-class: ".radio-button";

	#{$component-class} {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		cursor: pointer;
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
		$transition: $fallback-transitions, all $ease-in-out-max $duration, background-color $ease-out-max $duration-half;
		position: relative;
		overflow: hidden;
		box-shadow: inset 0 0 0 $border-size c(icon-color);
		transition: $transition, box-shadow $ease-out-max $duration-half;
		animation: outer-border-change-back $duration-half $duration-half $ease-in-max reverse;

		&.is-animating {
			transition: $transition;
		}

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
			transition: $fallback-transitions, all $ease-in-out-max $duration;
			animation:
				inner-resize-back $duration-half $ease-out-max reverse,
				cut-out $duration-half step-start;
			content: "";
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
			box-shadow: inset 0 0 0 $border-size c(accent);
			animation: outer-border-change $duration-half $ease-in-max;

			&::before {
				@include short-transition;
				background-color: c(accent);
				opacity: 1;
				scale: 0.5;
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

	#{$component-class}:has(> input[disabled]) {
		pointer-events: none;

		.radio-shadow {
			box-shadow: none !important;
		}

		.radio {
			opacity: 0.4;
		}
	}

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

			@if $key != "" {
				to {
					scale: 0.5;
				}
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
