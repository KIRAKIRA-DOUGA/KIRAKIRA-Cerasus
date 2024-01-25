<docs>
	将传入字符串中的 `\n` 自动转为 `<br />`，以保留换行符。
</docs>

<script lang="tsx">
	export default defineComponent({
		render() {
			const slot = this.$slots.default?.() ?? "";
			const result: typeof slot = [];
			for (const node of slot)
				if (typeof node === "string" || typeof node.type === "symbol" && node.type.description === "v-txt" && typeof node.children === "string") {
					const text = typeof node === "string" ? node : node.children as string;
					const lines = text.split("\n");
					lines.forEach((line, index) => {
						result.push(line as never);
						if (index !== lines.length - 1) result.push(<br />);
					});
				} else result.push(node);
			return result;
		},
	});
</script>
