import { ComponentInternalInstance, ConcreteComponent, VNode } from "vue";

export type VueJsx<Props, Emits, Slots = { default: VNode }> = (props: Props, context: {
	attrs: object;
	slots: Slots;
	emit: Emits;
	expose: Function;
}) => JSX.Element;

/**
 * 获取父组件。
 * @param type - 父组件的类型筛选。
 * @returns 父组件或 null（如果没有）。
 */
export function getParent<T extends ComponentInternalInstance>(type?: ConcreteComponent | unknown) {
	let parent = getCurrentInstance()?.parent;
	while (!(!parent || type === undefined || parent.type === type))
		parent = parent.parent;
	return parent as T | null || null;
}
