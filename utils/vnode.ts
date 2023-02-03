import { ComponentInternalInstance, VNode } from "vue";

export type VueJsx<Props, Emits, Slots = { default: VNode }> = (props: Props, context: {
	attrs: object;
	slots: Slots;
	emit: Emits;
	expose: Function;
}) => JSX.Element;

export function getParent<T extends ComponentInternalInstance>() {
	return getCurrentInstance()?.parent as T | null || null;
}
