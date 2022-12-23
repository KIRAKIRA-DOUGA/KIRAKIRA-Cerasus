<script setup lang="ts" generic="T">
	const props = withDefaults(defineProps<{
		/** 禁用。 */
		disabled?: boolean;
		/** 值。 */
		value: T;
		/** 当前绑定值。 */
		modelValue: T;
	}>(), {
		disabled: false,
	});

	type Movement = "previous" | "next";

	const emits = defineEmits<{
		(event: "update:modelValue", value: T): void;
		(event: "move", value: Movement): void;
	}>();

	const radio = ref<HTMLInputElement>();
	const isChecked = computed(() => props.modelValue === props.value);
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
	<div class="label" :tabindex="isChecked ? 0 : -1" @click="onChange" @keydown="onKeydown">
		<input ref="radio" type="radio" :checked="isChecked" :value="props.value" />
		<div class="radio-focus">
			<div class="radio-shadow">
				<div class="radio"></div>
			</div>
		</div>
		<slot></slot>
	</div>
</template>

<style scoped lang="scss">
	.label {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	$size: 20px;
	$white-size: 16px;
	$dot-size: 10px;
	$border-size: 2px;
	$duration-half: 200ms;

	.radio-shadow {
		width: $size;
		height: $size;
		border-radius: 100%;
	}

	.radio {
		position: relative;
		width: $size;
		height: $size;
		margin: 0;
		overflow: hidden;
		background-color: c(main-bg);
		border-radius: 100%;
		box-shadow: inset 0 0 0 $border-size c(icon-color);
		transition: all $ease-in-out-max calc($duration-half * 2);
		animation: outer-border-change-back $duration-half $duration-half $ease-in-max reverse;
		appearance: none;

		&::before {
			position: absolute;
			display: block;
			width: $size;
			height: $size;
			background-color: c(icon-color);
			border-radius: 100%;
			transform: scale(0.5);
			opacity: 0;
			transition: all $ease-in-out-max calc($duration-half * 2);
			animation:
				inner-resize-back $duration-half $ease-out-max reverse,
				cut-out $duration-half step-start;
			content: "";
		}
	}

	input:checked + .radio-focus {
		animation: pressing $duration-half $ease-in alternate 2;

		.radio-shadow {
			box-shadow: 0 4px 4px c(accent, 30%);
			transition: 0.2s;

			.label:hover & {
				box-shadow: 0 9px 9px c(accent, 30%); // TODO: 关于 box-shadow 我打算改成类似 figma 那样使用全局变量统一管辖。
				// 毕竟单选框的 box-shadow 样式明显可以和 button 复用。
			}

			.label:active & {
				box-shadow: none !important;
			}
		}

		.radio {
			box-shadow: inset 0 0 0 2px c(accent);
			animation: outer-border-change $duration-half $ease-in-max;

			&::before {
				background-color: c(accent);
				opacity: 1;
				animation:
					inner-resize $duration-half $duration-half $ease-out-max,
					cut-in $duration-half step-start;

				.label:active & {
					transform: scale(0.4);
					transition: 0.2s;
				}
			}
		}
	}

	.radio-focus {
		width: $size;
		height: $size;
		border-radius: 100%;
		animation: pressing-back $duration-half $ease-in alternate 2;

		.label:focus & {
			box-shadow: 0 1px 6px c(icon-color, 50%), 0 0 0 10px c(gray-2, 50%);
		}

		.label:focus input:checked + & {
			box-shadow: 0 1px 6px c(accent, 0%), 0 0 0 10px c(accent-focus, 50%);
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

	// TODO: 接下来请你编写 disabled 样式和 unchecked 的 hover、pressed、disabled 样式。

	$animation-key: "", "-back";

	@each $key in $animation-key { // 故意把动画写两遍，让 CSS 以为是两个动画。
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
				transform: scale(1);
			}

			to {
				transform: scale(0.5);
			}
		}

		@keyframes pressing#{$key} {
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
