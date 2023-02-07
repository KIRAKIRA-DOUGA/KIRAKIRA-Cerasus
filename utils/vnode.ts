import { ComponentInternalInstance, VNode } from "vue";

export type VueJsx<Props, Emits, Slots = { default: VNode }> = (props: Props, context: {
	attrs: object;
	slots: Slots;
	emit: Emits;
	expose: Function;
}) => JSX.Element;

/**
 * 获取父组件。
 * @returns 父组件或 null（如果没有）。
 */
export function getParent<T extends ComponentInternalInstance>() {
	return getCurrentInstance()?.parent as T | null || null;
}
