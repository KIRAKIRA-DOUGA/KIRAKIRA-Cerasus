<script setup lang="ts">
	import { getPosition } from "plugins/vue/tooltip";
	import { FlyoutModelNS } from "types/arguments";

	const props = defineProps<{
		/** 是否**不**向加内边距？ */
		noPadding?: boolean;
	}>();

	const emits = defineEmits<{
		show: [];
		hide: [];
		beforeShow: [placement: Placement];
	}>();

	const model = defineModel<FlyoutModel>();
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
	const isWidthAnimation = computed(() => ["left", "right", "x"].includes(placementForAnimation.value));
	const isReverseSlide = computed(() => ["left", "top"].includes(placementForAnimation.value));
	/** 定义在关闭浮窗后的至少多少毫秒内不得再次打开浮窗，以免用户连续点击时浮窗有快速闪烁的动画。 */
	const QUICK_CLICK_DURATION = 200;
	const suppressShowing = ref(false);

	/**
	 * 隐藏浮窗。
	 */
	async function hide() {
		shown.value = false;
		model.value = undefined;
		suppressShowing.value = true;
		await delay(QUICK_CLICK_DURATION);
		emits("hide");
		suppressShowing.value = false;
	}

	/**
	 * 显示浮窗。
	 * @param target - 指定浮窗位置。
	 * @param placement - 浮窗出现方向。
	 * @param offset - 与目标元素距离偏移。
	 */
	async function show(target: FlyoutModelNS.Target, placement?: Placement, offset?: number) {
		if (suppressShowing.value) return;
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
			emits("beforeShow", result.placement);
			await nextTick();
			shown.value = true;
			await nextTick();
		}
		location.value = moveIntoPage(location, flyoutRect);
		emits("show");
	}

	watch(model, e => {
		if (suppressShowing.value) {
			model.value = undefined;
			return;
		}
		if (e === undefined) return hide();
		if (e instanceof Array) {
			const [target, placement, offset] = e;
			e = { target, placement, offset };
		}
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
	async function onFlyoutEnter(el: Element, done: () => void) {
		await animateSize(el, null, {
			[isWidthAnimation.value ? "startWidth" : "startHeight"]: 0,
			startReverseSlideIn: isReverseSlide.value,
			duration: 500,
			getRect: flyoutRect,
			startChildTranslate: isReverseSlide.value ? undefined : placementForAnimation.value === "bottom" ? "0 -100%" : "-100% 0",
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
			[isWidthAnimation.value ? "endWidth" : "endHeight"]: 0,
			endReverseSlideIn: isReverseSlide.value,
			duration: 300,
			endChildTranslate: isReverseSlide.value ? undefined : placementForAnimation.value === "bottom" ? "0 -100%" : "-100% 0",
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
				:[scopeId]="''"
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
		max-width: 100dvw;
		overflow: hidden;
		background-color: c(acrylic-bg, 75%);
		transition: $fallback-transitions, left 0s, top 0s;

		&.padding {
			padding: $padding;
		}
		
		> :deep(*) {
			max-width: calc(100dvw - list.nth($padding, 2) * 2);
		}
	}
</style>
