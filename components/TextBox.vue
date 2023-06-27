<script setup lang="tsx">
	import { Transition } from "vue";
	import { Icon, SoftButton } from "#components";

	const props = withDefaults(defineProps<{
		/** 内容占位符。 */
		placeholder?: string;
		/** 图标名称。 */
		icon?: string;
		/** 输入框类型。 */
		type?: "date" | "datetime-local" | "email" | "month" | "number" | "password" | "search" | "tel" | "text" | "time" | "url" | "week";
		// 已弃用："datetime"。
		// 不可用："button" | "checkbox" | "radio" | "submit" | "reset" | "file" | "hidden" | "image" | "color" | "range"。
		/** 始终不显示清空按钮。 */
		hideClearAll?: boolean;
		/** 当输入内容不合法时，直接阻止用户进行输入。 */
		preventIfInvalid?: boolean;
		/** 表单自动填充特性提示，以空格分隔字符串。注意不是布尔类型。 */
		autoComplete?: string;
		/** 是否页面加载后自动聚焦？ */
		autoFocus?: boolean;
		/** 表单控件是否禁用？ */
		disabled?: boolean;
		/** 将控件联系到表单元素中。 */
		form?: string;
		/** 自动完成选项的 `<datalist>` 的 id 属性的值。 */
		list?: string;
		/** 最大值。 */
		max?: number;
		/** 最大字符数。 */
		maxLength?: number;
		/** 最小值。 */
		min?: number;
		/** 最小字符数。 */
		minLength?: number;
		/** 是否允许多个值？ */
		multiple?: boolean;
		/** 表单的控件名称，作为键值对的一部分与表单一同提交。 */
		name?: string;
		/** 为了使得 value 有效，必须符合的模式。 */
		pattern?: RegExp;
		/** 是否只读？ */
		readonly?: boolean;
		/** 是否必填？ */
		required?: boolean;
		/** 有效的增量值。 */
		step?: number;
		/** 输入法模式。 */
		inputMode?: "none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url";
	}>(), {
		icon: undefined,
		size: "normal",
		type: "text",
		placeholder: "",
		autoComplete: undefined,
		form: undefined,
		list: undefined,
		max: undefined,
		maxLength: undefined,
		min: undefined,
		minLength: undefined,
		name: undefined,
		pattern: undefined,
		step: undefined,
		inputMode: undefined,
	});

	const emits = defineEmits<{
		input: [e: InputEvent];
	}>();

	const value = defineModel<string>({ required: true });
	/** 是否显示密码。 */
	const showPassword = ref(false);
	const type = computed(() => {
		if (props.type !== "password") return props.type;
		return showPassword.value ? "text" : "password";
	});
	const input = ref<HTMLInputElement>();
	const showClearAll = computed(() => !props.hideClearAll && value.value !== "");
	const isInvalid = () => input.value?.validity.valid === false; // 注意不要写成 !valid，还需要排除 undefined 的情况。
	const invalid = ref(false); // 如果使用 computed，则只会调用一次。并不能监测 isInvalid 的变化，所以 computed 功能只是个废物？
	const isNumberMode = computed(() => props.min !== undefined || props.max !== undefined || ["decimal", "numberic", "tel"].includes(props.inputMode!));

	/**
	 * 手动在 `type="text"` 的情况下验证数字。
	 * @param e - 输入事件。
	 * @returns 验证结果。
	 */
	function examineNumber(e: InputEvent) {
		const input = e.target as HTMLInputElement;
		let result = input.value;
		let status: "valid" | "invalid" | "toomax" | "toomin" | "unstep" = "valid";
		if (isNumberMode.value) {
			let validChar = "0-9";
			if (props.min === undefined || props.min < 0) validChar += "-";
			if (!Number.isInteger(props.step) || props.inputMode === "decimal") validChar += ".";
			const pattern = new RegExp(`[^${validChar}]`, "g");
			value.value = value.value.replace(pattern, "");
			if (e.data && e.data.match(pattern)) status = "invalid";
			else if (input.value.match(pattern)) status = "invalid";
			const isEmpty = !input.value.trim().length;
			let num = parseFloat(input.value);
			if (isEmpty && props.required) num = 0;
			if (!Number.isFinite(num)) status = "invalid";
			if (props.min !== undefined && num < props.min) { num = props.min; status = "toomin"; }
			if (props.max !== undefined && num > props.max) { num = props.max; status = "toomax"; }
			if (props.min !== undefined && props.step !== undefined && !Number.isInteger((num - props.min) / props.step) && num !== props.max) { num = Math.floor((num - props.min) / props.step) * props.step; status = "unstep"; }
			if (isEmpty && !props.required) result = "";
			else result = String(num);
		}
		return { status, value: result };
	}

	/**
	 * 输入框文本输入和改变事件。
	 * @param _e - 输入事件。但是池沼 Vue 不会自动缩小类型，因此只能用普通事件代替。
	 */
	function onInput(_e: Event) {
		const e = _e as InputEvent;
		const input = e.target as HTMLInputElement;
		const caret = Caret.get(input);
		emits("input", e);
		const undo = () => {
			const length = input.value.length - value.value.length;
			input.value = value.value;
			if (length >= 0 && caret !== null) Caret.set(input, caret - length);
		};
		if (props.preventIfInvalid) {
			if (props.pattern) {
				const pattern = new RegExp(`^${props.pattern.source.replace(/\*$/, "+")}$`, props.pattern.flags);
				value.value = value.value.match(props.pattern)?.[0] ?? "";
				if (e.data && !e.data.match(pattern)) undo();
				else if (!input.value.match(pattern)) undo();
			}
			if (isNumberMode.value) {
				const result = examineNumber(e);
				if (result.status === "invalid") undo();
				else if (input.value !== result.value) input.value = result.value;
			}
		} else {
			void 0; // HACK: 禁止合并 else if，等留着以后添加其它情况。
			if (isNumberMode.value) {
				const { status } = examineNumber(e), value = input.value;
				const validationMessage = (() => {
					const input = document.createElement("input") as
						Override<HTMLInputElement, Partial<Record<"min" | "max" | "step", string | number>>>;
					input.type = "number";
					input.min = props.min;
					input.max = props.max;
					input.step = props.step;
					input.required = props.required;
					input.value = value;
					return input.validationMessage;
				})();
				input.setCustomValidity(status === "valid" ? "" : validationMessage || " ");
			}
		}
		invalid.value = isInvalid();
		value.value = input.value;
	}

	/**
	 * 清空文本。
	 */
	function clearAll() {
		value.value = "";
		input.value?.focus();
	}

	/**
	 * 切换显示密码。
	 */
	function toggleShowPassword() {
		showPassword.value = !showPassword.value;
		input.value?.focus();
	}

	/**
	 * 在元素被插入到 DOM 之后的下一帧被调用。
	 * 用这个来开始进入动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onAfterIconEnter(el: Element, done: () => void) {
		await animateSize(el, null, { startWidth: 0, duration: 300, startStyle: { scale: 0 }, specified: "width" });
		done();
	}

	/**
	 * 在离开过渡开始时调用。
	 * 用这个来开始离开动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onAfterIconLeave(el: Element, done: () => void) {
		await animateSize(el, null, { endWidth: 0, duration: 300, endStyle: { scale: 0 }, specified: "width" });
		done();
	}

	watch(value, async () => {
		await nextTick();
		invalid.value = isInvalid();
	});

	onMounted(() => {
		invalid.value = isInvalid();
	});

	const AfterIcon = (() => {
		interface Props {
			shown?: boolean;
			onClick?: (payload: MouseEvent) => void;
			icon?: string;
			animatedIcon?: string;
			animatedState?: string;
		}
		return (props: Props) => (
			<Transition css={false} onEnter={onAfterIconEnter} onLeave={onAfterIconLeave}>
				{
					props.shown &&
					<SoftButton
						icon={props.icon}
						animatedIcon={props.animatedIcon}
						animatedState={props.animatedState}
						nonclickable={!props.onClick}
						appearance="textbox-aftericon"
						onClick={props.onClick}
					/>
				}
			</Transition>
		);
	})();
</script>

<template>
	<Comp role="textbox">
		<div>
			<div class="wrapper">
				<Icon v-if="icon" :name="icon" class="before-icon" />
				<input
					ref="input"
					:value="value ?? ''"
					:type="type"
					:placeholder="placeholder.toString()"
					:autocomplete="autoComplete"
					:autofocus="autoFocus"
					:disabled="disabled"
					:form="form"
					:list="list"
					:max="max"
					:maxlength="maxLength"
					:min="min"
					:minlength="minLength"
					:multiple="multiple"
					:name="name"
					:pattern="pattern?.source"
					:readonly="readonly"
					:required="required"
					:step="step"
					:inputmode="inputMode"
					@input="onInput"
				/>
				<label>{{ placeholder }}</label>
				<Fragment class="after-icons">
					<AfterIcon
						:shown="showClearAll"
						icon="close"
						@click="clearAll"
					/>
					<AfterIcon
						:shown="props.type === 'password'"
						animatedIcon="visibility"
						:animatedState="showPassword ? 'visible' : 'invisible'"
						@click="toggleShowPassword"
					/>
					<AfterIcon
						v-tooltip:y="input?.validationMessage || undefined"
						:shown="invalid"
						icon="error"
					/>
				</Fragment>
			</div>
			<div class="stripe large-stripe"></div>
			<div class="stripe focus-stripe"></div>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	$focus-stripe-height: 2px;
	$normal-height: 36px;
	$small-height: 28px;
	$large-height: 44px;
	$start-indent: 12px;

	@layer props {
		:comp {
			/// 输入框尺寸，可选的值为：small | normal | large。
			--size: normal;
		}
	}

	@mixin is-large-size {
		@container style(--size: large) {
			@content;
		}
	}

	:comp > div {
		@include round-large;
		@include control-inner-shadow;
		--height: #{$normal-height};
		position: relative;
		height: $normal-height;
		overflow: hidden;
		background-color: c(inset-bg);
		border: 0;

		@container style(--size: small) {
			--height: #{$small-height};
			height: $small-height;
		}

		@container style(--size: large) {
			--height: #{$large-height};
			height: $large-height;
		}

		&:has(input:invalid) {
			.focus-stripe {
				background-color: c(red) !important;
				scale: 1;
			}

			.before-icon,
			label {
				color: c(red) !important;
			}
		}

		&:has(input:focus) {
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

	.stripe {
		position: absolute;
		z-index: 2;
		width: 100%;
		height: $focus-stripe-height;
		margin-top: -$focus-stripe-height;
		pointer-events: none;
	}

	.large-stripe {
		display: none;
		background-color: c(icon-color, 50%);

		@include is-large-size {
			display: block;
		}
	}

	.focus-stripe {
		background-color: c(accent);
		scale: 0 1;
	}

	.wrapper {
		display: flex;
		align-items: center;
		height: 100%;

		@include is-large-size {
			clip-path: inset(0 0 $focus-stripe-height)
		}
	}

	label {
		position: absolute;
		display: none;
		width: 100%;
		margin-left: $start-indent;
		color: c(icon-color);
		scale: 1;
		translate: 0;
		transform-origin: left;
		pointer-events: none;

		@include is-large-size {
			display: block;
		}

		.before-icon ~ & {
			margin-left: $start-indent + 24px + 16px;
		}
	}

	input {
		@include round-large;
		display: block;
		flex-grow: 1;
		width: 0;
		height: 100%;
		margin: 0;
		padding: 0;
		color: c(text-color);
		font-size: 14px;
		text-indent: $start-indent;
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

		&:not(:placeholder-shown) ~ label,
		&:focus ~ label {
			translate: 0 calc($large-height / -2 + 12px);
			scale: 0.7;
		}

		.before-icon ~ & {
			padding-left: $start-indent + 24px + 4px;
			text-indent: 0;

			@include is-large-size {
				padding-left: $start-indent + 24px + 16px;
			}
		}

		@include is-large-size {
			padding-top: calc($large-height / 2 - 11px);

			&::placeholder {
				color: transparent;
			}
		}

		&:invalid::selection {
			background-color: c(red); // WARN: Chromium 111 开始在 `::selection` 设定 `var()` 都会失效。包括 GitHub 和 Edge 的开发工具在内都有这种显示问题。https://bugs.chromium.org/p/chromium/issues/detail?id=1429546
		}
	}

	.before-icon {
		position: absolute;
		margin-left: 8px;
		color: c(icon-color);
		font-size: 24px;
		pointer-events: none;

		@include is-large-size {
			margin-left: 12px;
		}
	}

	.after-icons {
		@include flex-center;

		input:invalid ~ & :deep(.icon) {
			color: c(red) !important;
		}

		.soft-button {
			--wrapper-size: var(--height);
			--ripple-size: calc(var(--height) * 1.3);
		}
	}
</style>
