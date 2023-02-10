<script setup lang="ts">
	/** 是否显示菜单？ */
	const shown = ref(false);

	const hide = () => (shown.value = false);
	const show = () => (shown.value = true);

	defineExpose({
		hide, show,
	});

	// watch(shown, shown => console.log("menu shown:", shown));

	/**
	 * 在元素被插入到 DOM 之后的下一帧被调用。
	 * 用这个来开始进入动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onMenuEnter(el: HTMLElement, done: () => void) {
		await animateHeight(el, null, { startHeight: 0 });
		done();
	}

	/**
	 * 在离开过渡开始时调用。
	 * 用这个来开始离开动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onMenuLeave(el: HTMLElement, done: () => void) {
		await animateHeight(el, null, { endHeight: 0 });
		done();
	}
</script>

<template>
	<Transition name="menu" @enter="onMenuEnter" @leave="onMenuLeave">
		<menu v-if="shown">
			<slot></slot>
		</menu>
	</Transition>
</template>

<style scoped lang="scss">
	menu {
		@include radius-large;
		@include flex-block;
		@include dropdown-flyouts;
		width: fit-content;
		padding: $menu-padding 0;
		overflow: hidden;

		:deep(hr) {
			margin: 6px 0;
			border: none;
			border-top: c(divider, 10%) 1px solid;
		}

		&:not(:hover) {
			opacity: 0.75;
			transition-duration: 1s;
		}

		:deep(.menu-item) {
			animation: move-right 250ms calc(var(--i) * 50ms) $ease-out-max backwards;
		}

		&.menu-leave-to {
			@include no-vertical-spacing;
		}
	}

	@keyframes move-right {
		from {
			translate: -15px;
			opacity: 0;
		}
	}
</style>
