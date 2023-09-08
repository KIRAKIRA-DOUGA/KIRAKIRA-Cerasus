<script setup lang="ts">
	import { RecycleScroller } from "vue-virtual-scroller";

	const insertDanmaku = defineModel<DanmakuListItem[]>();
	const danmakuItemMenu = ref<MenuModel>();
	const currentDanmaku = ref<DanmakuListItem>();
	const { copy } = useClipboard();
	const headers = { videoTime: t.danmaku.list.thead.time, content: t.danmaku.list.thead.content, sendTime: t.danmaku.list.thead.sending_time };
	const colWidths = reactive([60, 150, 100]);
	const danmakuList = ref<Array<{ item: DanmakuListItem; key: ObjectKey }>>([]);
	const danmakuListKey = ref(0); // FIXME: 理论上 vue-virtual-scroller 会自动监测弹幕数组更新，但是目前不知道为什么不生效，暂时只能用这种方法解决。
	const sortBy = reactive<[column: "videoTime" | "sendTime", order: SortOrder]>(["videoTime", "ascending"]);

	watch(insertDanmaku, danmaku => {
		if (!danmaku) return;
		// damn lmao
		// FIXME
		danmakuList.value = danmakuList.value.concat(danmaku.map(e => {
			const key = e.content + e.sendTime.valueOf();
			return { item: e, key };
		}));
		danmakuListKey.value = new Date().valueOf();

		insertDanmaku.value = undefined;
	});

	/**
	 * 单击表头排序。
	 * @param columnIndex - 单击的列。
	 */
	function sort(columnIndex: number) {
		const column = columnIndex === 0 ? "videoTime" : columnIndex === 2 ? "sendTime" : undefined;
		if (!column) return;
		if (sortBy[0] === column) sortBy[1] = sortBy[1] === "ascending" ? "descending" : "ascending";
		else [sortBy[0], sortBy[1]] = [column, "ascending"];
		danmakuList.value.sort((a, b) => {
			let compare = a.item[sortBy[0]].valueOf() - b.item[sortBy[0]].valueOf();
			if (sortBy[1] === "descending") compare = -compare;
			return compare;
		});
		danmakuListKey.value = new Date().valueOf();
	}

	/**
	 * 拖拽抓柄逻辑处理。
	 * @param e - 指针事件（包括鼠标和触摸）。
	 */
	function onGripDown(e: PointerEvent) {
		const grip = e.target as HTMLDivElement;
		const index = +grip.dataset.index!;
		const th = grip.parentElement as HTMLTableCellElement;
		const gripWidth = grip.getBoundingClientRect().width;
		const thRect = th.getBoundingClientRect();
		const left = thRect.left;
		const x = e.pageX - left - grip.offsetLeft;
		forceCursor("col-resize");
		const pointerMove = (e: PointerEvent) => {
			colWidths[index] = Math.max(e.pageX - left - x + gripWidth, 60);
		};
		const pointerUp = (_e: PointerEvent) => {
			document.removeEventListener("pointermove", pointerMove);
			document.removeEventListener("pointerup", pointerUp);
			forceCursor(null);
		};
		document.addEventListener("pointermove", pointerMove);
		document.addEventListener("pointerup", pointerUp);
	}

	/**
	 * 复制弹幕。
	 */
	function copyDanmaku() {
		if (!currentDanmaku.value) return;
		copy(currentDanmaku.value.content);
		useToast("已复制", "success");
	}

	/**
	 * 处理单元格显示文本。
	 * @param value - 不同类型的数据。
	 * @returns 显示为字符串的值。
	 */
	function handleTableDataCellText(value: ValueOf<DanmakuListItem>) {
		if (value instanceof Date) return formatDate(value, "yyyy/MM/dd");
		else if (value instanceof Duration) return value.toString();
		else return value;
	}
</script>

<template>
	<Comp>
		<ClientOnly>
			<table class="lite">
				<thead>
					<th v-for="(header, column, j) in headers" :key="header" v-ripple :width="colWidths[j]" @click="() => sort(j)">
						<span>{{ header }}</span>
						<Icon
							name="chevron_up"
							:class="sortBy[0] === column && {
								ascending: sortBy[1] === 'ascending',
								descending: sortBy[1] === 'descending',
							}"
						/>
					</th>
					<div class="shadow">
						<th v-for="(header, _column, j) in headers" :key="header" :width="colWidths[j]">
							<div class="grip" :data-index="j" @pointerdown="onGripDown"></div>
						</th>
					</div>
				</thead>
				<tbody>
					<!-- <RecycleScroller v-slot="{ item }" class="scroller" :itemSize="28" keyField="key" :items="danmakuList"> -->
					<tr v-for="item in danmakuList" :key="item.key" v-ripple @contextmenu.prevent="e => { currentDanmaku = item.item; danmakuItemMenu = e; }">
						<td v-for="(value, key, j) in item.item" :key="key" :width="colWidths[j]">{{ handleTableDataCellText(value) }}</td>
					</tr>
					<!-- </RecycleScroller> -->
				</tbody>
			</table>
			<template #fallback>
				<div class="danmaku-placeholder">
					<ProgressRing />
					<span>{{ t.danmaku.list.loading }}</span>
				</div>
			</template>
		</ClientOnly>
		<Menu v-model="danmakuItemMenu">
			<MenuItem icon="copy" @click="copyDanmaku">{{ t.copy }}</MenuItem>
			<MenuItem icon="flag">{{ t.report }}</MenuItem>
			<hr />
			<MenuItem icon="person">TODO: USER NAME HERE</MenuItem>
		</Menu>
	</Comp>
</template>

<style scoped lang="scss">
	$item-height: 28px;

	:comp {
		flex-grow: 1;
		color: c(icon-color);

		table {
			@include square(100%);
			position: relative;
			display: block;
			overflow-x: overlay;
			table-layout: fixed;
			background-color: c(main-bg);
			border-spacing: 0;

			tbody {
				position: absolute;
				height: calc(100% - $item-height);
			}

			.vue-recycle-scroller {
				height: 100%;
			}

			thead,
			tbody {
				display: block;
				width: 100%;
			}

			thead {
				position: sticky;
				top: 0;
				z-index: 1;

				> th {
					cursor: pointer;

					&:is(:hover, :active) {
						background-color: c(hover-overlay) !important;
					}

					.icon {
						$transition: $fallback-transitions, rotate $ease-out-smooth 500ms;
						font-size: 16px;
						rotate: x 100grad;
						vertical-align: text-top;
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
				}

				.shadow {
					position: absolute;
					left: 0;
					height: 100%;
					pointer-events: none;

					> th {
						overflow: visible;
						background-color: transparent;
						pointer-events: none;
					}
				}
			}

			th,
			td {
				position: relative;
				display: block;
				flex-shrink: 0;
				min-width: 60px;
				height: $item-height;
				padding: 0.25rem 0.75rem;
				padding-right: 0;
				overflow: hidden;
				white-space: nowrap;
				text-align: left;
				text-overflow: ellipsis;
				transition: $fallback-transitions, width 0s;
			}

			thead,
			th {
				background-color: c(main-bg);
			}

			tbody tr {
				td:nth-child(1),
				td:nth-child(3) {
					font-variant-numeric: tabular-nums;
				}
			}

			thead,
			:deep(tr),
			thead > .shadow {
				display: flex;
				width: 100%;
				min-width: fit-content;
			}

			tr:hover {
				background-color: c(hover-overlay);
			}

			th .grip {
				@include flex-center;
				$click-width: 7px;
				position: absolute;
				top: 0;
				right: 0;
				z-index: 10;
				width: $click-width;
				height: 100%;
				opacity: 0;
				transition-duration: 1s;
				pointer-events: auto;
				touch-action: pan-y pinch-zoom;
				translate: calc(($click-width - 1px) / 2);

				&::after {
					display: block;
					width: 1px;
					height: 100%;
					background-color: c(divider, 10%);
					content: "";
				}

				&:hover {
					cursor: w-resize;

					&::after {
						background-color: c(accent-hover);
					}
				}

				&:active {
					cursor: col-resize;

					&::after {
						width: 3px;
						background-color: c(accent);
					}
				}
			}

			thead:is(:hover, :active) {
				@include chip-shadow;

				.grip {
					opacity: 1;
					transition-duration: 500ms;
				}
			}
		}

		.danmaku-placeholder {
			@include flex-center;
			flex-direction: column;
			gap: 12px;
			height: 100%;
		}
	}
</style>
