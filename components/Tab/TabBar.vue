<script setup lang="ts">
	const props = defineProps<{
		clipped?: boolean;
		vertical?: boolean;
		big?: boolean;
		modelValue: string;
	}>();

	const emits = defineEmits<{
		(event: "update:modelValue", arg: string): void;
	}>();

	const { Slot, slotNode } = useFactory();
	const tabBar = ref<HTMLElement>();
	const indicator = ref<HTMLDivElement>();
	const updateIndicatorWithoutAnimation = Symbol.for("updateIndicatorWithoutAnimation");

	/**
	 * 根据标识符切换选项卡。
	 * @param id - 选项卡标识符。
	 */
	function changeTab(id: string) {
		emits("update:modelValue", id);
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
		const offset = props.vertical ? (itemHeight - maxLength) / 2 : (itemWidth - maxLength) / 2;
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
		for (const child of slotNode.value.vnode)
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
		id ??= props.modelValue;
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
			if (prevId) prevItem = getChild(prevId);
			if (prevId && prevItem) {
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

	watch(() => props.modelValue, (id, prevId) => {
		update(id, prevId);
	});

	useEventListener("window", "resize", () => update(undefined, updateIndicatorWithoutAnimation), { immediate: true });

	defineExpose({
		changeTab,
	});
</script>

<template>
	<Comp>
		<div ref="tabBar" class="tab-bar">
			<div class="items" :class="{ vertical, big }">
				<Slot />
			</div>
			<div ref="indicator" class="indicator" :class="{ vertical }"></div>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	.items {
		display: flex;
		gap: 1rem;
		align-items: flex-end;

		> :slotted(*) {
			flex-shrink: 0;
			cursor: pointer;
		}

		&.big {
			gap: 2em;
		}

		&.vertical {
			@include flex-block;
			gap: 2px;
			align-items: flex-start;
		}
	}

	div.tab-bar {
		position: relative;
		display: inline-block;
		width: 100%;
	}

	.indicator {
		@include oval;
		$thickness: 3px;
		position: absolute;
		flex-shrink: 0;
		height: $thickness;
		margin-top: 6px;
		background-color: c(accent);

		&.vertical {
			width: $thickness;
			height: unset;
			margin-top: 2px;
		}
	}
</style>
