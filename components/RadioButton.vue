<script setup lang="ts" generic="T extends string">
	const props = withDefaults(defineProps<{
		/** 禁用。 */
		disabled?: boolean;
		/** 值。 */
		value?: T;
		/** 已勾选，单向绑定使用。 */
		checked?: boolean;
	}>(), {
		value: undefined,
	});

	const emits = defineEmits<{
		change: [arg: { value: T; checked: boolean }];
		move: [value: Movement];
	}>();

	const model = defineModel<T>();
	const isChecked = computed(() => {
		if (model.value && props.value)
			return model.value === props.value;
		else return !!props.checked;
	});
	const radio = ref<HTMLInputElement>();
	const isAnimating = ref(false);

	/**
	 * 数据改变事件。
	 */
	function onChange() {
		if (!radio.value) return;
		model.value = radio.value.value as T;
		emits("change", { value: radio.value.value as T, checked: true });
	}

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
	 * 当键盘松开空格键时相当于点击复选框。
	 * @param e - 键盘事件。
	 */
	function onKeyUp(e: KeyboardEvent) {
		if (e.code === "Space") {
			e.preventDefault();
			onChange();
		}
	}

	/**
	 * 当键盘按下方向键时移动到前一个或后一个单选框聚焦并选中。
	 * 当键盘按下空格键时不要下滑页面。
	 * @param e - 键盘事件。
	 */
	function onKeydown(e: KeyboardEvent) {
		if (e.code === "Space") {
			stopEvent(e);
			return;
		}
		const movePrev = e.code === "ArrowUp" || e.code === "ArrowLeft";
		const moveNext = e.code === "ArrowDown" || e.code === "ArrowRight";
		if (!movePrev && !moveNext) return;
		stopEvent(e);
		emits("move", moveNext ? "next" : "previous");
		let thisComponent = e.target as HTMLElement;
		let thatComponent: HTMLElement, radio: HTMLInputElement;
		while (true) {
			const _thatComponent = thisComponent[movePrev ? "previousElementSibling" : "nextElementSibling"];
			if (!(_thatComponent instanceof HTMLElement)) return;
			const _radio = _thatComponent.querySelector<HTMLInputElement>(":scope > input[type=radio]");
			if (!(_thatComponent.classList.contains("radio-button") && _radio)) return;
			thisComponent = _thatComponent;
			if (_radio.disabled || !_radio.getAttribute("value")) continue;
			thatComponent = _thatComponent;
			radio = _radio;
			break;
		}
		thatComponent.focus();
		model.value = radio.value as T;
		emits("change", { value: radio.value as T, checked: true });
	}
</script>

<template>
	<Comp
		:tabindex="isChecked && !disabled ? 0 : -1"
		role="radio"
		:aria-checked="isChecked"
		@click="onChange"
		@keydown="onKeydown"
		@keyup="onKeyUp"
	>
		<input
			ref="radio"
			type="radio"
			:value="value"
			:checked="isChecked"
			:disabled="disabled"
		/>
		<div class="radio-focus">
			<div class="radio-shadow">
				<div class="radio" :class="{ 'is-animating': isAnimating }"></div>
			</div>
		</div>
		<label><slot></slot></label>
	</Comp>
</template>

<style scoped lang="scss">
	$size: 20px;
	$white-size: 16px;
	$dot-size: 10px;
	$border-size: 2px;
	$duration-half: 200ms;
	$duration: $duration-half * 2;

	:comp {
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

		:comp:any-hover & {
			background-color: c(hover-film);
		}

		:comp:active & {
			background-color: c(hover-film);
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

			:comp:any-hover & {
				@include button-shadow-hover;
			}

			:comp:active & {
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

				:comp:any-hover & {
					scale: 0.6;
				}

				:comp:active & {
					scale: 0.4;
				}
			}
		}
	}

	.radio-focus {
		@include square($size);
		@include circle;
		animation: pressing-back $duration-half $ease-in alternate 2;

		:comp:focus & {
			@include large-shadow-unchecked-focus;
		}

		:comp:focus input:checked + & {
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

	:comp:has(> input[disabled]) {
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
