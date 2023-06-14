<docs>
	# 自定义工具提示
	不要直接使用该组件，而是使用对应的 directive 来调用。
</docs>

<script setup lang="ts">
	import { TooltipEvent } from "plugins/vue/tooltip";

	type TooltipEventWithPosition = TooltipEvent & {
		position: StyleValue;
		symbol: symbol;
	};

	const tooltipList = reactive<TooltipEventWithPosition[]>([]);
	const tooltipDoms = ref<HTMLDivElement[]>();

	/**
	 * 根据给定的工具提示方向和偏移值，获取工具提示的定位值。
	 * @param e - 工具提示事件。
	 * @returns 表示工具提示位置的样式属性值。
	 */
	function getPosition(e: TooltipEvent) {
		const bounding = e.element.getBoundingClientRect();
		e.offset ??= 10;
		if (!e.placement) { // 如果缺省工具提示放置位置，则会寻找离页边最远的方向。
			const toPageDistance = [bounding.top, window.innerHeight - bounding.bottom, window.innerWidth - bounding.right, bounding.left];
			const placements = ["top", "bottom", "right", "left"] as const; // 优先顺序：上、下、右、左。
			e.placement = placements[toPageDistance.indexOf(Math.max(...toPageDistance))];
		}
		let position: [number, number];
		if (e.placement === "top")
			position = [bounding.top - e.offset, bounding.left + bounding.width / 2];
		else if (e.placement === "bottom")
			position = [bounding.bottom + e.offset, bounding.left + bounding.width / 2];
		else if (e.placement === "left")
			position = [bounding.top + bounding.height / 2, bounding.left - e.offset];
		else
			position = [bounding.top + bounding.height / 2, bounding.right + e.offset];
		return { top: position[0] + "px", left: position[1] + "px" } as StyleValue;
	}

	/**
	 * 已渲染工具提示组件，但发现该组件超出了窗口边缘，则再对其进行位置调整。
	 * @returns 调整后的新的工具提示位置的样式属性值。
	 */
	async function adjustPosition() {
		await nextTick();
		for (const tooltipWrapper of tooltipDoms.value ?? []) {
			const tooltip = tooltipWrapper.querySelector<HTMLElement>(".tooltip");
			if (!tooltip) continue;
			const bounding = tooltip.getBoundingClientRect();
			const adjustment: [number, number] = [0, 0];
			if (bounding.right > window.innerWidth) adjustment[1] = window.innerWidth - bounding.right;
			if (bounding.bottom > window.innerHeight) adjustment[0] = window.innerHeight - bounding.bottom;
			if (bounding.left < 0) adjustment[1] = -bounding.left;
			if (bounding.top < 0) adjustment[0] = -bounding.top;
			if (adjustment[0] || adjustment[1]) {
				let top = parseFloat(tooltipWrapper.style.top),
					left = parseFloat(tooltipWrapper.style.left);
				top += adjustment[0];
				left += adjustment[1];
				tooltipWrapper.style.top = top + "px";
				tooltipWrapper.style.left = left + "px";
			}
		}
	}

	useListen("app:showTooltip", e => {
		if (isMobile()) return; // 触摸屏不要显示工具提示。
		const tooltip = e as TooltipEventWithPosition;
		tooltip.position = getPosition(e);
		tooltipList.push(tooltip);
		adjustPosition();
	});

	useListen("app:hideTooltip", element => {
		for (let i = tooltipList.length - 1; i >= 0; i--)
			if (tooltipList[i].element === element)
				arrayRemoveAt(tooltipList, i);
	});

	useListen("app:updateTooltip", e => {
		if (isMobile()) return;
		for (let i = tooltipList.length - 1; i >= 0; i--)
			if (tooltipList[i].element === e.element) {
				const tooltip = tooltipList[i];
				const newValue = e as TooltipEventWithPosition;
				tooltip.title = newValue.title;
				tooltip.position = newValue.position = getPosition(e);
			}
		adjustPosition();
	});

	useListen("app:refreshTooltip", map => {
		const symbols = [...map.values()].map(value => value.symbol);
		for (let i = tooltipList.length - 1; i >= 0; i--)
			if (!symbols.includes(tooltipList[i].symbol))
				arrayRemoveAt(tooltipList, i);
	});
</script>

<template>
	<ClientOnlyTeleport to="#popovers">
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
	</ClientOnlyTeleport>
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
			@include radius-small;
			@include dropdown-flyouts;
			flex-shrink: 0;
			max-width: 50dvw;
			padding: 8px 10px;
			color: c(text-color);
			word-wrap: break-word; // 尽量保持单词完整，一行都展示不下这个单词就会换行。
			overflow-wrap: break-word; // word-wrap 别名，CSS3 属性，都写上，万一以后 word-wrap 去掉了呢。
			background-color: c(acrylic-bg, 75%);
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
