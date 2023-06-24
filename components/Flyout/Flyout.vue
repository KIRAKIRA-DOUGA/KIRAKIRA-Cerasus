<script setup lang="ts">
	import { getPosition } from "plugins/vue/tooltip";

	const props = defineProps<{
		/** 是否**不**向加内边距？ */
		noPadding?: boolean;
	}>();

	const shown = ref(false);
	const flyout = refComp();
	const location = ref<TwoD>([0, 0]);
	const locationStyle = computed(() => {
		const l = location.value;
		return l[0] !== 0 || l[1] !== 0 ? { left: l[0] + "px", top: l[1] + "px" } : undefined;
	});
	const flyoutRect = ref<DOMRect>(undefined!);
	const placementForAnimation = ref<Placement>("bottom");
	const scopeId = useParentScopeId() ?? "";

	/**
	 * 隐藏浮窗。
	 */
	function hide() {
		shown.value = false;
	}

	/**
	 * 显示浮窗。
	 * @param target - 指定浮窗位置。
	 * @param placement - 浮窗出现方向。
	 * @param offset - 与目标元素距离偏移。
	 */
	async function show(target: MaybeRef<MouseEvent | PointerEvent | TwoD | HTMLElement | EventTarget | DOMRect | undefined | null>, placement?: Placement, offset?: number) {
		target = toValue(target);
		let targetRect: DOMRect | undefined;
		const _location = ((): TwoD | null => {
			if (target instanceof Array) return target;
			if (target instanceof Event)
				if (target.target instanceof Element) target = target.currentTarget!;
				else return [target.clientX, target.clientY];
			if (target instanceof Element || target instanceof DOMRect) {
				targetRect = target instanceof Element ? target.getBoundingClientRect() : target;
				return [targetRect.left, targetRect.bottom];
			}
			return null;
		})();
		if (!_location) return;
		else location.value = _location;
		shown.value = true;
		await nextTick();
		if (targetRect) {
			shown.value = false;
			const result = getPosition(targetRect, placement, offset, flyoutRect);
			location.value = result.position;
			placementForAnimation.value = result.placement;
			await nextTick();
			shown.value = true;
			await nextTick();
		}
		location.value = moveIntoPage(location, flyoutRect);
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
	async function onFlyoutEnter(el: Element, done: () => void) {
		await animateSize(el, null, {
			[["left", "right", "x"].includes(placementForAnimation.value) ? "startWidth" : "startHeight"]: 0,
			startReverseSlideIn: ["left", "top"].includes(placementForAnimation.value),
			duration: 500,
			getRect: flyoutRect,
		});
		done();
	}

	/**
	 * 在离开过渡开始时调用。
	 * 用这个来开始离开动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onFlyoutLeave(el: Element, done: () => void) {
		await animateSize(el, null, {
			[["left", "right", "x"].includes(placementForAnimation.value) ? "endWidth" : "endHeight"]: 0,
			endReverseSlideIn: ["left", "top"].includes(placementForAnimation.value),
			duration: 300,
		});
		done();
	}

	useEventListener("window", "pointerdown", e => {
		if (!flyout.value || !shown.value) return;
		const clickOutside = !isInPath(e, flyout);
		if (clickOutside) hide();
	});
</script>

<template>
	<ClientOnlyTeleport to="#popovers">
		<Transition :css="false" @enter="onFlyoutEnter" @leave="onFlyoutLeave">
			<Comp
				v-if="shown"
				ref="flyout"
				:[scopeId]="true"
				:class="{ padding: !noPadding }"
				:style="locationStyle"
			>
				<slot></slot>
			</Comp>
		</Transition>
	</ClientOnlyTeleport>
</template>

<style scoped lang="scss">
	$padding: 0.75rem 1rem;

	:comp {
		@include dropdown-flyouts;
		@include radius-large;
		overflow: hidden;
		background-color: c(acrylic-bg, 75%);
		transition: $fallback-transitions, left 0s, top 0s;
		
		&.padding {
			padding: $padding;
		}
	}
</style>
