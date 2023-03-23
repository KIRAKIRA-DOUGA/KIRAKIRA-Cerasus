<script setup lang="tsx">
	import { Transition } from "vue";
	import { NuxtIcon } from "#components";

	const props = withDefaults(defineProps<{
		/** 当前输入是否非法。 */
		invalid?: boolean;
		/** 内容占位符。 */
		placeholder?: string;
		/** 图标名称。 */
		icon?: string;
		/** 输入框尺寸。 */
		size?: "small" | "normal" | "large";
		/** 输入框类型。 */
		type?: string;
		/** 值。 */
		modelValue: string;
		/** 始终不显示清空按钮。 */
		hideClearAll?: boolean;
	}>(), {
		icon: undefined,
		size: "normal",
		type: "text",
		placeholder: "",
	});

	const emits = defineEmits<{
		(event: "update:modelValue", value: string): void;
	}>();

	/** 用户是否输入了值。 */
	const typed = computed(() => props.modelValue !== "");
	const value = computed({
		get: () => props.modelValue,
		set: value => emits("update:modelValue", value),
	});
	/** 是否显示密码。 */
	const showPassword = ref(false);
	const type = computed(() => {
		if (props.type !== "password") return props.type;
		return showPassword.value ? "text" : "password";
	});
	const input = ref<HTMLInputElement>();
	const showClearAll = computed(() => !props.hideClearAll && value.value !== "");

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
		const styles = useCssModule("afterIcon");
		interface Props {
			shown?: boolean;
			onClick?: (payload: MouseEvent) => void;
			icon: string;
		}
		return (props: Props) => (
			<Transition css={false} onEnter={onAfterIconEnter} onLeave={onAfterIconLeave}>
				{
					props.shown && (
						<div class={[styles.wrapper, { [styles.clickable]: !!props.onClick }]} onClick={props.onClick}>
							<div v-ripple>
								<NuxtIcon name={props.icon} />
							</div>
						</div>
					)
				}
			</Transition>
		);
	})();
</script>

<template>
	<kira-component
		class="text-box"
		:class="{
			small: size === 'small',
			large: size === 'large',
			invalid,
			'icon-enabled': icon,
		}"
	>
		<div class="wrapper">
			<NuxtIcon v-if="icon" :name="icon" class="before-icon" />
			<input ref="input" v-model="value" :type="type" :placeholder="placeholder" :class="{ typed }" />
			<label v-if="size === 'large'">{{ placeholder }}</label>
			<Fragment class="after-icons">
				<AfterIcon :shown="showClearAll" icon="close" @click="clearAll" />
				<AfterIcon :shown="props.type === 'password'" :icon="showPassword ? 'visibility' : 'visibility_off'" @click="showPassword = !showPassword" />
				<AfterIcon :shown="invalid" icon="error" />
			</Fragment>
		</div>
		<div v-if="size === 'large'" class="stripe large-stripe"></div>
		<div class="stripe focus-stripe"></div>
	</kira-component>
</template>

<style scoped lang="scss">
	$focus-stripe-height: 2px;
	$default-height: 36px;
	$small-height: 28px;
	$large-height: 44px;
	$front-indent: 12px;

	.text-box {
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

		&.invalid {
			.focus-stripe {
				background-color: c(red) !important;
				scale: 1;
			}

			.before-icon,
			label {
				color: c(red) !important;
			}
		}

		&:focus-within {
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

		.before-icon ~ & {
			margin-left: $front-indent + 24px + 16px;
		}
	}

	input {
		@include radius-large;
		display: block;
		flex-grow: 1;
		height: 100%;
		margin: 0;
		padding: 0;
		color: c(text-color);
		font-size: inherit;
		text-indent: $front-indent;
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

		&.typed ~ label,
		&:focus-visible ~ label {
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

		.invalid &::selection {
			background-color: c(red); // BUG: Chromium 111 开始设置任何反选文本的颜色都会变成透明色。包括 GitHub 和 Edge 的开发工具在内都有这种显示问题。
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
			text-indent: $front-indent + 24px + 16px;
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

		.invalid & :deep(.nuxt-icon) {
			color: c(red) !important;
		}
	}
</style>

<style module="afterIcon" lang="scss">
	.wrapper {
		@include flex-center;
		@include square(var(--size));
		@include ripple-clickable-only-inside;

		> * {
			@include flex-center;
			@include square(var(--size));
			@include circle;
			flex-shrink: 0;

			> :global(.nuxt-icon) {
				color: c(icon-color);
				font-size: 24px;
			}

			&:focus-visible {
				@include button-shadow-focus;
			}

			&:is(:hover, :active, :has(* + *)):not(:focus-visible) {
				@include square(calc(var(--size) * 1.3));
			}

			&:is(:hover, :active) {
				background-color: c(hover-color);
			}
		}

		&.clickable {
			cursor: pointer;
		}

		&:not(.clickable) {
			pointer-events: none !important;
		}

		&:nth-last-child {
			margin-right: 4px;
		}
	}
</style>
