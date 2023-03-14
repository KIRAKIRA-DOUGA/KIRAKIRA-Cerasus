<script lang="ts">
	export type TabBarChildren = Record<string, {
		dom: HTMLElement;
	}>;
</script>

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

	const slots = useSlots().default?.();

	const children = reactive({} as TabBarChildren);
	const tabBar = ref<HTMLElement>();
	const indicator = ref<HTMLDivElement>();

	/**
	 * 根据标识符切换选项卡。
	 * @param id - 选项卡标识符。
	 */
	function changeTab(id: string) {
		emits("update:modelValue", id);
	}

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
	 * 更新选项卡指示器。
	 * @param id - 当前选项卡标识符。
	 * @param prevId - 先前选项卡标识符。
	 */
	async function update(id?: string, prevId?: string) {
		const LENGTH = 16; // 指定选项卡指示器的最大长度。
		id ??= props.modelValue;
		if (!indicator.value) return;
		const indicatorStyle = indicator.value.style;
		const style = {
			set left(value: number) { indicatorStyle.left = value + "px"; },
			set right(value: number) { indicatorStyle.right = value + "px"; },
		};
		const item = children[id].dom;
		const itemLr = getIndicatorLeftRight(item, LENGTH);
		let prevItemLr: ReturnType<typeof getIndicatorLeftRight>;
		enum MoveDirection {
			LEFT = -1,
			NONE,
			RIGHT,
		}
		let moveDirection = MoveDirection.NONE;
		if (prevId) {
			const prevItem = children[prevId].dom;
			prevItemLr = getIndicatorLeftRight(prevItem, LENGTH);
			moveDirection = itemLr.left >= prevItemLr.left ? MoveDirection.RIGHT : MoveDirection.LEFT;
		} else
			prevItemLr = getIndicatorLeftRight(item, 0);
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
			default:
				style.left = prevItemLr.left;
				style.right = prevItemLr.right;
				await nextAnimationTick();
				setLeft();
				setRight();
				break;
		}
	}

	watch(() => props.modelValue, (id, prevId) => {
		update(id, prevId);
	});

	onMounted(() => {
		update();
		window.addEventListener("resize", () => update());
	});

	defineExpose({
		changeTab,
		children,
	});
</script>

<template>
	<kira-component>
		<div ref="tabBar" class="tab-bar">
			<div class="items" :class="{ vertical, big }">
				<slot></slot>
			</div>
			<div ref="indicator" class="indicator"></div>
		</div>
	</kira-component>
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
	}

	.tab-bar {
		position: relative;
		display: inline-block;
	}

	.indicator {
		@include oval;
		$thickness: 3px;
		position: absolute;
		flex-shrink: 0;
		height: $thickness;
		margin-top: 8px;
		background-color: c(accent);
	}
</style>
