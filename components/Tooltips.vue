<docs>
	# 自定义工具提示
	不要直接使用该组件，而是使用对应的 directive 来调用。
</docs>

<script setup lang="ts">
	import type { TooltipEvent } from "plugins/vue/tooltip";

	/** CAUTION: 仅用于开发环境过程中的调试，请确保在生产环境中为 `false`。 */
	const DEBUG_MODE = false;

	const tooltipList = reactive<TooltipEvent[]>([]);
	const tooltipDoms = ref<HTMLDivElement[]>();

	const isHidingAllTooltips = ref(false);
	async function hideAllTooltips() {
		if (DEBUG_MODE) return;
		isHidingAllTooltips.value = true;
		const hasTooltips = tooltipList.length > 0;
		arrayClearAll(tooltipList);
		if (hasTooltips)
			await delay(100);
		isHidingAllTooltips.value = false;
	}

	useListen("component:showTooltip", e => {
		if (isMobile() || isHidingAllTooltips.value) return; // 触摸屏不要显示工具提示。
		const tooltip = e;
		if (!tooltip.title?.toString().trim()) return; // toString() 以刻意识别 i18n 的函数字符串。
		if (tooltipList.find(i => i.element === e.element)) {
			useEvent("component:updateTooltip", e);
			return;
		}
		tooltipList.push(tooltip);
	});

	useListen("component:hideTooltip", element => {
		if (DEBUG_MODE) return;
		for (let i = tooltipList.length - 1; i >= 0; i--)
			if (tooltipList[i].element === element)
				arrayRemoveAt(tooltipList, i);
	});

	useListen("component:updateTooltip", e => {
		if (isMobile() || isHidingAllTooltips.value) return;
		for (let i = tooltipList.length - 1; i >= 0; i--)
			if (tooltipList[i].element === e.element) {
				const tooltip = tooltipList[i];
				const newValue = e;
				tooltip.title = newValue.title;
			}
	});

	useListen("component:refreshTooltip", map => {
		for (let i = tooltipList.length - 1; i >= 0; i--)
			if (!map.has(tooltipList[i].element))
				arrayRemoveAt(tooltipList, i);
	});

	useEventListener("document", "mousedown", hideAllTooltips, { capture: true });
	useEventListener("document", "keydown", hideAllTooltips, { capture: true });
</script>

<template>
	<Teleport to="#popovers">
		<Comp role="none">
			<TransitionGroup appear>
				<div
					v-for="tooltip in tooltipList"
					:key="tooltip.anchorName"
					ref="tooltipDoms"
					class="tooltip"
					:class="[tooltip.placement]"
					:style="{
						positionAnchor: tooltip.anchorName,
						'--offset': tooltip.offset !== undefined ? tooltip.offset + 'px' : undefined,
					}"
					role="tooltip"
					aria-label="tooltip"
				>
					{{ tooltip.title }}
				</div>
			</TransitionGroup>
		</Comp>
	</Teleport>
</template>

<style scoped lang="scss">
	:comp {
		display: contents;
		pointer-events: none;
	}

	.tooltip {
		@include round-small;
		@include dropdown-flyouts;
		@include acrylic-background;
		--offset: 10px;
		position: fixed;
		z-index: $z-tooltip;
		display: flex;
		flex-shrink: 0;
		max-width: 50dvw;
		padding: 8px 10px;
		color: c(text-color);
		// stylelint-disable-next-line property-no-deprecated
		word-wrap: break-word; // 尽量保持单词完整，一行都展示不下这个单词就会换行。
		overflow-wrap: break-word; // word-wrap 别名，CSS3 属性，都写上，万一以后 word-wrap 去掉了呢。

		&.v-enter-from,
		&.v-leave-to {
			margin: 0 !important;
			opacity: 0;
		}

		&.top,
		&.bottom,
		&.y {
			position-area: top;
			position-try: flip-block;
			margin-bottom: var(--offset);

			&.bottom {
				position-area: bottom;
				margin-top: var(--offset);
				margin-bottom: 0;
			}

			&.y {
				position-try-order: most-height;
			}
		}

		&.left,
		&.right,
		&.x {
			position-area: left;
			position-try: flip-inline;
			margin-right: var(--offset);

			&.right {
				position-area: right;
				margin-right: 0;
				margin-left: var(--offset);
			}

			&.x {
				position-try-order: most-width;
			}
		}
	}
</style>
