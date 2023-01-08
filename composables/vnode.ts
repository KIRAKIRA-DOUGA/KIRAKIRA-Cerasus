import { ComponentInternalInstance, VNode } from "vue";

export function useRender(render: () => VNode): void {
	const vm = getCurrentInstance();
	if (!vm) throw new Error("[useRender] must be called from inside a setup function");
	// @ts-ignore
	vm.render = render;
}

export type VueJsx<Props, Emits, Slots = { default: VNode }> = (props: Props, context: {
	attrs: object;
	slots: Slots;
	emit: Emits;
	expose: Function;
}) => JSX.Element;

export function getParent<T extends ComponentInternalInstance>() {
	return getCurrentInstance()?.parent as T | null || null;
}
