<script setup lang="ts" generic="T extends string">
	/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
	// BUG: 上面那个是 typescript-eslint 的 bug，如果去掉，则会触发 typescript 的报错。简而言之就是目前 typescript-eslint 和 typescript 在互相打架。

	const props = withDefaults(defineProps<{
		/** 禁用？ */
		disabled?: boolean;
		/** 值。 */
		value?: T;
		/** 复选状态，单向绑定使用。 */
		checkState?: CheckState;
		/** 详细信息。 */
		details?: Readable;
		/** 只读？ */
		readonly?: boolean;
	}>(), {
		checkState: "unchecked",
		value: undefined,
		details: undefined,
	});

	const emits = defineEmits<{
		change: [arg: { value: T; checkState: CheckState; checked: boolean }];
	}>();

	const model = defineModel<T[]>();
	const single = defineModel<boolean>("single", { default: undefined });
	const isChecked = computed(() => {
		// NOTE: 由于期望在点击半选状态后应该切换到选中状态，因此在二元的定义下半选应该归纳于未选中状态下。
		if (single.value !== undefined)
			return single.value;
		else if (model.value && props.value)
			return model.value.includes(props.value);
		else return props.checkState === "checked";
	});
	const isIndeterminate = computed(() => props.checkState === "indeterminate");
	const checkbox = ref<HTMLInputElement>();
	const hasLabel = hasContentInDefaultSlot() || !!props.details;

	/**
	 * 数据改变事件。
	 */
	function onChange() {
		if (!checkbox.value) return;
		const nextChecked = !isChecked.value;
		const nextState: CheckState = nextChecked ? "checked" : "unchecked";
		const modelValue = model.value ?? [];
		if (props.value)
			if (nextChecked) arrayPushUniquely(modelValue, props.value);
			else arrayRemoveAllItem(modelValue, props.value);
		model.value = modelValue;
		single.value = nextChecked;
		emits("change", { value: checkbox.value.value as T, checkState: nextState, checked: nextChecked });
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
	 * 当键盘按下方向键时移动到前一个或后一个复选框仅聚焦不选中。
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
	<Comp
		:tabindex="!disabled && !props.readonly ? 0 : -1"
		role="checkbox"
		:aria-checked="isChecked"
		@click="onChange"
		@keydown="onKeydown"
		@keyup.space.prevent="onChange"
	>
		<input
			ref="checkbox"
			type="checkbox"
			:value
			:checked="isChecked"
			:disabled
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
		<div v-if="hasLabel" class="content">
			<label><slot></slot></label>
			<label v-if="details || $slots.details" class="details"><slot name="details">{{ details }}</slot></label>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	$size: 18px;
	$roundness: 2px;
	$border-size: 2px;
	$checked-border-size: 10px;
	$symbol-line-thickness: 2px;
	$duration-half: 180ms;

	:comp {
		--color: #{c(accent)};
		display: flex;
		gap: 8px;
		align-items: center;
		cursor: pointer;

		// &:any-hover {
		// 	--color: #{c(accent-hover)};
		// }

		&:active {
			--color: #{c(accent-pressed)};
		}

		> .content > label.details {
			margin-top: 4px;
		}
	}

	input {
		display: none;
	}

	.check {
		@include square($size);
		position: relative;
		overflow: clip;
		border-radius: $roundness;
		box-shadow: inset 0 0 0 $border-size c(icon-color);
		animation: outer-border-change-back $duration-half $duration-half $ease-in-expo reverse backwards;

		@media (prefers-reduced-motion: reduce) {
			animation: outer-border-change-back 0s $ease-in-expo reverse backwards;
		}

		:comp:any-hover & {
			background-color: c(hover-overlay);
		}

		:comp:active & {
			background-color: c(hover-overlay);
		}
	}

	input:is(:checked, :indeterminate) + .check-focus {
		animation: pressing $duration-half $ease-in alternate 2;

		.check {
			box-shadow: inset 0 0 0 $checked-border-size c(color);
			animation: outer-border-change $duration-half $ease-in-expo backwards;
		}
	}

	input:checked:not(:indeterminate) + .check-focus {
		.check-symbol {
			width: 12px;
			height: 6px;
			translate: 0 -1px;
			opacity: 1;
			animation:
				check-symbol-resize $duration-half $duration-half $ease-out-max backwards,
				cut-in $duration-half step-start;

			@media (prefers-reduced-motion: reduce) {
				animation: check-symbol-resize 0s $ease-out-max backwards;
			}
		}
	}

	input:indeterminate + .check-focus {
		.indeterminate-symbol {
			width: 10px;
			opacity: 1;
			animation:
				indeterminate-symbol-resize $duration-half $duration-half $ease-out-max backwards,
				cut-in $duration-half step-start;

			@media (prefers-reduced-motion: reduce) {
				animation: indeterminate-symbol-resize 0s $ease-out-max backwards;
			}
		}
	}

	.symbol {
		@include square(0);
		@include absolute-center-sized;
		opacity: 0;
	}

	.check-symbol {
		rotate: -50grad;
		animation: check-symbol-resize-back $duration-half $ease-out-max reverse backwards;

		&::before,
		&::after {
			@extend %round-linecap;
			content: "";
			position: absolute;
			display: block;
		}

		&::before {
			left: 0;
			width: $symbol-line-thickness;
			height: 100%;
		}

		&::after {
			bottom: 0;
			width: 100%;
			height: $symbol-line-thickness;
		}
	}

	.indeterminate-symbol {
		@extend %round-linecap;
		height: $symbol-line-thickness;
		animation: indeterminate-symbol-resize-back $duration-half $ease-out-max reverse backwards;
	}

	%round-linecap {
		background-color: white;
		border-radius: calc($symbol-line-thickness / 2);
	}

	.check-focus > .check-shadow {
		@include square($size);
		border-radius: $roundness;

		input:is(:checked, :indeterminate) + & {
			@include button-shadow;

			:comp:any-hover & {
				@include button-shadow-hover;
			}

			:comp:active & {
				box-shadow: none !important;
			}
		}
	}

	.check-focus {
		@include square($size);
		@include circle;
		animation: pressing-back $duration-half $ease-in alternate 2;

		:comp:any-hover &,
		:comp:focus-visible & {
			@include large-shadow-unchecked-focus;
		}

		:comp:any-hover input:checked + &,
		:comp:any-hover input:indeterminate + &,
		:comp:focus-visible input:checked + &,
		:comp:focus-visible input:indeterminate + & {
			@include large-shadow-focus;
		}
	}

	:comp:has(> input[disabled]) {
		pointer-events: none;

		.check-shadow {
			box-shadow: none !important;
		}

		.check {
			opacity: 0.4;
		}
	}

	@each $key in "", "-back" {

		// 故意把动画写两遍，让 CSS 以为是两个动画。
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
				width: 12px;
				height: 6px;
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
				width: 10px;
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
</style>
