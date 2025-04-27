<docs>
	允许你在 i18n 的字符串插值中插入其它组件。

	### 使用例

	语言字符串声明：
	```json
	{
		"contact_me": "欢迎拨打{phone}联系我！",
		"my_phone": "我的电话",
	}
	```

	Vue 模板使用：
	```vue
	<TransInterpolation :i18nKey="t.contact_me">
		<template #phone>
			<a :href="`tel:${myPhoneNumber}`">{{ t.my_phone }}</a>
		</template>
	</TransInterpolation>
	```

	最终渲染：
	```html
	欢迎拨打<a href="tel:12345678">我的电话</a>联系我！
	```
</docs>

<script lang="tsx">
	const tagStart = String.fromCodePoint(0xe0000), tagCancel = String.fromCodePoint(0xe007f);

	function encodeKeyToTag(key: number) {
		return tagStart + Array.from(key.toString(), char => String.fromCodePoint(char.codePointAt(0)! + 0xe0000)).join("") + tagCancel;
	}

	function decodeKeyFromTag(tag: string) {
		const matched = tag.match(new RegExp(`${tagStart}(.*)${tagCancel}`, "u"))?.[1];
		if (matched == null) return null;
		return parseInt(Array.from(matched, char => String.fromCodePoint(char.codePointAt(0)! - 0xe0000)).join(""), 10);
	}

	function wrapIfNotArray<T>(maybeArray: T): T extends Any[] ? T : T[] {
		return (Array.isArray(maybeArray) ? maybeArray : [maybeArray]) as never;
	}

	function interpose<T, TSeparator>(array: T[], separators: (index: number, previous: T, array: T[]) => TSeparator | TSeparator[]): (T | TSeparator)[];
	function interpose<T, TSeparator>(array: T[], ...separators: TSeparator[]): (T | TSeparator)[];
	function interpose<T>(array: T[], ...separators: unknown[]) {
		const getSeparators = separators.length === 1 && typeof separators[0] === "function" ? separators[0] as Function : undefined;
		return array.reduce((result, current, index) => (result.push(...[...index ? getSeparators ? wrapIfNotArray(getSeparators(index, current, array)) : separators : [], current]), result), [] as T[]);
	};

	export default defineComponent({
		props: {
			/**
			 * i18n 键，必须以 `t.` 开头。
			 */
			i18nKey: {
				type: Function as never as PropType<string & Function>,
				required: true,
			},
		},
		render() {
			const interpolations = this.$slots;
			const keys = Object.keys(interpolations);
			const withInterpolations = arrayMapObject(keys, (key, index) => [key, encodeKeyToTag(index)] as const);
			const translatedString: string = this.i18nKey(withInterpolations).toString();
			const lines = translatedString.split("\n");
			const split = interpose(lines
				.map((line, lineIndex) => line
					.split(new RegExp(`(${tagStart}.*?${tagCancel})`, "u"))
					.map((segment, segmentIndex) => {
						if (!segment.startsWith(tagStart)) return segment;
						const index = decodeKeyFromTag(segment);
						if (index == null) return "";
						const key = keys[index];
						let node = interpolations[key];
						return node?.();
					}),
				), i => <br key={`br-${i}`} />);
			return split;
		},
	});
</script>
