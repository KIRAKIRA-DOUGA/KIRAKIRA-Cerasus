<script setup lang="ts" generic="T extends string">
	/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
	// BUG: 上面那个是 typescript-eslint 的 bug，如果去掉，则会触发 typescript 的报错。简而言之就是目前 typescript-eslint 和 typescript 在互相打架。

	const props = withDefaults(defineProps<{
		/** 禁用？ */
		disabled?: boolean;
		/** 值。 */
		value?: T;
		/** 已勾选？（单向绑定使用） */
		checked?: boolean;
		/** 详细信息。 */
		details?: Readable;
		/** 只读？ */
		readonly?: boolean;
	}>(), {
		value: undefined,
		details: undefined,
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
	const hasLabel = hasContentInDefaultSlot() || !!props.details;

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
		await delay(400); // $duration-half * 2 如果更新记得及时修改。
		isAnimating.value = false;
	});

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
		:tabindex="isChecked && !disabled && !props.readonly ? 0 : -1"
		:class="{ 'is-animating': isAnimating }"
		role="radio"
		:aria-checked="isChecked"
		@click="onChange"
		@keydown="onKeydown"
		@keyup.space.prevent="onChange"
	>
		<input
			ref="radio"
			type="radio"
			:value
			:checked="isChecked"
			:disabled
		/>
		<div class="radio-focus">
			<div class="radio-shadow">
				<div class="radio"></div>
			</div>
		</div>
		<div v-if="hasLabel" class="content">
			<label><slot></slot></label>
			<label v-if="details || $slots.details" class="details"><slot name="details">{{ details }}</slot></label>
		</div>
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
		gap: 8px;
		align-items: center;
		cursor: pointer;

		> .content > label.details {
			margin-top: 4px;
		}
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
		overflow: clip;
		box-shadow: inset 0 0 0 $border-size c(icon-color);
		transition: $transition, box-shadow $ease-out-max $duration-half;

		:comp.is-animating & {
			transition: $transition;
			animation: outer-border-change-back $duration-half $duration-half $ease-in-max reverse;
		}

		:comp:any-hover & {
			background-color: c(hover-overlay);
		}

		:comp:active & {
			background-color: c(hover-overlay);
		}

		&::before {
			@include square($size);
			@include circle;
			content: "";
			position: absolute;
			display: block;
			background-color: c(icon-color);
			opacity: 0;
			transition: $fallback-transitions, all $ease-in-out-max $duration;

			:comp.is-animating & {
				animation:
					inner-resize-back $duration-half $ease-out-max reverse,
					cut-out $duration-half step-start;
			}
		}
	}

	input:checked + .radio-focus {
		:comp.is-animating & {
			animation: pressing $duration-half $ease-in alternate 2;
		}

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

			:comp.is-animating & {
				animation: outer-border-change $duration-half $ease-in-max;
			}

			&::before {
				@include short-transition;
				background-color: c(accent);
				scale: 0.5;
				opacity: 1;

				:comp.is-animating & {
					animation:
						inner-resize $duration-half $duration-half $ease-out-max,
						cut-in $duration-half step-start;
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

		:comp.is-animating & {
			animation: pressing-back $duration-half $ease-in alternate 2;
		}

		:comp:any-hover &,
		:comp:focus-visible & {
			@include large-shadow-unchecked-focus;
		}

		:comp:any-hover input:checked + &,
		:comp:focus-visible input:checked + & {
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
</style>
