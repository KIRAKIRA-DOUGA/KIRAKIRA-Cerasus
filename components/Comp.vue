<script lang="tsx">
	const dom = ref<HTMLElement>();

	const comp = defineComponent({
		props: {
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
				const parent = useParentByScopeId();
				const componentPath = parent?.type.__file;
				if (!componentPath) break;
				const componentName = filenameWithoutExtension(componentPath);
				if (!componentName) break;
				className = new VariableName(componentName).kebab;
			} while (false);
			return { className, dom };
		},
		render() {
			return (
				<kira-component ref={dom} tabindex={this.$props.tabindex} class={this.className}>
					{this.$slots.default?.()}
				</kira-component>
			);
		},
	});

	type OnToAt<T> = T extends `on${infer U}` ? `@${Lowercase<U>}` : never;
	type OnEvents = { [event in keyof Events as OnToAt<event>]?: (payload: Events[event]) => void; };
	export default comp as typeof comp & JSX.IntrinsicElements["section"] & OnEvents;
</script>
