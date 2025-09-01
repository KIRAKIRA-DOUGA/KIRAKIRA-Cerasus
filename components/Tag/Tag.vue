<script setup lang="ts">
	import { LocaleLink } from "#components";

	const props = withDefaults(defineProps<{
		/** 勾选，单向绑定使用。 */
		checked?: boolean;
		/** 是否为原名标签？ */
		original?: boolean;
		/** 禁用？ */
		disabled?: boolean;
		/** 链接。 */
		link?: string;
		/** URL Search Params. */
		query?: UrlQueryType;
		/** 当标签为文本输入模式时，显示的文本占位符。 */
		placeholder?: string;
	}>(), {
		link: undefined,
		query: undefined,
		placeholder: "",
	});

	const emits = defineEmits<{
		change: [value: string];
	}>();

	const model = defineModel<boolean>({ default: undefined });
	const input = defineModel<string>("input");
	const editable = computed(() => input.value !== undefined);
	const isChecked = computed(() => withOneWayProp(model, () => props.checked).value);

	/**
	 * 键盘在标签输入框中输入文本时的更新事件。
	 * @param e - 普通事件。
	 */
	function onInput(e: Event) {
		const div = e.target as HTMLDivElement;
		input.value = div.innerText;
	}

	/**
	 * 标签输入框中文本输入完成后的更新事件。
	 * @param e - 普通事件。
	 */
	function onChange(e: Event) {
		const div = e.target as HTMLDivElement;
		div.blur();
		Caret.clear();
		const value = div.innerText;
		emits("change", value);
	}
</script>

<template>
	<component
		:is="link !== undefined ? LocaleLink : 'span'"
		v-ripple
		class="tag lite"
		:class="{ checked: isChecked, editable }"
		:to="link"
		:query
		draggable="false"
		tabindex="0"
		role="checkbox"
		:aria-checked="isChecked"
		aria-label="tag"
		@click="model != null && (model = !model)"
	>
		<div class="circle"></div>
		<div class="content">
			<Transition>
				<div v-if="isChecked" class="check-wrapper">
					<slot name="checked-icon"><Icon name="check" class="check" /></slot>
				</div>
			</Transition>
			<Transition>
				<div v-if="original" class="original-wrapper">
					<slot name="original-icon"><Icon name="star" class="original" /></slot>
				</div>
			</Transition>
			<div
				v-if="editable"
				class="text-box"
				:data-placeholder="placeholder"
				:contenteditable="true"
				@input="onInput"
				@change="onChange"
				@blur="onChange"
				@keydown.enter.prevent
				@keyup.enter.prevent="onChange"
			>{{ input }}</div>
			<div v-else><slot></slot></div>
		</div>
	</component>
</template>

<style scoped lang="scss">
	$check-icon-size: 19px;
	$duration: 400ms;
	$padding: 6px 12px;

	.tag {
		@include oval;
		@include flex-center;
		position: relative;
		display: inline-flex;
		padding: $padding;
		overflow: clip;
		color: inherit;
		font-size: inherit;
		line-height: 1rem;
		background-color: c(text-color, 5%);
		cursor: pointer;

		&:hover {
			@include button-shadow-unchecked-hover;
		}

		&:focus-within {
			@include button-shadow-unchecked-focus;
		}

		&:hover:focus-within {
			@include button-shadow-unchecked-hover-focus;
		}

		&.checked {
			padding: 6px 16px 6px 12px;
			color: white;
			background-color: c(accent);

			&:hover {
				@include button-shadow-hover;
			}

			&:focus-within {
				@include button-shadow-focus;
			}

			&:hover:focus-within {
				@include button-shadow-hover-focus;
			}

			&,
			* {
				transition: $fallback-transitions, all $ease-out-back $duration, color 50ms;
			}
		}

		&,
		* {
			transition: $fallback-transitions, all $ease-out-expo $duration;
		}

		.tags & {
			&,
			* {
				transition-timing-function: $ease-out-expo;
			}
		}

		&.editable {
			cursor: text;
		}
	}

	.check-wrapper, .original-wrapper {
		display: inline;
		width: $check-icon-size;
		height: $check-icon-size;
		overflow: clip;

		&.v-enter-from,
		&.v-leave-to {
			width: 0;
			scale: 0;
		}

		.check, .original {
			color: white;
			font-size: $check-icon-size;
		}
	}

	.content {
		position: relative;
		z-index: 2;
		display: inline-flex;
		gap: 0;
		align-items: center;
		min-height: $check-icon-size;

		.checked & {
			gap: 8px;
		}
	}

	.circle {
		@include square(10px);
		@include circle;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		display: none;
		background-color: c(accent);
	}

	.text-box {
		margin: list-negative($padding);
		padding: $padding;

		&:empty::before {
			color: c(placeholder-color);
			content: attr(data-placeholder);
		}

		.tag.checked &::selection {
			color: c(accent);
			background-color: c(accented-selection);
		}
	}
</style>
