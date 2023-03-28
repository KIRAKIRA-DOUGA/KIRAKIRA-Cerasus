<script setup lang="ts">
	const danmakuItemMenu = ref<InstanceType<typeof Menu>>();
	const currentDanmakuIndex = ref(0);
	const { copy } = useClipboard();
	const headers = ["时间", "内容", "发送时间"];
	const colWidths = reactive([60, 150, 100]);

	/**
	 * 获取弹幕。
	 * @param index - 弹幕序号。
	 * @returns - 弹幕信息。
	 */
	function getDanmaku(index: number) {
		return {
			videoTime: new Duration(index - 1),
			content: `第${digitCase(index)}，火前留名！`,
			sendTime: formatDate(new Date(), "yyyy-MM-dd"),
		};
	}

	/**
	 * 拖拽抓柄逻辑处理。
	 * @param e - 指针事件（包括鼠标和触摸）。
	 */
	function onGripDown(e: PointerEvent) {
		const grip = e.target as HTMLDivElement;
		const index = +grip.dataset.index!;
		const th = grip.parentElement as HTMLTableCellElement;
		const gripWidth = grip.getClientRects()[0].width;
		const thRect = th.getClientRects()[0];
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
		copy(getDanmaku(currentDanmakuIndex.value).content);
		useToast("已复制", "success");
	}
</script>

<template>
	<kira-component class="player-video-danmaku-list">
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
					<tr v-for="i in 100" :key="i" v-ripple @contextmenu.prevent="e => { currentDanmakuIndex = i; danmakuItemMenu?.show(e); }">
						<td v-for="(value, key, j) in getDanmaku(i)" :key="key" :width="colWidths[j]">{{ value }}</td>
					</tr>
				</tbody>
			</table>
			<template #fallback>
				<div class="danmaku-placeholder">
					<ProgressRing />
					<span>弹幕装填中……</span>
				</div>
			</template>
		</ClientOnly>
		<Menu ref="danmakuItemMenu">
			<MenuItem icon="copy" @click="copyDanmaku">复制</MenuItem>
			<MenuItem icon="flag">举报</MenuItem>
		</Menu>
	</kira-component>
</template>

<style scoped lang="scss">
	.player-video-danmaku-list {
		@include flex-block;
		flex-grow: 1;
		color: c(icon-color);

		table {
			@include flex-block;
			@include square(100%);
			position: relative;
			display: block;
			overflow: overlay;
			table-layout: fixed;
			background-color: c(main-bg);
			border-spacing: 0;
			contain: strict;

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
						background-color: c(hover-color) !important;
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
				background-color: c(hover-color);
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
				}

				&:active {
					cursor: col-resize;
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
