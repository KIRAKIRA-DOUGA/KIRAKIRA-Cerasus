import { VNode } from "vue";

export function useRender(render: () => VNode): void {
	const vm = getCurrentInstance();
	if (!vm)
		throw new Error("[useRender] must be called from inside a setup function");
	// @ts-ignore
	vm.render = render;
}
