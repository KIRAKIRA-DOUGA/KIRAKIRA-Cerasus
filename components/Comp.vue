<script lang="tsx">
	const comp = defineComponent({
		props: {
			/**
			 * 对根节点真实 DOM 的引用。
			 *
			 * 相当于原生的 ref，但是如果用 ref 的话会引用到这个组件，因此添加一个 dom 属性来引用真实 DOM。
			 */
			dom: {
				type: Object as PropType<HTMLElement>,
				default: undefined,
			},
			/**
			 * 指示其元素是否可以聚焦，以及它是否/在何处参与顺序键盘导航。
			 *
			 * 因为标签透传功能似乎不支持该标签，因此手动添加一个属性来实现。
			 */
			tabindex: {
				type: [Number, String] as PropType<Numberish>,
				default: undefined,
			},
		},
		setup() {
			const instance = getCurrentInstance();
			let className = "";
			do {
				if (!instance) break;
				let componentPath: string | undefined;
				if ("ctx" in instance.vnode) {
					// WARN: 在发行版中，ctx 属性会被删除，因此该代码仅能在开发版中使用。
					const ctx = instance.vnode.ctx as ComponentInternalInstance;
					componentPath = ctx.type.__file;
				} else componentPath = instance.parent?.type.__file;
				if (!componentPath) break;
				const componentName = filenameWithoutExtension(componentPath);
				if (!componentName) break;
				className = new VariableName(componentName).kebab;
			} while (false);
			return { className };
		},
		render() {
			return (
				<kira-component ref={this.$props.dom} tabindex={this.$props.tabindex} class={this.className}>
					{this.$slots.default?.()}
				</kira-component>
			);
		},
	});
	type OnToAt<T> = T extends `on${infer U}` ? `@${Lowercase<U>}` : never;
	type OnEvents = { [event in keyof Events as OnToAt<event>]?: (payload: Events[event]) => void; };
	export default comp as typeof comp & JSX.IntrinsicElements["section"] & OnEvents;
</script>
