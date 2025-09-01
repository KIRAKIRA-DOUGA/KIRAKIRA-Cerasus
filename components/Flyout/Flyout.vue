<script lang="ts">
	/**
	 * 获取位置和矩形。
	 * @param target - 目标元素。
	 * @returns 位置和矩形。
	 */
	export function getLocation(target: FlyoutModelNS.Target): [location: TwoD | null, targetRect: DOMRect | undefined] {
		if (target instanceof Array) return [target, undefined];
		if (target instanceof Event)
			if (target.target instanceof Element) target = target.currentTarget!;
			else return [[target.clientX, target.clientY], undefined];
		if (target instanceof Element || target instanceof DOMRect) {
			const targetRect = target instanceof Element ? target.getBoundingClientRect() : target;
			return [[targetRect.left, targetRect.bottom], targetRect];
		}
		return [null, undefined];
	}
</script>

<script setup lang="ts">
	import { getPosition } from "plugins/vue/tooltip";
	import type { FlyoutModelNS } from "types/arguments";

	const props = withDefaults(defineProps<{
		/** 是否**不**向加内边距？ */
		noPadding?: boolean;
		/** 是否在按下 `Esc` 按键时**不要**关闭浮窗？ */
		doNotCloseOnEsc?: boolean;
		/** 是否**不** `overflow: clip;`？ */
		noClipping?: boolean;
		/** 在点击元素外围时，如其包含以下类名的元素，则不会触发自动关闭。 */
		ignoreOutsideElementClasses?: string[];
	}>(), {
		ignoreOutsideElementClasses: () => [],
	});

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
	const flyoutRect = ref<DOMRect>();
	const placementForAnimation = ref<Placement>("bottom");
	const scopeId = useParentScopeId() ?? "";
	const isWidthAnimation = computed(() => ["left", "right", "x"].includes(placementForAnimation.value));
	const isReverseSlide = computed(() => ["left", "top"].includes(placementForAnimation.value));
	/** 定义在关闭浮窗后的至少多少毫秒内不得再次打开浮窗，以免用户连续点击时浮窗有快速闪烁的动画。 */
	const QUICK_CLICK_DURATION = 200;
	const suppressShowing = ref(false);
	const clipping = ref(!props.noClipping); // 修正在要求 noClipping 的同时开/关浮窗动画时显示错误的问题。
	const moving = ref(false);

	useEventListener("window", "keydown", e => {
		if (!props.doNotCloseOnEsc && e.code === "Escape")
			hide();
	});

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
		const [_location, targetRect] = getLocation(target);
		if (!_location) return;
		else location.value = _location;
		shown.value = true;
		let retryCount = 10;
		while (!flyoutRect.value && retryCount--)
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

	/**
	 * 移动浮窗到页面内部。
	 * @param target - 指定浮窗位置。
	 * @param placement - 浮窗出现方向。
	 * @param offset - 与目标元素距离偏移。
	 * @param getNewPosition - 获取改变后的新位置和偏移量。
	 */
	async function _moveIntoPage(target: FlyoutModelNS.Target, placement?: Placement, offset?: number, getNewPosition?: (placement: Placement, offset: number) => void) {
		target = toValue(target);
		const [_location, targetRect] = getLocation(target);
		if (!_location || !flyout.value) return;
		moving.value = true;
		const flyoutRect = flyout.value.getBoundingClientRect();
		if (targetRect) {
			const result = getPosition(targetRect, placement, offset, flyoutRect);
			getNewPosition?.(result.placement, result.offset);
			location.value = result.position;
			placementForAnimation.value = result.placement;
			await nextTick();
		}
		location.value = moveIntoPage(location, flyoutRect);
		await delay(600);
		moving.value = false;
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
		hide, show, moveIntoPage: _moveIntoPage, placementForAnimation,
	});

	/**
	 * 在元素被插入到 DOM 之后的下一帧被调用。
	 * 用这个来开始进入动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onFlyoutEnter(el: Element, done: () => void) {
		clipping.value = true;
		await animateSize(el, null, {
			[isWidthAnimation.value ? "startWidth" : "startHeight"]: 0,
			startReverseSlideIn: isReverseSlide.value,
			duration: 500,
			getRect: flyoutRect,
			startChildTranslate: isReverseSlide.value ? undefined : placementForAnimation.value === "bottom" ? "0 -100%" : "-100% 0",
		});
		done();
		clipping.value = !props.noClipping;
	}

	/**
	 * 在离开过渡开始时调用。
	 * 用这个来开始离开动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onFlyoutLeave(el: Element, done: () => void) {
		clipping.value = true;
		await animateSize(el, null, {
			[isWidthAnimation.value ? "endWidth" : "endHeight"]: 0,
			endReverseSlideIn: isReverseSlide.value,
			duration: 300,
			endChildTranslate: isReverseSlide.value ? undefined : placementForAnimation.value === "bottom" ? "0 -100%" : "-100% 0",
		});
		flyoutRect.value = undefined;
		done();
	}

	useEventListener("window", "pointerdown", e => {
		if (!flyout.value || !shown.value) return;
		let clickOutside = !isInPath(e, flyout);
		if (clickOutside) clickOutside = props.ignoreOutsideElementClasses.every(klass => !isInPath(e, klass));
		if (clickOutside) hide();
	});
</script>

<template>
	<Teleport to="#popovers">
		<Transition :css="false" @enter="onFlyoutEnter" @leave="onFlyoutLeave">
			<Comp
				v-if="shown"
				ref="flyout"
				v-bind="$attrs"
				:[scopeId]="''"
				:class="{ padding: !noPadding, clipping, moving }"
				:style="locationStyle"
			>
				<slot></slot>
			</Comp>
		</Transition>
	</Teleport>
</template>

<style scoped lang="scss">
	$padding: 12px 16px;

	:comp {
		@include dropdown-flyouts;
		@include round-large;
		@include set-max-size;
		@include acrylic-background;
		transition: $fallback-transitions, left 0s, top 0s;

		&.clipping {
			overflow: clip;
		}

		&.padding {
			padding: $padding;
		}

		&.moving {
			transition: $fallback-transitions, left $ease-out-smooth 600ms, top $ease-out-smooth 600ms;
		}

		> :deep(*) {
			max-width: calc(100dvw - list.nth($padding, 2) * 2);
		}
	}
</style>
