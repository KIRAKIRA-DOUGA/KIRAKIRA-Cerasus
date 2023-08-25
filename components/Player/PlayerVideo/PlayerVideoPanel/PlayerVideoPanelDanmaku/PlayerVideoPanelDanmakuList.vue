<script setup lang="ts">
	import { RecycleScroller } from "vue-virtual-scroller";

	type DanmakuListItemInternal = Override<DanmakuListItem, { sendTime: string }>;
	const insertDanmaku = defineModel<DanmakuListItem>();
	const danmakuItemMenu = ref<MenuModel>();
	const currentDanmaku = ref<DanmakuListItemInternal>();
	const { copy } = useClipboard();
	const headers = ["时间", "内容", "发送时间"];
	const colWidths = reactive([60, 150, 100]);
	const danmakuList = reactive<DanmakuListItemInternal[]>([]);
	const danmakuListKey = ref(0); // 理论上 vue-virtual-scroller 会自动监测弹幕数组更新，但是目前不知道为什么不生效，暂时用这种方法解决。

	watch(insertDanmaku, _danmaku => {
		if (!_danmaku) return;
		const danmaku = _danmaku as unknown as DanmakuListItemInternal;
		danmaku.sendTime = formatDate(_danmaku.sendTime, "yyyy/MM/dd");
		danmakuList.push(danmaku);
		danmakuListKey.value = new Date().valueOf();
		insertDanmaku.value = undefined;
	});

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
</script>

<template>
	<Comp>
		<ClientOnly>
			<table class="lite">
				<thead>
					<th v-for="(header, j) in headers" :key="header" v-ripple :width="colWidths[j]">
						<span>{{ header }}</span>
					</th>
					<div class="shadow">
						<th v-for="(header, j) in headers" :key="header" :width="colWidths[j]">
							<div class="grip" :data-index="j" @pointerdown="onGripDown"></div>
						</th>
					</div>
				</thead>
				<tbody>
					<RecycleScroller v-slot="{ item }" :key="danmakuListKey" :itemSize="28" keyField="content" :items="danmakuList">
						<tr v-ripple @contextmenu.prevent="e => { currentDanmaku = item; danmakuItemMenu = e; }">
							<td v-for="(value, key, j) in item" :key="key" :width="colWidths[j]">{{ value }}</td>
						</tr>
					</RecycleScroller>
				</tbody>
			</table>
			<template #fallback>
				<div class="danmaku-placeholder">
					<ProgressRing />
					<span>弹幕装填中⋯⋯</span>
				</div>
			</template>
		</ClientOnly>
		<Menu v-model="danmakuItemMenu">
			<MenuItem icon="copy" @click="copyDanmaku">复制</MenuItem>
			<MenuItem icon="flag">举报</MenuItem>
			<hr />
			<MenuItem icon="person">进入该用户首页</MenuItem>
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
				overflow: hidden;
				white-space: nowrap;
				text-align: left;
				text-overflow: ellipsis;
				transition: $fallback-transitions, width 0s;
			}

			td {
				padding-right: 0;
			}

			thead,
			th {
				background-color: c(main-bg);
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
