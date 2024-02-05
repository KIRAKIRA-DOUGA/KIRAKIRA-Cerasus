<script lang="ts">
	const updateIndicatorWithoutAnimation = Symbol("updateIndicatorWithoutAnimation");
	const updateIndicatorToFade = Symbol("updateIndicatorToFade");
</script>

<script setup lang="ts">
	const props = defineProps<{
		/** 是否使用纵向的 NavigationView 样式？ */
		vertical?: boolean;
	}>();

	const emits = defineEmits<{
		moving: [movement: TabBarMovement];
		movingForTransition: [transition: string];
	}>();

	const model = defineModel<string>({ required: true });
	const { RenderComp, slotNode } = useFactory();

	const tabBarInline = ref<HTMLSpanElement>();
	const indicator = ref<HTMLDivElement>();
	const unmounted = ref(false);
	const scrollArea = ref<HTMLDivElement>();
	const { x: scrollX } = useScroll(scrollArea, { behavior: "smooth" });
	const resizeObserver = ref<ResizeObserver>();
	const arrivedState = ref({ left: false, right: false }); // 用以解决 useScroll 自带 arrivedState 属性的功能实现缺陷。
	const longPressTimeoutId = ref<Timeout>();
	const clearLongPressTimeoutId = () => clearInterval(longPressTimeoutId.value!);

	/**
	 * 根据标识符切换选项卡。
	 * @param id - 选项卡标识符。
	 */
	function changeTab(id: string) {
		update(id, model.value);
	}

	/**
	 * 当选项卡指示器移动时触发的事件。
	 * @param movement - 选项卡指示器移动方向。
	 */
	function onMoving(movement: TabBarMovement) {
		const transitionName =
			movement === "previous" ? "left" :
			movement === "next" ? "right" :
			// movement === "none" ? "page-jump" :
			"";

		emits("moving", movement);
		if (transitionName) emits("movingForTransition", transitionName);
	}

	/**
	 * 获取指示器的四边位置。
	 * @param item - 选项卡项目。
	 * @param maxLength - 指示器的最大长度。
	 * @returns 指示器的四边位置。
	 */
	function getIndicatorPositions(item: HTMLElement, maxLength: number) {
		if (!tabBarInline.value) throw new ReferenceError("DOM 未完全初始化。");
		const {
			left: itemLeft,
			right: itemRight,
			width: itemWidth,
			top: itemTop,
			bottom: itemBottom,
			height: itemHeight,
		} = item.getBoundingClientRect();
		const {
			left: tabBarLeft,
			right: tabBarRight,
			top: tabBarTop,
			bottom: tabBottom,
		} = tabBarInline.value.getBoundingClientRect();
		const offset = ((props.vertical ? itemHeight : itemWidth) - maxLength) / 2;
		return {
			left: (itemWidth <= maxLength ? itemLeft : itemLeft + offset) - tabBarLeft,
			right: -(itemWidth <= maxLength ? itemRight : itemRight - offset) + tabBarRight,
			top: (itemHeight <= maxLength ? itemTop : itemTop + offset) - tabBarTop,
			bottom: -(itemHeight <= maxLength ? itemBottom : itemBottom - offset) + tabBottom,
		};
	}

	/**
	 * 获取子选项卡项目数组。
	 */
	const children = computed(() => {
		if (!slotNode.value) return null;
		const nodes: VNode[] = [];
		for (const child of slotNode.value.vnode ?? [])
			if (typeof child.children === "string") continue;
			else if (typeof child.type === "symbol") {
				if (child.type.description === "v-fgt" && Array.isArray(child.children))
					nodes.push(...child.children as VNode[]);
			} else nodes.push(child);
		return arrayMapObject(nodes, child => {
			const id = child.component?.props.id as string;
			return [
				id, {
					node: child,
					el: child.el as HTMLElement,
					id,
				},
			];
		});
	});

	/**
	 * 获取从样式层面（即强调色）的选中选项卡，而不是代码层面。
	 * @returns 从样式层面（即强调色）的选中选项卡。
	 */
	function getStyledActiveItem() {
		for (const [_, item] of entries(children.value ?? {}))
			if (item.el.classList.contains("active"))
				return item;
		return null;
	}

	let isUpdating = false;
	/**
	 * 更新选项卡指示器。
	 * @param id - 当前选项卡标识符。
	 * @param prevId - 先前选项卡标识符。
	 */
	async function update(
		id?: string | typeof updateIndicatorToFade,
		prevId?: string | typeof updateIndicatorWithoutAnimation,
	) {
		if (isUpdating) return;
		const LENGTH = 16; // 指定选项卡指示器的最大长度。
		id ??= model.value;
		if (!indicator.value) return;
		const indicatorStyle = indicator.value.style;
		const [prev, next] = props.vertical ? ["top", "bottom"] as const : ["left", "right"] as const;
		const style = {
			set [prev](value: number) { indicatorStyle[prev] = value + "px"; },
			set [next](value: number) { indicatorStyle[next] = value + "px"; },
		};
		if (typeof id !== "string" && typeof prevId !== "string") return; // 保证 id、prevId 至少有一个是 string 类型。
		const isUpdateIndicatorToFade = id === updateIndicatorToFade;
		const item = children.value?.[(!isUpdateIndicatorToFade ? id : prevId) as string]?.el;
		if (!item) return;
		const itemPosEntry = getIndicatorPositions(item, !isUpdateIndicatorToFade ? LENGTH : 0);
		let prevItemPosEntry: ReturnType<typeof getIndicatorPositions> = undefined!;
		let movement: TabBarMovement = "none";
		let prevItem: HTMLElement | null = null;
		if (prevId === updateIndicatorWithoutAnimation || isPrefersReducedMotion())
			movement = "ignore";
		else if (isUpdateIndicatorToFade)
			movement = "fade";
		else {
			if (prevId !== undefined) prevItem = children.value?.[prevId].el;
			if (prevId !== undefined && prevItem) {
				prevItemPosEntry = getIndicatorPositions(prevItem, LENGTH);
				movement = itemPosEntry[prev] >= prevItemPosEntry[prev] ? "next" : "previous";
			} else prevItemPosEntry = getIndicatorPositions(item, 0);
		}
		isUpdating = true;
		onMoving(movement);
		if (typeof id === "string") model.value = id;
		isUpdating = false;
		const setPosition1 = () => style[prev] = itemPosEntry[prev];
		const setPosition2 = () => style[next] = itemPosEntry[next];
		const delayTime = () => delay(100);
		switch (movement) {
			case "previous":
				setPosition1();
				await delayTime();
				setPosition2();
				break;
			case "next":
				setPosition2();
				await delayTime();
				setPosition1();
				break;
			case "ignore":
			case "fade":
				setPosition1();
				setPosition2();
				break;
			default:
				style[prev] = prevItemPosEntry[prev];
				style[next] = prevItemPosEntry[next];
				await nextAnimationTick();
				setPosition1();
				setPosition2();
				break;
		}
		await nextTick();
		// 如果在 modelValue 层面对返回值做出了拦截。
		if (!item.classList.contains("active") && typeof id === "string") {
			const actualItem = getStyledActiveItem();
			update(actualItem ? actualItem.id : updateIndicatorToFade, id);
		}
	}

	/**
	 * 检查选项卡栏及其祖先元素是否都没有变换样式设定。
	 * @returns 是否没有变换。
	 */
	function isNoTransform() {
		if (!tabBarInline.value) return false;
		for (const element of getPath(tabBarInline)) {
			const style = getComputedStyle(element);
			for (const property of ["scale", "translate", "rotate", "transform"] as const)
				if (style[property] !== "none")
					return false;
		}
		return true;
	}

	/**
	 * 当按下选项卡左右两侧按钮时的事件。
	 * @param direction - 翻动方向。
	 */
	function onFlipViewButtonDown(direction: "left" | "right") {
		clearLongPressTimeoutId();
		const action = () => {
			const dir = direction === "left" ? -1 : 1;
			scrollX.value += 50 * dir;
		};
		action();
		longPressTimeoutId.value = setInterval(action, 200);
	}

	/**
	 * 控制是否显示选项卡左右两侧按钮的逻辑。
	 */
	function showFlipViewButtonHandler() {
		const el = scrollArea.value;
		if (!el) return;
		const hide = { left: false, right: false };
		if (props.vertical) arrivedState.value = hide;
		else if (el.scrollWidth <= el.offsetWidth) arrivedState.value = hide;
		else arrivedState.value = {
			left: el.scrollLeft > 0,
			right: el.scrollLeft < el.scrollWidth - el.offsetWidth - 1,
		};
	}

	watch(model, (id, prevId) => update(id, prevId));
	// useEventListener("window", "resize", () => update(undefined, updateIndicatorWithoutAnimation));
	useEventListener(scrollArea, "scroll", showFlipViewButtonHandler);

	onMounted(async () => {
		resizeObserver.value = new ResizeObserver(showFlipViewButtonHandler);
		scrollArea.value && resizeObserver.value.observe(scrollArea.value);
		while (!isNoTransform() && !unmounted.value)
			await delay(100);
		update(undefined);
	});

	onUnmounted(() => {
		unmounted.value = true;
		resizeObserver.value?.disconnect();
		clearLongPressTimeoutId();
	});

	defineExpose({
		changeTab,
	});
</script>

<template>
	<Comp :class="{ vertical }" role="tablist" :aria-details="model" :aria-orientation="vertical ? 'vertical' : 'horizontal'">
		<Transition name="fade">
			<FlipViewButton v-if="arrivedState.left" direction="left" @pointerdown="onFlipViewButtonDown('left')" @pointerup="clearLongPressTimeoutId" />
		</Transition>
		<div ref="scrollArea" class="scroll-area">
			<div ref="tabBarInline" class="inline">
				<div class="items">
					<RenderComp :vnode="$slots.default?.()" />
				</div>
				<div ref="indicator" class="indicator"></div>
			</div>
		</div>
		<Transition name="fade">
			<FlipViewButton v-if="arrivedState.right" direction="right" @pointerdown="onFlipViewButtonDown('right')" @pointerup="clearLongPressTimeoutId" />
		</Transition>
	</Comp>
</template>

<style scoped lang="scss">
	@layer props {
		:comp {
			/// 是否使用切边样式的指示器？
			--clipped: false;
			/// 是否使用较大间距？
			--loose: false;
			/// 是否占满宽度并平均分布？
			--full: false;
		}
	}

	:comp {
		position: relative;
	}

	.scroll-area {
		overflow: hidden;

		@media (hover: none) { // 触摸屏允许直接左右滑动翻页。
			overflow-x: auto;
		}
	}

	.items {
		display: flex;
		align-items: flex-end;

		> :deep(*) {
			flex-shrink: 0;
		}

		:comp.vertical & {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
		}
	}

	.inline {
		position: relative;
		display: inline-block;

		@container style(--full: true) {
			width: 100%;
		}

		:comp.vertical & {
			width: 100%;
		}
	}

	.flip-view-button {
		$hide-color: c(icon-color, 7%);
		position: absolute;
		top: 0;
		z-index: 5;

		&.left {
			left: 0;
			background: linear-gradient(to left, transparent, $hide-color);
		}

		&.right {
			right: 0;
			background: linear-gradient(to right, transparent, $hide-color);
		}
	}

	.indicator {
		@include oval;
		@include enable-hardware-3d;
		$thickness: 3px;
		$pressed-scale: calc(10px / 16px);
		$active-item-pressed: ".items:has(.tab-item.active:active:hover)";
		position: absolute;
		z-index: 3;
		flex-shrink: 0;
		height: $thickness;
		margin-top: -$thickness;
		background-color: c(accent);

		@container style(--clipped: true) {
			@include oval(top);
		}

		#{$active-item-pressed} ~ & {
			scale: $pressed-scale 1;
		}

		:comp.vertical #{$active-item-pressed} ~ & {
			scale: 1 $pressed-scale;
		}

		:comp.vertical & {
			width: $thickness;
			height: unset;
			margin-top: 0;
		}
	}
</style>
