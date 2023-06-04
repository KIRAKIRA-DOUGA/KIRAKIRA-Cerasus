/*!
 * 使用 `v-tooltip`，为元素添加自定义的工具提示。
 */

export type VTooltipBindingValue = string | {
	title: string;
	placement?: "top" | "right" | "bottom" | "left";
	offset?: number;
};

export type TooltipEvent = Exclude<VTooltipBindingValue, string> & {
	element: HTMLElement;
	symbol: symbol;
};

export default defineNuxtPlugin(nuxt => {
	type D = Directive<HTMLElement, VTooltipBindingValue>;
	const elementBinding = new Map<HTMLElement, { value: VTooltipBindingValue; symbol: symbol }>();
	const createEvent = (element: HTMLElement) => {
		const binding = elementBinding.get(element)!;
		const value = binding.value;
		const usingDefault = typeof value === "string";
		return {
			title: usingDefault ? value : value.title,
			element,
			placement: usingDefault ? undefined : value.placement,
			offset: usingDefault ? undefined : value.offset,
		} as TooltipEvent;
	};
	const setElementBinding = (element: HTMLElement, value: VTooltipBindingValue) => {
		const mapValue = elementBinding.get(element);
		if (!mapValue) elementBinding.set(element, { value, symbol: Symbol(element.id) });
		else mapValue.value = value;
	};
	const refresh = () => useEvent("app:refreshTooltip", elementBinding);
	nuxt.vueApp.directive("tooltip", {
		mounted(element, binding) {
			setElementBinding(element, binding.value);
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
			setElementBinding(element, binding.value);
			if (!binding.value || !elementBinding.has(element)) useEvent("app:hideTooltip", element);
			else useEvent("app:updateTooltip", createEvent(element));
			refresh();
		},
	} as D);
});
