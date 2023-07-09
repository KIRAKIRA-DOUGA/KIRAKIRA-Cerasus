<script lang="ts">
	const updateIndicatorWithoutAnimation = Symbol("updateIndicatorWithoutAnimation");
</script>

<script setup lang="ts">
	const props = defineProps<{
		/** 是否使用纵向的 NavigationView 样式？ */
		vertical?: boolean;
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
		model.value = id;
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
	 * 获取子选项卡项目。
	 * @param id - 选项卡标识符。
	 * @returns 子选项卡项目。
	 */
	function getChild(id: string) {
		if (!slotNode.value) return null;
		const nodes: VNode[] = [];
		for (const child of slotNode.value.vnode)
			if (typeof child.children === "string") continue;
			else if (typeof child.type === "symbol") {
				if (child.type.description === "v-fgt" && Array.isArray(child.children))
					nodes.push(...child.children as VNode[]);
			} else nodes.push(child);
		for (const child of nodes)
			if (child.component?.props.id === id)
				return child.el as HTMLElement;
		return null;
	}

	/**
	 * 更新选项卡指示器。
	 * @param id - 当前选项卡标识符。
	 * @param prevId - 先前选项卡标识符。
	 */
	async function update(id?: string, prevId?: string | typeof updateIndicatorWithoutAnimation) {
		const LENGTH = 16; // 指定选项卡指示器的最大长度。
		id ??= model.value;
		if (!indicator.value) return;
		const indicatorStyle = indicator.value.style;
		const [pos1, pos2] = props.vertical ? ["top", "bottom"] as const : ["left", "right"] as const;
		const style = {
			set [pos1](value: number) { indicatorStyle[pos1] = value + "px"; },
			set [pos2](value: number) { indicatorStyle[pos2] = value + "px"; },
		};
		const item = getChild(id);
		if (!item) return;
		const itemPosEntry = getIndicatorPositions(item, LENGTH);
		let prevItemPosEntry: ReturnType<typeof getIndicatorPositions>;
		enum MoveDirection {
			POS1 = -1,
			NONE,
			POS2,
			IGNORE,
		}
		let moveDirection = MoveDirection.NONE;
		let prevItem: HTMLElement | null = null;
		if (prevId === updateIndicatorWithoutAnimation) moveDirection = MoveDirection.IGNORE;
		else {
			if (prevId !== undefined) prevItem = getChild(prevId);
			if (prevId !== undefined && prevItem) {
				prevItemPosEntry = getIndicatorPositions(prevItem, LENGTH);
				moveDirection = itemPosEntry[pos1] >= prevItemPosEntry[pos1] ? MoveDirection.POS2 : MoveDirection.POS1;
			} else prevItemPosEntry = getIndicatorPositions(item, 0);
		}
		const setPosition1 = () => style[pos1] = itemPosEntry[pos1];
		const setPosition2 = () => style[pos2] = itemPosEntry[pos2];
		const delayTime = () => delay(100);
		switch (moveDirection) {
			case MoveDirection.POS1:
				setPosition1();
				await delayTime();
				setPosition2();
				break;
			case MoveDirection.POS2:
				setPosition2();
				await delayTime();
				setPosition1();
				break;
			case MoveDirection.IGNORE:
				setPosition1();
				setPosition2();
				break;
			default:
				style[pos1] = prevItemPosEntry![pos1];
				style[pos2] = prevItemPosEntry![pos2];
				await nextAnimationTick();
				setPosition1();
				setPosition2();
				break;
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

		> :slotted(*) {
			flex-shrink: 0;
			cursor: pointer;
		}

		@container style(--loose: true) {
			gap: 2em;
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
		margin-top: 6px;
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
