/**
 * 在组合式 API 定义 render 函数，比如返回特定的 JSX。
 * @param render - 指定渲染函数，比如 JSX。
 */
export default function useRender(render: () => VNode): void {
	const vm = getCurrentInstance() as ComponentInternalInstance & { render: () => VNode } | null;
	if (!vm) throw new Error("[useRender] must be called from inside a setup function");
	vm.render = render;
}

/**
 * 获取父组件。
 * @param type - 父组件的类型筛选。
 * @returns 父组件或 null（如果没有）。
 */
export function useParent<T extends ComponentInternalInstance>(type?: ConcreteComponent | unknown) {
	let parent = getCurrentInstance()?.parent;
	while (!(!parent || type === undefined || parent.type === type))
		parent = parent.parent;
	return parent as T | null || null;
}

/**
 * 获取父组件的作用域样式 ID。
 * @returns 父组件的作用域样式 ID。
 */
export function useParentScopeId() { // 简单测试后发现使用起来似乎并没有问题，等出了问题的时候再说吧。
	let parent = getCurrentInstance()?.parent;
	while (parent) {
		if ("__scopeId" in parent.type && typeof parent.type.__scopeId === "string")
			return parent.type.__scopeId;
		parent = parent.parent;
	}
	return null;
}

/**
 * 获取当前组件的作用域样式 ID。
 * @returns 当前组件的作用域样式 ID。
 * 如果当前组件没有作用域样式 ID，返回 undefined；如果该函数不在 setup 时期调用，返回 null。
 */
export function useScopeId() {
	const instance = getCurrentInstance();
	if (!instance) return null;
	if (!(instance.type instanceof Object && "__scopeId" in instance.type)) return undefined;
	return instance.type.__scopeId as string;
}
