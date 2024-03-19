<docs>
	# 自定义工具提示
	不要直接使用该组件，而是使用对应的 directive 来调用。
</docs>

<script setup lang="ts">
	import { type TooltipEvent, getPositionByEvent } from "plugins/vue/tooltip";

	type TooltipEventWithPosition = TooltipEvent & {
		position: CSSProperties;
		symbol: symbol;
	};

	const tooltipList = reactive<TooltipEventWithPosition[]>([]);
	const tooltipDoms = ref<HTMLDivElement[]>();

	/**
	 * 已渲染工具提示组件，但发现该组件超出了窗口边缘，则再对其进行位置调整。
	 * @returns 调整后的新的工具提示位置的样式属性值。
	 */
	async function adjustPosition() {
		await nextTick();
		for (const tooltipWrapper of tooltipDoms.value ?? []) {
			const tooltip = tooltipWrapper.querySelector<HTMLElement>(".tooltip");
			if (!tooltip) continue;
			Object.assign(tooltipWrapper.style, moveIntoPage(tooltip, tooltipWrapper));
		}
	}

	useListen("component:showTooltip", e => {
		if (isMobile()) return; // 触摸屏不要显示工具提示。
		const tooltip = e as TooltipEventWithPosition;
		if (!tooltip.title?.toString().trim()) return; // toString() 以刻意识别 i18n 的函数字符串。
		if (tooltipList.find(i => i.element === e.element)) {
			useEvent("component:updateTooltip", e);
			return;
		}
		tooltip.position = getPositionByEvent(e);
		tooltipList.push(tooltip);
		adjustPosition();
	});

	useListen("component:hideTooltip", element => {
		for (let i = tooltipList.length - 1; i >= 0; i--)
			if (tooltipList[i].element === element)
				arrayRemoveAt(tooltipList, i);
	});

	useListen("component:updateTooltip", e => {
		if (isMobile()) return;
		for (let i = tooltipList.length - 1; i >= 0; i--)
			if (tooltipList[i].element === e.element) {
				const tooltip = tooltipList[i];
				const newValue = e as TooltipEventWithPosition;
				tooltip.title = newValue.title;
				tooltip.position = newValue.position = getPositionByEvent(e);
			}
		adjustPosition();
		// TODO: 部分页面下工具提示会弹跳抖动，不清楚定位问题原因。
	});

	useListen("component:refreshTooltip", map => {
		for (let i = tooltipList.length - 1; i >= 0; i--)
			if (!map.has(tooltipList[i].element))
				arrayRemoveAt(tooltipList, i);
	});
</script>

<template>
	<Teleport to="#popovers">
		<Comp role="none">
			<TransitionGroup appear>
				<div
					v-for="tooltip in tooltipList"
					:key="tooltip.symbol"
					ref="tooltipDoms"
					class="tooltip-wrapper"
					:class="[tooltip.placement]"
					:style="tooltip.position"
					role="tooltip"
					aria-label="tooltip"
				>
					<div class="tooltip">
						{{ tooltip.title }}
					</div>
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

	.tooltip-wrapper {
		@include square(0);
		position: fixed;
		z-index: 80;
		display: flex;

		.tooltip {
			@include round-small;
			@include dropdown-flyouts;
			@include acrylic-background;
			flex-shrink: 0;
			max-width: 50dvw;
			padding: 8px 10px;
			color: c(text-color);
			word-wrap: break-word; // 尽量保持单词完整，一行都展示不下这个单词就会换行。
			overflow-wrap: break-word; // word-wrap 别名，CSS3 属性，都写上，万一以后 word-wrap 去掉了呢。
		}

		&.v-enter-active {
			transition-duration: 0s; // 开始显示工具提示时不要过渡动画，否则可以看到明显的背景高斯模糊突然发生变化。
		}

		&.v-enter-from,
		&.v-leave-to {
			opacity: 0;
		}

		&.top {
			align-items: flex-end;
			justify-content: center;
		}

		&.bottom {
			align-items: flex-start;
			justify-content: center;
		}

		&.right {
			align-items: center;
			justify-content: flex-start;
		}

		&.left {
			align-items: center;
			justify-content: flex-end;
		}
	}
</style>
