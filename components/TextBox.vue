<script setup lang="tsx">
	import { Transition } from "vue";
	import { Icon, SoftButton } from "#components";

	const props = withDefaults(defineProps<{
		/** 内容占位符。 */
		placeholder?: string;
		/** 图标名称。 */
		icon?: string;
		/** 输入框尺寸。 */
		size?: "small" | "normal" | "large";
		/** 输入框类型。 */
		type?: "date" | "datetime-local" | "email" | "month" | "number" | "password" | "search" | "tel" | "text" | "time" | "url" | "week";
		// 已弃用："datetime"。
		// 不可用："button" | "checkbox" | "radio" | "submit" | "reset" | "file" | "hidden" | "image" | "color" | "range"。
		/** 始终不显示清空按钮。 */
		hideClearAll?: boolean;
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
		pattern?: string | Regexp;
		/** 是否只读？ */
		readonly?: boolean;
		/** 是否必填？ */
		required?: boolean;
		/** 有效的增量值。 */
		step?: number;
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
	});

	const value = defineModel<string>({ required: true });
	/** 是否显示密码。 */
	const showPassword = ref(false);
	const type = computed(() => {
		if (props.type !== "password") return props.type;
		return showPassword.value ? "text" : "password";
	});
	const input = ref<HTMLInputElement>();
	const showClearAll = computed(() => !props.hideClearAll && value.value !== "");
	const invalid = computed(() => input.value && !input.value.validity.valid);
	const patternString = computed(() => !props.pattern ? undefined : typeof props.pattern === "string" ? props.pattern : props.pattern.source);

	/**
	 * 清空文本。
	 */
	function clearAll() {
		value.value = "";
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

	const AfterIcon = (() => {
		interface Props {
			shown?: boolean;
			onClick?: (payload: MouseEvent) => void;
			icon: string;
		}
		return (props: Props) => (
			<Transition css={false} onEnter={onAfterIconEnter} onLeave={onAfterIconLeave}>
				{
					props.shown &&
					<SoftButton icon={props.icon} nonclickable={!props.onClick} appearance="textbox-aftericon" onClick={props.onClick} />
				}
			</Transition>
		);
	})();
</script>

<template>
	<Comp
		:class="{
			small: size === 'small',
			large: size === 'large',
			'icon-enabled': icon,
		}"
	>
		<div class="wrapper">
			<Icon v-if="icon" :name="icon" class="before-icon" />
			<input
				ref="input"
				v-model="value"
				:type="type"
				:placeholder="placeholder"
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
				:pattern="patternString"
				:readonly="readonly"
				:required="required"
				:step="step"
			/>
			<label v-if="size === 'large'">{{ placeholder }}</label>
			<Fragment class="after-icons">
				<AfterIcon :shown="showClearAll" icon="close" @click="clearAll" />
				<AfterIcon :shown="props.type === 'password'" :icon="showPassword ? 'visibility' : 'visibility_off'" @click="showPassword = !showPassword" />
				<AfterIcon :shown="invalid" icon="error" />
			</Fragment>
		</div>
		<div v-if="size === 'large'" class="stripe large-stripe"></div>
		<div class="stripe focus-stripe"></div>
	</Comp>
</template>

<style scoped lang="scss">
	$focus-stripe-height: 2px;
	$default-height: 36px;
	$small-height: 28px;
	$large-height: 44px;
	$front-indent: 12px;

	:comp {
		@include radius-large;
		@include control-inner-shadow;
		position: relative;
		height: $default-height;
		overflow: hidden;
		background-color: c(inset-bg);
		border: 0;

		&.small {
			height: $small-height;
		}

		&.large {
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
		background-color: c(icon-color, 50%);
	}

	.focus-stripe {
		background-color: c(accent);
		scale: 0 1;
	}

	.wrapper {
		display: flex;
		align-items: center;
		height: 100%;

		.large & {
			clip-path: polygon(0% 0%, 100% 0%, 100% calc(100% - $focus-stripe-height), 0% calc(100% - $focus-stripe-height));
		}
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

		/* @include tablet { // 增加移动端文字大小防止 Safari 放大。
			font-size: 16px;
		} */

		.before-icon ~ & {
			margin-left: $front-indent + 24px + 16px;
		}
	}

	input {
		@include radius-large;
		display: block;
		flex-grow: 1;
		width: 0;
		height: 100%;
		margin: 0;
		padding: 0;
		color: c(text-color);
		font-size: 14px;
		text-indent: $front-indent;
		background: transparent;
		border: 0;
		appearance: none;

		/* @include tablet { // 增加移动端文字大小防止 Safari 放大。
			font-size: 16px;
		} */

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

		.large & {
			margin-left: 12px;
		}
	}

	.after-icons {
		@include flex-center;
		--size: #{$default-height};

		.large & {
			--size: #{$large-height};
		}

		.small & {
			--size: #{$small-height};
		}

		input:invalid ~ & :deep(.icon) {
			color: c(red) !important;
		}

		.soft-button {
			--wrapper-size: var(--size);
			--ripple-size: calc(var(--size) * 1.3);
		}
	}
</style>
