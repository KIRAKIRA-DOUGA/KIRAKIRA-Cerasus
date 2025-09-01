<script setup lang="ts">
	import { Contents } from "#components";
	import { Teleport } from "vue";
	import type { FlyoutModelNS } from "types/arguments";
	import { getLocation } from "components/Flyout/Flyout.vue";
	import { getPosition } from "plugins/vue/tooltip";

	const props = defineProps<{
		/** 是否避免在鼠标移开菜单时降低不透明度？ */
		noFade?: boolean;
	}>();

	const emits = defineEmits<{
		show: [];
		hide: [];
	}>();

	defineSlots<{
		default?: typeof MenuItem;
	}>();

	const model = defineModel<MenuModel | FlyoutModel>();
	/** 是否显示菜单？ */
	const shown = ref(false);
	const menu = ref<HTMLMenuElement>();
	const isContextMenu = ref(false);
	const location = ref<TwoD>([0, 0]);
	const size = ref<TwoD>();

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
	 * @param target - 如有鼠标事件则为上下文菜单，否则为弹出式菜单。
	 * @param placement - 上下文菜单出现方向。
	 * @param offset - 与目标元素距离偏移。
	 */
	async function show(target: FlyoutModelNS.Target, placement?: Placement | false, offset?: number) {
		target = toValue(target);
		isContextMenu.value = !!target;
		await nextTick();
		const [_location, targetRect] = getLocation(target);
		if (!_location) location.value = [0, 0];
		else if (placement === false && target instanceof MouseEvent)
			location.value = [target.clientX, target.clientY];
		else location.value = _location;
		shown.value = true;
		let retryCount = 10;
		while (!size.value && retryCount--)
			await nextTick();
		if (placement !== false && targetRect) {
			shown.value = false;
			const result = getPosition(targetRect, placement, offset, size);
			location.value = result.position;
			await nextTick();
			shown.value = true;
			await nextTick();
		}
		location.value = moveIntoPage(location, size);
		emits("show");
	}

	watch(model, e => {
		if (e === undefined) {
			hide(); // undefined 表示隐藏，null 表示占位菜单而非上下文菜单。
			return;
		}
		if (e instanceof Array) {
			const [target, placement, offset] = e;
			e = { target, placement, offset };
		}
		if (e === null || e instanceof MouseEvent)
			show(e, false);
		else
			show(e.target, e.placement, e.offset);
	}, { immediate: true, deep: true });

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
		await animateSize(el, null, { startHeight: 0, duration: 500, getSize: size, withoutAdjustPadding: "both" });
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
		size.value = undefined;
		done();
	}

	useEventListener("window", "pointerdown", e => {
		if (!menu.value || !shown.value) return;
		const clickOutside = !isInPath(e, menu);
		if (clickOutside) hide();
	});
</script>

<template>
	<component :is="isContextMenu ? Teleport : Contents" to="#popovers">
		<Transition :css="false" @enter="onMenuEnter" @leave="onMenuLeave">
			<menu
				v-if="shown"
				ref="menu"
				:class="{ context: isContextMenu, 'no-fade': noFade }"
				:style="getLocationStyle(location)"
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
		@include acrylic-background;
		top: 0;
		left: 0;
		z-index: 70;
		width: fit-content;
		margin: 0;
		padding: $menu-padding 0;
		overflow: clip;
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
			transition: $transition, box-shadow 1s, opacity 1s;

			&:not(.no-fade) {
				background-color: c(main-bg, 40%);
			}
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
