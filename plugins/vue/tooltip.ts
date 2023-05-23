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
};

export default defineNuxtPlugin(nuxt => {
	type D = Directive<HTMLElement, VTooltipBindingValue>;
	const createEvent: DirectiveEffectHook<D, TooltipEvent> = (element, binding) => {
		const _binding = binding.value;
		const usingDefault = typeof _binding === "string";
		return {
			title: usingDefault ? _binding : _binding.title,
			element,
			placement: usingDefault ? undefined : _binding.placement,
			offset: usingDefault ? undefined : _binding.offset,
		};
	};
	nuxt.vueApp.directive("tooltip", {
		mounted(element, binding) {
			element.addEventListener("mouseenter", () => {
				if (!binding.value) return;
				useEvent("app:showTooltip", createEvent(element, binding));
			});
			element.addEventListener("mouseleave", () => {
				useEvent("app:hideTooltip", element);
			});
		},
		updated(element, binding) {
			if (!binding.value) useEvent("app:hideTooltip", element);
			else useEvent("app:updateTooltip", createEvent(element, binding));
		},
	} as D);
});
