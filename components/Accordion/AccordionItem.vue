<docs>
	Build vertically collapsing accordions in combination with our Collapse JavaScript plugin.
</docs>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 标题。 */
		title: string | number;
		/** 是否展示而非折叠？ */
		modelValue?: boolean;
		/** 是否展示而非折叠？兼容使用。 */
		shown?: boolean;
	}>(), {
		modelValue: undefined,
	});

	const emits = defineEmits<{
		(event: "update:modelValue", shown: boolean): void;
	}>();

	const staticShown = ref(props.shown);

	const shown = computed({
		get: () => props.modelValue || staticShown.value,
		set: value => props.modelValue !== undefined ? emits("update:modelValue", value) : staticShown.value = value,
	});

	/**
	 * 切换展示与折叠状态。
	 */
	function toggle() {
		shown.value = !shown.value;
	}

	/**
	 * 在元素被插入到 DOM 之后的下一帧被调用。
	 * 用这个来开始进入动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onContentEnter(el: HTMLElement, done: () => void) {
		await animateHeight(el, null, { startHeight: 0, duration: 300 });
		done();
	}

	/**
	 * 在离开过渡开始时调用。
	 * 用这个来开始离开动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onContentLeave(el: HTMLElement, done: () => void) {
		await animateHeight(el, null, { endHeight: 0, duration: 300 });
		done();
	}
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

		> * {
			padding: 0.75rem 1rem;
			border-bottom: c(gray) 1px solid;
		}

		&:first-child > .header {
			border-radius: 6px 6px 0 0;
		}

		&:last-child > *:last-child {
			border-bottom: none;
			border-radius: 0 0 6px 6px;
		}
	}

	.header {
		@include flex-center;
		position: relative;
		justify-content: space-between;
		font-weight: normal;
		cursor: pointer;

		.nuxt-icon {
			font-size: 20px;
		}

		&:focus {
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

			.nuxt-icon {
				rotate: -180deg;
			}

			&:focus {
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
