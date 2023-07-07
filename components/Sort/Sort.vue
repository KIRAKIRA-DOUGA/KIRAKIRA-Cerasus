<script setup lang="ts">
	const selected = defineModel<SortModel>({ required: true });
	const selectedId = computed(() => selected.value[0]), selectedOrder = computed(() => selected.value[1]);
	const slots = useSlots();
	const vdoms = slots.default?.();
	const items = computed(() => vdoms?.map(item => {
		const props = item.props as ComponentProps<typeof SortItem> | undefined;
		const caption = getSlotVNodeNormalizedChildren(item);
		if (typeof caption !== "string") return undefined!;
		return { caption, id: props?.id ?? caption, preferOrder: props?.preferOrder ?? "ascending" };
	}).filter(item => item) ?? []);

	/**
	 * 颠倒排序顺序。
	 * @param order - 排序顺序。
	 * @returns 颠倒后的排序顺序。
	 */
	function invertSortOrder(order: SortOrder) {
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
			<span class="caption">{{ item.caption }}</span>
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

		&.active {
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
		}
	}

	.icon.arrow {
		@include square(18px);
		display: block;
		scale: 1 0;
		color: c(accent);

		&.ascending {
			scale: 1;
		}

		&.descending {
			scale: 1 -1;
		}
	}
</style>
