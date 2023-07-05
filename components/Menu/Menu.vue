<script setup lang="ts">
	import { ClientOnlyTeleport, Fragment } from "#components";

	const emits = defineEmits<{
		show: [];
		hide: [];
	}>();

	defineSlots<{
		default?: typeof MenuItem;
	}>();

	const model = defineModel<MenuModel>();
	/** 是否显示菜单？ */
	const shown = ref(false);
	const menu = ref<HTMLMenuElement>();
	const isContextMenu = ref(false);
	const location = ref<TwoD>([0, 0]);
	const locationStyle = computed(() => {
		const l = location.value;
		return l[0] !== 0 || l[1] !== 0 ? { left: l[0] + "px", top: l[1] + "px" } : undefined;
	});
	const size = ref<TwoD>([0, 0]);

	/**
	 * 隐藏菜单。
	 */
	function hide() {
		shown.value = false;
		model.value = undefined;
		emits("hide");
	}

	/**
	 * 显示菜单。
	 * @param e - 如有鼠标事件则为上下文菜单，否则为弹出式菜单。
	 */
	async function show(e?: MenuModel) {
		const context = isContextMenu.value = !!e;
		await nextTick();
		if (!context) location.value = [0, 0];
		else location.value = [e.clientX, e.clientY];
		shown.value = true;
		await nextTick();
		location.value = moveIntoPage(location, size);
		emits("show");
	}

	watch(model, e => {
		if (e === undefined) hide(); // undefined 表示隐藏，null 表示占位菜单而非上下文菜单。
		else show(e);
	}, { immediate: true });

	defineExpose({
		hide, show,
	});

	/**
	 * 在元素被插入到 DOM 之后的下一帧被调用。
	 * 用这个来开始进入动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onMenuEnter(el: Element, done: () => void) {
		await animateSize(el, null, { startHeight: 0, duration: 500, getSize: size.value, withoutAdjustPadding: "both" });
		done();
	}

	/**
	 * 在离开过渡开始时调用。
	 * 用这个来开始离开动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onMenuLeave(el: Element, done: () => void) {
		await animateSize(el, null, { endHeight: 0, duration: 300 });
		done();
	}

	useEventListener("window", "pointerdown", e => {
		if (!menu.value || !shown.value) return;
		const clickOutside = !isInPath(e, menu);
		if (clickOutside) hide();
	});
</script>

<template>
	<component :is="isContextMenu ? ClientOnlyTeleport : Fragment" to="#popovers">
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
	$transition: $fallback-transitions, grid-template-rows $ease-out-smooth 500ms;

	menu {
		@include round-large;
		@include dropdown-flyouts;
		top: 0;
		left: 0;
		z-index: 70;
		width: fit-content;
		margin: 0;
		padding: $menu-padding 0;
		overflow: hidden;
		background-color: c(main-bg, 50%);
		transition: $transition;

		&.context {
			position: fixed;
		}

		:slotted(hr) {
			margin: 6px 0;
			border: none;
			border-top: c(divider, 10%) 1px solid;
		}

		&:not(:hover, :active) {
			@include dropdown-flyouts-unhover;
			background-color: c(main-bg, 40%);
			transition: $transition, box-shadow 1s, opacity 1s;
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
