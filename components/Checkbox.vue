<script lang="ts">
	export type Movement = "previous" | "next";
	export type CheckState = "unchecked" | "indeterminate" | "checked";
</script>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 禁用。 */
		disabled?: boolean;
		/** 值。 */
		value?: string; // 稍后改为泛型 T。
		/** 当前绑定值。 */
		modelValue?: string[]; // 稍后改为泛型 T[]。
		/** 复选状态，单向绑定使用。 */
		checkState?: CheckState;
	}>(), {
		checkState: "unchecked",
		value: undefined,
		modelValue: undefined,
	});

	const emits = defineEmits<{
		(event: "update:modelValue", value: string[]): void; // 稍后改为泛型 T[]。
		(event: "change", arg: { value: string; checkState: CheckState; checked: boolean }): void;
	}>();

	const checkbox = ref<HTMLInputElement>();
	const isChecked = computed(() => {
		// 注意：由于期望在点击半选状态后应该切换到选中状态，因此在二元的定义下半选应该归纳于未选中状态下。
		if (props.modelValue && props.value)
			return props.modelValue.includes(props.value);
		else return props.checkState === "checked";
	});
	const isIndeterminate = computed(() => props.checkState === "indeterminate");

	/**
	 * 数据改变事件。
	 */
	function onChange() {
		if (!checkbox.value) return;
		const nextChecked = !isChecked.value;
		const nextState: CheckState = nextChecked ? "checked" : "unchecked";
		const modelValue = props.modelValue ?? [];
		if (props.value)
			if (nextChecked) modelValue.push(props.value);
			else arrayRemoveItem(modelValue, props.value);
		emits("update:modelValue", modelValue); // 稍后改为泛型 T。
		emits("change", { value: checkbox.value.value, checkState: nextState, checked: nextChecked });
	}

	// 如果复选框勾选情况与 prop 不同，就强制使其相同。
	watch([() => checkbox.value?.checked, () => checkbox.value?.indeterminate], () => {
		if (!checkbox.value) return;
		if (isChecked.value !== checkbox.value.checked)
			checkbox.value.checked = isChecked.value;
		if (isIndeterminate.value !== checkbox.value.indeterminate)
			checkbox.value.indeterminate = isIndeterminate.value;
	}, { immediate: true });

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
	 * 当键盘按下空格键时不要下滑页面。
	 * @param e - 键盘事件。
	 */
	function onKeyDown(e: KeyboardEvent) {
		if (e.code === "Space") {
			e.preventDefault();
			return;
		}
		const movePrev = e.code === "ArrowUp" || e.code === "ArrowLeft";
		const moveNext = e.code === "ArrowDown" || e.code === "ArrowRight";
		if (!movePrev && !moveNext) return;
		e.preventDefault();
		let thisComponent = e.target as HTMLElement;
		let thatComponent: HTMLElement;
		while (true) {
			const _thatComponent = thisComponent[movePrev ? "previousElementSibling" : "nextElementSibling"];
			if (!(_thatComponent instanceof HTMLElement)) return;
			const _checkbox = _thatComponent.querySelector<HTMLInputElement>(":scope > input[type=checkbox]");
			if (!(_thatComponent.classList.contains("checkbox") && _checkbox)) return;
			thisComponent = _thatComponent;
			if (_checkbox.disabled) continue;
			thatComponent = _thatComponent;
			break;
		}
		thatComponent.focus();
	}
</script>

<template>
	<kira-component
		:tabindex="!disabled ? 0 : -1"
		class="checkbox"
		@click="onChange"
		@keydown="onKeyDown"
		@keyup="onKeyUp"
	>
		<input
			ref="checkbox"
			type="checkbox"
			:value="value"
			:checked="isChecked"
			:disabled="disabled"
			:indeterminate="isIndeterminate"
		/>
		<div class="check-focus">
			<div class="check-shadow">
				<div class="check">
					<div class="symbol check-symbol"></div>
					<div class="symbol indeterminate-symbol"></div>
				</div>
			</div>
		</div>
		<slot></slot>
	</kira-component>
</template>

<style scoped lang="scss">
	$size: 18px;
	$roundness: 2px;
	$border-size: 2px;
	$checked-border-size: 10px;
	$symbol-line-thickness: 2px;
	$symbol-line-thickness-half: calc($symbol-line-thickness / 2);
	$duration-half: 200ms;
	$component-class: ".checkbox";

	#{$component-class} {
		--color: #{c(accent)};
		display: flex;
		gap: 0.5rem;
		align-items: center;
		cursor: pointer;

		&:hover {
			--color: #{c(accent-hover)};
		}

		&:active {
			--color: #{c(accent-pressed)};
		}
	}

	input {
		display: none;
	}

	.check {
		@include square($size);
		position: relative;
		overflow: hidden;
		border-radius: $roundness;
		box-shadow: inset 0 0 0 $border-size c(icon-color);
		animation: outer-border-change-back $duration-half $duration-half $ease-in-max reverse backwards;

		#{$component-class}:is(:hover, :active) & {
			background-color: c(gray, 50%);
		}
	}

	input:is(:checked, :indeterminate) + .check-focus {
		animation: pressing $duration-half $ease-in alternate 2;

		.check {
			box-shadow: inset 0 0 0 $checked-border-size c(color);
			animation: outer-border-change $duration-half $ease-in-max backwards;
		}
	}

	input:checked:not(:indeterminate) + .check-focus {
		.check-symbol {
			width: 11px;
			height: 5px;
			opacity: 1;
			animation:
				check-symbol-resize $duration-half $duration-half $ease-out-max backwards,
				cut-in $duration-half step-start;
			translate: 0 -1px;
		}
	}

	input:indeterminate + .check-focus {
		.indeterminate-symbol {
			width: 8px;
			opacity: 1;
			animation:
				indeterminate-symbol-resize $duration-half $duration-half $ease-out-max backwards,
				cut-in $duration-half step-start;
		}
	}

	.symbol {
		@include square(0);
		@include absolute-center-widthful;
		border: 0 solid white;
		opacity: 0;
	}

	.check-symbol {
		border-width: 0 0 $symbol-line-thickness $symbol-line-thickness;
		animation: check-symbol-resize-back $duration-half $ease-out-max reverse backwards;
		rotate: -45deg;
	}

	.indeterminate-symbol {
		height: 0;
		border-width: $symbol-line-thickness-half 0;
		animation: indeterminate-symbol-resize-back $duration-half $ease-out-max reverse backwards;
	}

	.check-focus > .check-shadow {
		@include square($size);
		border-radius: $roundness;

		input:is(:checked, :indeterminate) + & {
			@include button-shadow;

			#{$component-class}:hover & {
				@include button-shadow-hover;
			}

			#{$component-class}:active & {
				box-shadow: none !important;
			}
		}
	}

	.check-focus {
		@include square($size);
		@include circle;
		// border-radius: $roundness;
		animation: pressing-back $duration-half $ease-in alternate 2;

		#{$component-class}:focus & {
			@include large-shadow-unchecked-focus;
		}

		#{$component-class}.checked:focus & {
			@include large-shadow-focus;
		}
	}

	#{$component-class}:has(> input[disabled]) {
		pointer-events: none;

		.check-shadow {
			box-shadow: none !important;
		}

		.check {
			opacity: 0.4;
		}
	}

	@each $key in "", "-back" { // 故意把动画写两遍，让 CSS 以为是两个动画。
		@keyframes outer-border-change#{$key} {
			from {
				box-shadow: inset 0 0 0 $border-size c(icon-color);
			}

			to {
				box-shadow: inset 0 0 0 $checked-border-size c(color);
			}
		}

		@keyframes check-symbol-resize#{$key} {
			from {
				@include square(0);
				translate: 0;
				opacity: 1;
			}

			to {
				width: 11px;
				height: 5px;
				translate: 0 -1px;
				opacity: 1;
			}
		}

		@keyframes indeterminate-symbol-resize#{$key} {
			from {
				width: 0;
				opacity: 1;
			}

			to {
				width: 8px;
				opacity: 1;
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
