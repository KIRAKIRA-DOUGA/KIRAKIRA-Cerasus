<docs>
	# 自定义工具提示
	不要直接使用该组件，而是使用对应的 directive 来调用。
</docs>

<script lang="ts">
	const keys = new Map<HTMLElement, symbol>();
</script>

<script setup lang="ts">
	import { TooltipEvent } from "plugins/vue/tooltip";

	type TooltipEventWithPosition = TooltipEvent & {
		position: StyleValue;
		symbol: symbol;
	};

	const tooltipList = reactive<TooltipEventWithPosition[]>([]);
	const getSymbol = (element: HTMLElement) => {
		let symbol = keys.get(element);
		if (!symbol)
			keys.set(element, symbol = Symbol(element.id));
		return symbol;
	};
	const getPosition = (e: TooltipEvent) => {
		const bounding = e.element.getBoundingClientRect();
		e.offset ??= 10;
		e.placement ||= "right";
		let style: StyleValue;
		if (e.placement === "top") style = { bottom: bounding.top - e.offset, left: bounding.left + bounding.width / 2 };
		else if (e.placement === "bottom") style = { top: bounding.bottom + e.offset, left: bounding.left + bounding.width / 2 };
		else if (e.placement === "left") style = { top: bounding.top + bounding.height / 2, right: bounding.left - e.offset };
		else style = { top: bounding.top + bounding.height / 2, left: bounding.right + e.offset };
		for (const key in style)
			if (Object.prototype.hasOwnProperty.call(style, key))
				(style as AnyObject)[key] = (style as AnyObject)[key] + "px";
		return style;
	};

	useListen("app:showTooltip", e => {
		const tooltip = e as TooltipEventWithPosition;
		tooltip.position = getPosition(e);
		tooltip.symbol = getSymbol(tooltip.element);
		tooltipList.push(tooltip);
	});

	useListen("app:hideTooltip", element => {
		for (let i = tooltipList.length - 1; i >= 0; i--)
			if (tooltipList[i].element === element)
				arrayRemoveAt(tooltipList, i);
	});

	useListen("app:updateTooltip", e => {
		for (let i = tooltipList.length - 1; i >= 0; i--)
			if (tooltipList[i].element === e.element) {
				const tooltip = tooltipList[i];
				const newValue = e as TooltipEventWithPosition;
				tooltip.position = newValue.position = getPosition(e);
			}
	});
</script>

<template>
	<ClientOnlyTeleport to="#popovers">
		<Comp>
			<TransitionGroup appear>
				<div
					v-for="tooltip in tooltipList"
					:key="tooltip.symbol"
					class="tooltip"
					:style="tooltip.position"
				>
					{{ tooltip.title }}
				</div>
			</TransitionGroup>
		</Comp>
	</ClientOnlyTeleport>
</template>

<style scoped lang="scss">
	:comp {
		display: contents;
	}

	.tooltip {
		@include radius-small;
		@include dropdown-flyouts;
		position: fixed;
		z-index: 80;
		max-width: 50ic;
		padding: 8px 10px;
		color: c(text-color);
		background-color: c(acrylic-bg, 75%);
		pointer-events: none;

		&.v-enter-from,
		&.v-leave-to {
			opacity: 0;
		}
	}
</style>
