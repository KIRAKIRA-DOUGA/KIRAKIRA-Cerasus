/**
 * 在组合式 API 定义 render 函数，比如返回特定的 JSX。
 * @param render - 指定渲染函数，比如 JSX。
 */
export function useRender(render: () => VNode): void {
	const vm = getCurrentInstance() as ComponentInternalInstance & { render: () => VNode } | null;
	if (!vm) throw new Error("[useRender] must be called from inside a setup function");
	vm.render = render;
}

/**
 * 获取父组件。
 * @remarks 如果使用该函数，在修改该组件触发热重载时，会出现组件突然消失的情况。目前只能支持通过刷新网页解决。
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
 * @remarks 疑似在发行版中在某些极端情况下可能无法正常使用。
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
 * @remarks 疑似在发行版中在某些极端情况下可能无法正常使用。
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

/**
 * 在 defineModel 同时兼容绑定一个单向绑定的布尔属性。
 * @param model - 双向绑定布尔模型。
 * @param oneWayProp - 调用单向兼容绑定布尔属性的函数，不建议直接传递变量否则会失去绑定除非是常量。
 * @returns 一个计算属性，修改时与直接用模型一致，读取时如果模型获取到 undefined，则会调用单向绑定属性的值。如果还是
 * undefined 则会自动转换为 false。
 */
export function withOneWayProp(model: Ref<boolean | undefined>, oneWayProp: TypeOrReturnToType<boolean | undefined>): WritableComputedRef<boolean>;
/**
 * 在 defineModel 同时兼容绑定一个单向绑定的属性。
 * @param model - 双向绑定模型。
 * @param oneWayProp - 调用单向兼容绑定属性的函数，不建议直接传递变量否则会失去绑定。
 * @returns 一个计算属性，修改时与直接用模型一致，读取时如果模型获取到 undefined，则会调用单向绑定属性的值。
 */
export function withOneWayProp<T>(model: Ref<T | undefined>, oneWayProp: TypeOrReturnToType<T>): WritableComputedRef<T>;
/**
 * 在 defineModel 同时兼容绑定一个单向绑定的属性。
 * @param model - 双向绑定模型。
 * @param oneWayProp - 调用单向兼容绑定属性的函数，不建议直接传递变量否则会失去绑定。
 * @returns 一个计算属性，修改时与直接用模型一致，读取时如果模型获取到 undefined，则会调用单向绑定属性的值。
 */
export function withOneWayProp<T>(model: Ref<T | undefined>, oneWayProp: TypeOrReturnToType<T>) {
	const result = computed({
		get: () =>
			model.value !== undefined && model.value !== null && model.value !== false ? model.value :
			typeof oneWayProp === "function" ? (oneWayProp as () => T)() : oneWayProp,
		set: value => model.value = value as T,
	});
	return result;
}

/**
 * 从可能是 Vue 组件中获取真实 DOM。
 * @param el - 组件或元素的引用。
 * @returns 真实 DOM。
 */
export function getElFromComponentInstance(el: MaybeRef<HTMLElement | ComponentPublicInstance | undefined>) {
	el = toValue(el);
	return !el ? undefined : "$el" in el ? el.$el as HTMLElement : el;
}

/**
 * 获取插槽中的子节点内容。
 * @param item - 插槽中的某一个项目。
 * @returns 插槽中的子节点内容。
 */
export function getSlotVNodeNormalizedChildren(item: VNode) {
	return (item.children as Slots).default?.()?.[0]?.children;
}

/**
 * 获取有关虚拟插槽内容的对象数组。
 * @see https://stackoverflow.com/questions/55754822 本函数受限于 TypeScript 功能的妥协，在短期内暂时无法更改为更优雅的写法。
 * @param vdoms - 插槽内容。
 * @returns 注意必须调用两次函数的括号，才能获取有关插槽内容的对象数组。
 */
export function getSlotItems<
	C,
>(
	vdoms: VNode<RendererNode, RendererElement, AnyObject>[] | undefined,
) {
	/**
	 * @param def - 指定 Props 默认值。
	 * @returns 有关插槽内容的对象数组。
	 */
	return <
		D extends Partial<Record<keyof ComponentProps<C>, unknown>> = {},
	>(
		def = {} as D,
	) => vdoms?.flatMap(item => {
		let items = [item];
		if (typeof item.type === "symbol" && item.type.description === "v-fgt" && Array.isArray(item.children))
			items = item.children as VNode[];
		return items.map(item => {
			const props = { ...item.props };
			const content = getSlotVNodeNormalizedChildren(item);
			if (typeof content !== "string") return undefined!;
			for (const [key, value] of entries(def))
				props[key] ??= value;
			props.content ??= content;
			props.id ??= content;
			type OriginalProps = ComponentProps<C> & { content: string };
			type OverrideProps = Override<OriginalProps, {
				[key in keyof D]:
					key extends keyof OriginalProps ?
					D[key] extends undefined | null ? OriginalProps[key] : NonNull<OriginalProps[key]> :
					D[key];
			}>;
			return props as Readonly<OverrideProps>;
		});
	}).filter(item => item) ?? [];
}

/**
 * 判断默认插槽中是否有内容。
 * @returns 默认插槽中是否有内容？
 */
export function hasContentInDefaultSlot() {
	return !!useSlots().default?.()?.length;
}
