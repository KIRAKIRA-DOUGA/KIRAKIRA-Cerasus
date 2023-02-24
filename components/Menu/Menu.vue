<script setup lang="ts">
	import { ClientOnlyTeleport, Fragment } from "#components";

	/** 是否显示菜单？ */
	const shown = ref(false);
	const menu = ref<HTMLMenuElement>();
	const isContextMenu = ref(false);
	const location = ref<[number, number]>([0, 0]);
	const locationStyle = computed(() => {
		const l = location.value;
		return l[0] !== 0 && l[1] !== 0 ? { left: l[0] + "px", top: l[1] + "px" } : undefined;
	});
	const size = ref<[number, number]>([0, 0]);

	/**
	 * 隐藏菜单。
	 */
	function hide() {
		shown.value = false;
	}

	/**
	 * 显示菜单。
	 * @param e - 如有鼠标事件则为上下文菜单，否则为弹出式菜单。
	 */
	async function show(e?: MouseEvent) {
		const context = isContextMenu.value = !!e;
		await nextTick();
		if (!context) location.value = [0, 0];
		else location.value = [e.clientX, e.clientY];
		shown.value = true;
		await nextTick();
		const windowSize = [window.innerWidth, window.innerHeight];
		for (let i = 0; i < 2; i++)
			if (location.value[i] + size.value[i] > windowSize[i])
				location.value[i] = windowSize[i] - size.value[i];
	}

	defineExpose({
		hide, show,
	});

	/**
	 * 在元素被插入到 DOM 之后的下一帧被调用。
	 * 用这个来开始进入动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onMenuEnter(el: HTMLElement, done: () => void) {
		await animateHeight(el, null, { startHeight: 0, duration: 500, getSize: r => size.value = r });
		done();
	}

	/**
	 * 在离开过渡开始时调用。
	 * 用这个来开始离开动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onMenuLeave(el: HTMLElement, done: () => void) {
		await animateHeight(el, null, { endHeight: 0, duration: 300 });
		done();
	}

	/**
	 * 点击空白处关闭菜单。
	 * @param e - 鼠标事件。
	 */
	function clickOutsideToCloseMenu(e: MouseEvent) {
		if (!menu.value || !shown.value) return;
		const clickOutside = !isInPath(e, menu.value);
		if (clickOutside) hide();
	}

	onMounted(() => {
		window.addEventListener("pointerdown", clickOutsideToCloseMenu);
	});

	onUnmounted(() => {
		window.removeEventListener("pointerdown", clickOutsideToCloseMenu);
	});
</script>

<template>
	<component :is="isContextMenu ? ClientOnlyTeleport : Fragment" to="body">
		<Transition :css="false" @enter="onMenuEnter" @leave="onMenuLeave">
			<menu
				v-if="shown"
				ref="menu"
				:class="{ context: isContextMenu }"
				:style="locationStyle"
				@contextmenu.prevent
			>
				<slot></slot>
			</menu>
		</Transition>
	</component>
</template>

<style scoped lang="scss">
	menu {
		@include radius-large;
		@include flex-block;
		@include dropdown-flyouts;
		top: 0;
		left: 0;
		z-index: 60;
		width: fit-content;
		margin: 0;
		padding: $menu-padding 0;
		overflow: hidden;
		background-color: c(main-bg, 50%);

		&.context {
			position: fixed;
		}

		:slotted(hr) {
			margin: 6px 0;
			border: none;
			border-top: c(divider, 10%) 1px solid;
		}

		&:not(:hover) {
			opacity: 0.8;
			transition-duration: 1s;
		}

		:slotted(.menu-item) {
			animation: float-right 500ms calc(var(--i) * 40ms) $ease-out-smooth backwards;
		}
	}

	@keyframes float-right {
		from {
			translate: -15px;
			opacity: 0;
		}
	}
</style>
