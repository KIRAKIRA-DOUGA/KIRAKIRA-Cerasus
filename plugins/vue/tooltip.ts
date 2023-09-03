/*
 * 使用 `v-tooltip`，为元素添加自定义的工具提示。
 */

type VTooltipBindingValueNoPlain = {
	title?: string;
	placement?: Placement;
	offset?: number;
};

export type VTooltipBindingValue = VTooltipBindingValueNoPlain | string | undefined;

export type TooltipEvent = VTooltipBindingValueNoPlain & {
	element: HTMLElement;
	symbol: symbol;
};

export default defineNuxtPlugin(nuxt => {
	type D = Directive<HTMLElement, VTooltipBindingValue>;
	const elementBinding = new WeakMap<HTMLElement, { value: VTooltipBindingValueNoPlain; symbol: symbol }>();
	const createEvent = (element: HTMLElement) => {
		const binding = elementBinding.get(element)!;
		const { value, symbol } = binding;
		return { ...value, element, symbol } as TooltipEvent;
	};
	const isPlacement = (arg?: string): arg is Placement => ["top", "right", "bottom", "left", "x", "y"].includes(arg!);
	const setElementBinding = (element: HTMLElement, _value: VTooltipBindingValue, arg?: string) => {
		const mapValue = elementBinding.get(element);
		const value = typeof _value === "object" ? _value : { title: _value };
		if (isPlacement(arg)) value.placement ??= arg;
		if (!mapValue) elementBinding.set(element, { value, symbol: Symbol(element.id) });
		else mapValue.value = value;
	};
	const refresh = () => useEvent("component:refreshTooltip", elementBinding);
	nuxt.vueApp.directive("tooltip", {
		mounted(element, binding) {
			setElementBinding(element, binding.value, binding.arg);
			addEventListeners(element, "mouseenter", "focusin", () => {
				if (!elementBinding.has(element)) return;
				useEvent("component:showTooltip", createEvent(element));
			});
			addEventListeners(element, "mouseleave", "focusout", () => {
				useEvent("component:hideTooltip", element);
				refresh();
			});
		},
		unmounted(element) {
			elementBinding.delete(element);
			refresh();
		},
		updated(element, binding) {
			setElementBinding(element, binding.value, binding.arg);
			if (!binding.value || !elementBinding.has(element)) useEvent("component:hideTooltip", element);
			else useEvent("component:updateTooltip", createEvent(element));
			refresh();
		},
	} as D);
});

/**
 * 根据给定的工具提示方向和偏移值，获取工具提示的定位值。
 * @param rect - 目标元素尺寸矩形。
 * @param placement - 浮窗出现方向。
 * @param offset - 与目标元素距离偏移。
 * @param flyoutRect - 浮窗元素尺寸矩形。
 * @param adjustBySize - 如否则只返回该点位置（默认）；是则根据元素尺寸调整到其左上角的坐标。
 * @returns 表示工具提示位置的样式属性值。
 */
export function getPosition(rect: MaybeRef<DOMRect | Element>, placement?: Placement, offset: number = 10, flyoutRect?: MaybeRef<DOMRect | Element | TwoD | undefined>) {
	rect = toValue(rect);
	flyoutRect = toValue(flyoutRect);
	if (rect instanceof Element) rect = rect.getBoundingClientRect();
	if (!placement || placement === "x" || placement === "y") { // 如果缺省工具提示放置位置，则会寻找离页边最远的方向。
		const toPageDistance = [rect.top, window.innerHeight - rect.bottom, window.innerWidth - rect.right, rect.left];
		if (placement === "x") toPageDistance[0] = toPageDistance[1] = -Infinity;
		else if (placement === "y") toPageDistance[2] = toPageDistance[3] = -Infinity;
		const placements = ["top", "bottom", "right", "left"] as const; // 优先顺序：上、下、右、左。
		placement = placements[toPageDistance.indexOf(Math.max(...toPageDistance))];
	}
	let position: TwoD;
	if (placement === "top")
		position = [rect.left + rect.width / 2, rect.top - offset];
	else if (placement === "bottom")
		position = [rect.left + rect.width / 2, rect.bottom + offset];
	else if (placement === "left")
		position = [rect.left - offset, rect.top + rect.height / 2];
	else
		position = [rect.right + offset, rect.top + rect.height / 2];
	if (flyoutRect) {
		if (flyoutRect instanceof Element) flyoutRect = flyoutRect.getBoundingClientRect();
		else if (flyoutRect instanceof Array) flyoutRect = { width: flyoutRect[0], height: flyoutRect[1] } as DOMRect;
		if (placement === "top")
			position = [position[0] - flyoutRect.width / 2, position[1] - flyoutRect.height];
		else if (placement === "bottom")
			position = [position[0] - flyoutRect.width / 2, position[1]];
		else if (placement === "left")
			position = [position[0] - flyoutRect.width, position[1] - flyoutRect.height / 2];
		else
			position = [position[0], position[1] - flyoutRect.height / 2];
	}
	return {
		position,
		style: { left: position[0] + "px", top: position[1] + "px" } as CSSProperties,
		placement,
		offset,
	};
}

/**
 * 根据给定的工具提示方向和偏移值，获取工具提示的定位值。
 * @param e - 工具提示事件。
 * @returns 表示工具提示位置的样式属性值。
 */
export function getPositionByEvent(e: TooltipEvent) {
	const position = getPosition(e.element, e.placement, e.offset);
	e.placement = position.placement;
	e.offset = position.offset;
	return position.style;
}
