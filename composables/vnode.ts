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
export function useParentScopeId() {
	return getCurrentInstance()?.vnode.scopeId;
}

/**
 * 获取当前组件的作用域样式 ID。
 * @remarks 疑似在发行版中不可使用。
 * @returns 当前组件的作用域样式 ID。
 * 如果当前组件没有作用域样式 ID，返回 undefined；如果该函数不在 setup 时期调用，返回 null。
 */
export function useScopeId() {
	return getScopeIdFromInstance(getCurrentInstance());
}

/**
 * 通过 Scope ID 来获取父组件。
 * @returns 父组件或 null（如果没有）。
 */
export function useParentByScopeId() {
	const instance = getCurrentInstance();
	if (!instance) return null;
	if ("ctx" in instance.vnode)
		return instance.vnode.ctx as ComponentInternalInstance;
	const scopeId = instance.vnode.scopeId;
	if (!scopeId) return null;
	let parent = instance.parent;
	while (!(!parent || getScopeIdFromInstance(parent) === scopeId))
		parent = parent.parent;
	return parent;
}

/**
 * 从实例获取组件的 Scope ID。
 * @remarks 疑似在发行版中不可使用。
 * @param instance - 组件内部实例。
 * @returns 组件的 Scope ID。
 */
export function getScopeIdFromInstance(instance: ComponentInternalInstance | null) {
	if (!instance) return null;
	const scopeIdInProxy = instance.proxy?.$options.__scopeId;
	if (scopeIdInProxy) return scopeIdInProxy;
	if (!(instance.type instanceof Object && "__scopeId" in instance.type)) return undefined;
	return instance.type.__scopeId as string;
}
