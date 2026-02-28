<docs>
	允许你在 i18n 的字符串插值中插入其它组件。

	基于 Vue I18n 官方的 `<I18nT>` 组件对项目进行适配。
</docs>

<script lang="tsx">
	import type { RemovedIndexResources, JsonPaths } from "@intlify/core-base";
	import type { DefineLocaleMessage } from "@nuxtjs/i18n/dist/runtime/composables";

	type KeyPath = JsonPaths<{
		[K in keyof RemovedIndexResources<DefineLocaleMessage>]: RemovedIndexResources<DefineLocaleMessage>[K]
	}>;

	export default defineComponent({
		inheritAttrs: false,
		props: {
			/** i18n 键。 */
			keypath: {
				type: String as PropType<KeyPath>,
				required: true,
			},
		},
		render() {
			// 直接写 `this.$slots` 会返回 Proxy 不能正常渲染，只能浅复制一次才行。
			return <I18nT keypath={this.$props.keypath} scope="global">{{ ...this.$slots }}</I18nT>;
		},
	});
</script>
