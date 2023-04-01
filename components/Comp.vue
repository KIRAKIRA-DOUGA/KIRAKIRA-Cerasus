<script lang="tsx">
	import { MaybeRef } from "@vueuse/shared";

	export default ((props, { slots }) => {
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
		if (className === "") console.log(instance);
		return <kira-component ref={props.dom} class={className}>{slots.default?.()}</kira-component>;
	}) as VueJsx<{
		/** 对根节点真实 DOM 的引用。 */
		dom: MaybeRef<HTMLElement>;
	}> as JSX.IntrinsicElements["section"];
</script>
