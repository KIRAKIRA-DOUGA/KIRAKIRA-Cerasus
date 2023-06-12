<script lang="tsx">
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
				let componentName = parent?.type.__name;
				if (!componentName) {
					// 注意该块内容无法在生产环境下运行。暂时没有更好的解决方法，有待优化。
					const componentPath = parent?.type.__file;
					if (!componentPath) break;
					componentName = filenameWithoutExtension(componentPath);
				}
				if (!componentName) break;
				className = new VariableName(componentName).kebab;
			} while (false);
			const label = new VariableName(className).words;
			return { className, label };
		},
		render() {
			return (
				<kira-component tabindex={this.tabindex} class={this.className} aria-label={this.label}>
					{this.$slots.default?.()}
				</kira-component>
			);
		},
	});

	type OnToAt<T> = T extends `on${infer U}` ? `@${Lowercase<U>}` : never;
	type OnEvents = { [event in keyof Events as OnToAt<event>]?: (payload: Events[event]) => void; };
	export default comp as typeof comp & JSX.IntrinsicElements["section"] & OnEvents;
</script>
