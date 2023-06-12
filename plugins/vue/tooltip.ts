/*
 * 使用 `v-tooltip`，为元素添加自定义的工具提示。
 */

type Placement = "top" | "right" | "bottom" | "left";

export type VTooltipBindingValue = string | {
	title: string;
	placement?: Placement;
	offset?: number;
};

type VTooltipBindingValueNoPlain = Exclude<VTooltipBindingValue, string>;

export type TooltipEvent = VTooltipBindingValueNoPlain & {
	element: HTMLElement;
	symbol: symbol;
};

export default defineNuxtPlugin(nuxt => {
	type D = Directive<HTMLElement, VTooltipBindingValue>;
	const elementBinding = new Map<HTMLElement, { value: VTooltipBindingValueNoPlain; symbol: symbol }>();
	const createEvent = (element: HTMLElement) => {
		const binding = elementBinding.get(element)!;
		const value = binding.value;
		return {
			...value,
			element,
		} as TooltipEvent;
	};
	const isPlacement = (arg?: string): arg is Placement => ["top", "right", "bottom", "left"].includes(arg!);
	const setElementBinding = (element: HTMLElement, _value: VTooltipBindingValue, arg?: string) => {
		const mapValue = elementBinding.get(element);
		const value = typeof _value !== "string" && typeof _value !== "function" ? _value : { title: _value };
		if (isPlacement(arg)) value.placement ??= arg;
		if (!mapValue) elementBinding.set(element, { value, symbol: Symbol(element.id) });
		else mapValue.value = value;
	};
	const refresh = () => useEvent("app:refreshTooltip", elementBinding);
	nuxt.vueApp.directive("tooltip", {
		mounted(element, binding) {
			setElementBinding(element, binding.value, binding.arg);
			addEventListeners(element, "mouseenter", "focusin", () => {
				if (!binding.value || !elementBinding.has(element)) return;
				useEvent("app:showTooltip", createEvent(element));
			});
			addEventListeners(element, "mouseleave", "focusout", () => {
				useEvent("app:hideTooltip", element);
				refresh();
			});
		},
		unmounted(element) {
			elementBinding.delete(element);
			refresh();
		},
		updated(element, binding) {
			setElementBinding(element, binding.value, binding.arg);
			if (!binding.value || !elementBinding.has(element)) useEvent("app:hideTooltip", element);
			else useEvent("app:updateTooltip", createEvent(element));
			refresh();
		},
	} as D);
});
