<script lang="tsx">
	import { NuxtLink } from "#components";

	export default defineComponent({
		inheritAttrs: false,
		props: {
			/** 超链接目标地址。 */
			to: { type: String, required: true },
			/** 是否是链接内链接？ */
			linkInLink: { type: Boolean, default: false },
			/** 是否在当前路由下显示为活跃状态？ */
			activable: { type: Boolean, default: false },
			/** 是否在新窗口打开链接？ */
			blank: { type: Boolean, default: false },
		},
		setup(props) {
			const localePath = useLocalePath();
			const parentScopeId = useParentScopeId();

			const attrs = computed(() => {
				const attrs = { ...useAttrs() }; // 注意：useAttrs 函数会引用自 attrs 的只读对象，因此必须创建一份对象拷贝。
				if (!props.activable && !props.blank)
					Object.assign(attrs, { activeClass: " ", exactActiveClass: " " }); // disableActiveClass
				else
					attrs.ariaCurrentValue = "page";
				if (props.linkInLink && parentScopeId)
					attrs[parentScopeId] = "";
				return attrs;
			});
			const href = computed(() => localePath(props.to));

			return {
				href, attrs,
			};
		},
		render() {
			const slot = this.$slots.default?.();
			let link = this.blank ?
				<a href={this.href} target="_blank" {...this.attrs}>{slot}</a> :
				<NuxtLink to={this.href} {...this.attrs}>{slot}</NuxtLink>;
			if (this.linkInLink)
				link = <object>{link}</object>;
			return link;
		},
	});
</script>
