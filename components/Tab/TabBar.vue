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

	// TODO: [艾拉] 竖向 indicator。
	/**
	 * 获取指示器的左边和右边值。
	 * @param item - 选项卡项目。
	 * @param maxLength - 指示器的最大长度。
	 * @returns 指示器的左边和右边值。
	 */
	function getIndicatorLeftRight(item: HTMLElement, maxLength: number) {
		if (!tabBar.value) throw new ReferenceError("DOM 未完全初始化。");
		const { left: itemLeft, right: itemRight, width: itemWidth } = item.getClientRects()[0];
		const { left: tabBarLeft, right: tabBarRight } = tabBar.value.getClientRects()[0];
		const offset = (itemWidth - maxLength) / 2;
		return {
			left: (itemWidth <= maxLength ? itemLeft : itemLeft + offset) - tabBarLeft,
			right: -(itemWidth <= maxLength ? itemRight : itemRight - offset) + tabBarRight,
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
		const style = {
			set left(value: number) { indicatorStyle.left = value + "px"; },
			set right(value: number) { indicatorStyle.right = value + "px"; },
		};
		const item = getChild(id);
		if (!item) return;
		const itemLr = getIndicatorLeftRight(item, LENGTH);
		let prevItemLr: ReturnType<typeof getIndicatorLeftRight>;
		enum MoveDirection {
			LEFT = -1,
			NONE,
			RIGHT,
			IGNORE,
		}
		let moveDirection = MoveDirection.NONE;
		let prevItem: HTMLElement | null = null;
		if (prevId === updateIndicatorWithoutAnimation)
			moveDirection = MoveDirection.IGNORE;
		else {
			if (prevId) prevItem = getChild(prevId);
			if (prevId && prevItem) {
				prevItemLr = getIndicatorLeftRight(prevItem, LENGTH);
				moveDirection = itemLr.left >= prevItemLr.left ? MoveDirection.RIGHT : MoveDirection.LEFT;
			} else
				prevItemLr = getIndicatorLeftRight(item, 0);
		}
		const setLeft = () => style.left = itemLr.left;
		const setRight = () => style.right = itemLr.right;
		const delayTime = () => delay(100);
		switch (moveDirection) {
			case MoveDirection.RIGHT:
				setRight();
				await delayTime();
				setLeft();
				break;
			case MoveDirection.LEFT:
				setLeft();
				await delayTime();
				setRight();
				break;
			case MoveDirection.IGNORE:
				setLeft();
				setRight();
				break;
			default:
				style.left = prevItemLr!.left;
				style.right = prevItemLr!.right;
				await nextAnimationTick();
				setLeft();
				setRight();
				break;
		}
	}

	/**
	 * 当页面大小变化时更新选项卡指示器。
	 */
	function onResize() {
		update(undefined, updateIndicatorWithoutAnimation);
	}

	watch(() => props.modelValue, (id, prevId) => {
		update(id, prevId);
	});

	onMounted(() => {
		update();
		window.addEventListener("resize", onResize);
	});

	onUnmounted(() => {
		window.removeEventListener("resize", onResize);
	});

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
			<div ref="indicator" class="indicator"></div>
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
	}

	.indicator {
		@include oval;
		$thickness: 3px;
		position: absolute;
		flex-shrink: 0;
		height: $thickness;
		margin-top: 6px;
		background-color: c(accent);
	}
</style>
