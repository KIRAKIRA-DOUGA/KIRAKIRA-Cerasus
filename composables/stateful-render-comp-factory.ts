// 参考：vue 中如何获取插槽的 dom 对象
// https://free_pan.gitee.io/freepan-blog/articles/05-vue3/vue3-杂项/vue中如何获取插槽的dom对象.html

type VNodeEl = ComponentPublicInstance & { vnode: VNode[] };
type CallFun = (vnodeEl: VNodeEl) => void;
interface RenderCallbackObj {
	/**
	 * 自定义 mounted 回调。
	 */
	mountedCallFun?: CallFun;
	/**
	 * 自定义 updated 回调。
	 */
	updatedCallFun?: CallFun;
	/**
	 * 自定义 unmounted 回调。
	 */
	unmountedCallFun?: CallFun;
}
export const useCustomFactory = ({ mountedCallFun, updatedCallFun, unmountedCallFun }: RenderCallbackObj) => {
	return defineComponent({
		props: {
			vnode: {
				type: Array as PropType<VNode[]>,
				required: true,
			},
		},
		mounted() {
			// 这个 this.$el 就代表当前 vnode 的 dom 对象
			mountedCallFun?.(this);
		},
		updated() {
			updatedCallFun?.(this);
		},
		unmounted() {
			unmountedCallFun?.(this);
		},
		render(props: { vnode: VNode }) {
			return props.vnode;
		},
	});
};
const findChildren = (vnodes: VNode[], type: unknown) => {
	const children = [] as VNode[];
	for (const child of vnodes)
		if (child.type === type) children.push(child);
		else if (child.children instanceof Array) children.push(...findChildren(child.children as VNode[], type));
	return children;
};
/**
 * 渲染插槽节点。
 * @param type - 子组件类型筛选。
 * @param slotName - 插槽名称。留空表示 default 插槽。
 * @returns 插槽组件，和子节点引用。
 */
export const useFactory = (type: unknown = undefined, slotName: string = "default") => {
	const vnodeEl = ref<Parameters<CallFun>[0]>();
	const children = ref<VNode[]>([]);
	const RenderComp = useCustomFactory({
		mountedCallFun: e => {
			vnodeEl.value = e;
			if (type) children.value = findChildren(e.vnode, type);
		},
		unmountedCallFun: _e => {
			vnodeEl.value = undefined;
			children.value = [];
		},
	});
	const slot = useSlots()[slotName];
	const Slot = slot ? h(RenderComp, { vnode: slot() }) as Object : undefined;
	return { RenderComp, Slot, children, vnodeEl };
};
