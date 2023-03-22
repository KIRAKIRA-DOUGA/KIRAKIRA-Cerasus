<docs>
	垂直折叠手风琴。
</docs>

<script setup lang="ts">
	import Accordion from "./Accordion.vue";

	const props = withDefaults(defineProps<{
		/** 标题。 */
		title: string | number;
		/** 是否展示而非折叠？ */
		modelValue?: boolean;
		/** 是否展示而非折叠？单向绑定使用。 */
		shown?: boolean;
	}>(), {
		modelValue: undefined,
	});

	const emits = defineEmits<{
		(event: "update:modelValue", shown: boolean): void;
	}>();

	const parent = useParent(Accordion);
	const staticShown = ref(props.shown);

	const shown = computed({
		get: () => props.modelValue || staticShown.value,
		set: value => props.modelValue !== undefined ? emits("update:modelValue", value) : staticShown.value = value,
	});

	/**
	 * 切换展示与折叠状态。
	 */
	function toggle() {
		parent?.exposed?.collaspeAll();
		shown.value = !shown.value;
	}

	/**
	 * 在元素被插入到 DOM 之后的下一帧被调用。
	 * 用这个来开始进入动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onContentEnter(el: Element, done: () => void) {
		await animateSize(el, null, { startHeight: 0, duration: 500, specified: "height" });
		done();
	}

	/**
	 * 在离开过渡开始时调用。
	 * 用这个来开始离开动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onContentLeave(el: Element, done: () => void) {
		await animateSize(el, null, { endHeight: 0, duration: 300, specified: "height" });
		done();
	}

	defineExpose({
		shown,
		toggle,
	});
</script>

<template>
	<kira-component class="accordion-item">
		<h3 v-ripple class="header" :class="{ shown }" :tabindex="0" @click="toggle">
			<div>{{ title }}</div>
			<NuxtIcon name="chevron_down" />
		</h3>
		<Transition :css="false" @enter="onContentEnter" @leave="onContentLeave">
			<div v-if="shown" class="content">
				<slot></slot>
			</div>
		</Transition>
	</kira-component>
</template>

<style scoped lang="scss">
	.accordion-item {
		@include radius-large;

		h3 {
			font-size: 14px;
		}

		> * {
			padding: 0.75rem 1rem;
			// border-bottom: c(gray) 1px solid; // 有一说一，边框线确实丑。
			transition: $fallback-transitions, padding $ease-out-smooth 500ms;
		}

		> *:not(:hover) {
			transition-duration: 1s;
		}

		&:first-child > .header {
			@include radius-large(top);
		}

		&:last-child > *:last-child {
			@include radius-large(bottom);
			border-bottom: none;
		}
	}

	.header {
		@include flex-center;
		position: relative;
		justify-content: space-between;
		font-weight: normal;
		cursor: pointer;

		.nuxt-icon {
			color: c(icon-color);
			font-size: 20px;
			transition: $fallback-transitions, all $ease-out-smooth 500ms;
		}

		&:focus-visible {
			@include button-shadow-unchecked-focus-only;
			z-index: 1;
		}

		&:hover {
			padding-left: 1.25rem;
			background-color: c(gray, 30%);
		}

		&.shown {
			color: c(accent);
			background-color: c(accent-10);

			.dark & {
				color: c(icon-color);
			}

			.nuxt-icon {
				color: inherit;
				rotate: 180deg;
			}

			&:focus-visible {
				@include button-shadow-focus-only;
			}

			&:hover {
				background-color: c(accent-10, 50%);
			}
		}
	}

	.content {
		overflow: hidden;
	}
</style>
