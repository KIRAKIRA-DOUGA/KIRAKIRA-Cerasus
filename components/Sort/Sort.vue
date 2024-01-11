<script setup lang="ts">
	const selected = defineModel<SortModel>({ required: true });
	const selectedId = computed(() => selected.value[0]), selectedOrder = computed(() => selected.value[1]);
	const slots = useSlots();
	const vdoms = slots.default?.();
	const items = computed(() => getSlotItems<typeof SortItem>(vdoms)({ preferOrder: "ascending" }));

	/**
	 * 颠倒排序顺序。
	 * @param order - 排序顺序。
	 * @returns 颠倒后的排序顺序。
	 */
	function invertSortOrder(order: SortOrder): SortOrder {
		return order === "ascending" ? "descending" : "ascending";
	}

	/**
	 * 点击排序项目事件。
	 * @param item - 排序项目。
	 */
	function onClickItem(item: Unref<typeof items>[0]) {
		if (selectedId.value === item.id)
			selected.value = [selectedId.value, invertSortOrder(selectedOrder.value)];
		else
			selected.value = [item.id, item.preferOrder];
	}
</script>

<template>
	<Comp>
		<div
			v-for="item in items"
			:key="item.id"
			v-ripple
			class="item"
			:class="{ active: item.id === selectedId }"
			@click="onClickItem(item)"
		>
			<span class="caption">{{ item.content }}</span>
			<Icon name="arrow_up" class="arrow" :class="{ [selectedOrder]: item.id === selectedId }" />
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		display: grid;
	}

	.item {
		@include round-small;
		position: relative;
		display: flex;
		gap: 8px;
		align-items: center;
		padding: 8px;
		padding-left: 12px;
		color: c(icon-color);
		cursor: pointer;

		&::before {
			@include oval;
			position: absolute;
			left: 0;
			z-index: 3;
			display: block;
			width: 3px;
			height: 16px;
			scale: 1 0;
			background-color: c(accent);
			content: "";
		}

		&:any-hover,
		&:active {
			background-color: c(hover-overlay);
		}

		&.active {
			@include accent-ripple;

			.caption {
				color: c(accent);
				font-weight: bold;
			}

			&::before {
				scale: 1;
			}

			&:active::before {
				height: 10px;
			}

			&:any-hover,
			&:active {
				background-color: c(accent-hover-overlay);
			}
		}
	}

	.icon.arrow {
		$transition: $fallback-transitions, rotate $ease-out-smooth 500ms; // 在箭头消失时不应减速动画以免影响效果。
		color: c(accent);
		font-size: 18px;
		rotate: x 100grad;
		transform-style: preserve-3d;
		perspective: 250px;

		&.ascending {
			rotate: x 0grad;
			transition: $transition;
		}

		&.descending {
			rotate: x 200grad;
			transition: $transition;
		}
	}
</style>
