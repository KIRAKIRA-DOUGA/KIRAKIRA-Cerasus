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

	defineSlots<{
		default?: typeof TabItem;
	}>();

	const model = defineModel<string>({ required: true });
	const { Slot, slotNode } = useFactory();
	
	const tabBar = refComp();
	const indicator = ref<HTMLDivElement>();
	const unmounted = ref(false);

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
		if (!tabBar.value) throw new ReferenceError("DOM 未完全初始化。");
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
		} = tabBar.value.getBoundingClientRect();
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
		for (const child of slotNode.value.vnode)
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
		if (!tabBar.value) return false;
		for (const element of getPath(tabBar)) {
			const style = getComputedStyle(element);
			for (const property of ["scale", "translate", "rotate", "transform"] as const)
				if (style[property] !== "none")
					return false;
		}
		return true;
	}

	watch(model, (id, prevId) => update(id, prevId));

	useEventListener("window", "resize", () => update(undefined, updateIndicatorWithoutAnimation));

	onMounted(async () => {
		while (!isNoTransform() && !unmounted.value)
			await delay(100);
		update(undefined);
	});

	onUnmounted(() => {
		unmounted.value = true;
	});

	defineExpose({
		changeTab,
	});
</script>

<template>
	<Comp ref="tabBar" :class="{ vertical }" role="tablist" :aria-details="model" :aria-orientation="vertical ? 'vertical' : 'horizontal'">
		<div class="items">
			<Slot />
		</div>
		<div ref="indicator" class="indicator"></div>
	</Comp>
</template>

<style scoped lang="scss">
	@layer props {
		:comp {
			/// 是否使用切边样式的指示器？
			--clipped: false;
			/// 是否使用较大间距？
			--loose: false;
		}
	}

	.items {
		display: flex;
		gap: 1rem;
		align-items: flex-end;
		padding-bottom: 9px;

		> :slotted(*) {
			flex-shrink: 0;
			cursor: pointer;
		}

		@container style(--loose: true) {
			gap: 2em;
			padding-bottom: 15px;
		}

		:comp.vertical > & {
			display: flex;
			flex-direction: column;
			gap: 2px;
			align-items: flex-start;
		}
	}

	:comp {
		position: relative;
		display: inline-block;
		// TODO: 当页面宽度过窄时，横向 Tab 内容超出页面宽度范围会被截去内容，还需要添加点击 TAB 两侧三角形按钮来滑动 TAB 页面。

		&.vertical {
			width: 100%;
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

		:comp.vertical > #{$active-item-pressed} ~ & {
			scale: 1 $pressed-scale;
		}

		:comp.vertical > & {
			width: $thickness;
			height: unset;
			margin-top: 2px;
		}
	}
</style>
