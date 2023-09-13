<docs>
	# 多标签编辑器
</docs>

<script setup lang="ts">
	const tags = defineModel<string[]>({ default: [] });
	const tagsWithKey = reactive<Map<number, string>>(new Map());
	const tagsWithKeyProxy = new Proxy({}, {
		get(_target, prop) {
			const key = convertKeyToNumber(prop);
			if (!Number.isFinite(key)) return;
			return tagsWithKey.get(key);
		},
		set(_target, prop, value) {
			const key = convertKeyToNumber(prop);
			if (!Number.isFinite(key)) return false;
			tagsWithKey.set(key, value);
			return true;
		},
	}) as Record<number, string>;
	const isUpdatingTags = ref(false);
	const maxIndex = computed(() => {
		let maxIndex = Math.max(...tagsWithKey.keys());
		if (maxIndex === -Infinity) maxIndex = -1;
		return maxIndex;
	});

	watch(tags, async curTags => {
		if (isUpdatingTags.value) return;
		isUpdatingTags.value = true;
		tags.value = normalizeTags(curTags);
		tagsWithKey.clear();
		curTags.forEach((tag, index) => tagsWithKey.set(index, tag));
		appendEmptyTag();
		await nextTick();
		isUpdatingTags.value = false;
	}, { deep: true, immediate: true });

	/**
	 * 更新标签项目。
	 * @param index - 标签索引值。
	 */
	async function updateTags(index: number) {
		isUpdatingTags.value = true;
		const tag = tagsWithKey.get(index);
		if (!tag) {
			if (index !== maxIndex.value)
				tagsWithKey.delete(index);
		} else {
			const normalizedTag = normalizeTag(tag);
			let duplicated = false;
			for (const [i, curTag] of tagsWithKey) {
				if (i === index) continue;
				if (curTag === normalizedTag) {
					duplicated = true;
					useToast(t.toast.duplicate_label, "warning");
					break;
				}
			}
			if (!duplicated) tagsWithKey.set(index, normalizedTag);
			else tagsWithKey.delete(index);
		}
		tags.value = normalizeTags();
		appendEmptyTag();
		await nextTick();
		isUpdatingTags.value = false;
	}

	/**
	 * 规范化单个标签。
	 * @param tag - 标签。
	 * @returns 规范化后的标签。
	 */
	function normalizeTag(tag: string) {
		return tag.trim().replace(/[\r\n\t\v]/g, "").replace(/\s+/g, " ");
	}

	/**
	 * 规范化标签数组。
	 * @param tags - 标签数组。
	 * @returns 规范化后的新的标签数组。
	 */
	function normalizeTags(tags?: string[]) {
		tags ??= [...tagsWithKey.values()];
		return arrayToRemoveDuplicates(tags.map(normalizeTag).filter(tag => tag));
	}

	/**
	 * 将无用的符号键名过滤掉。
	 * @param key - 键。
	 * @returns 转换成的数字类型。
	 */
	function convertKeyToNumber(key: string | number | symbol) {
		if (typeof key === "symbol") return NaN;
		return +key;
	}

	/**
	 * 在数组末尾增加一个空的标签提示用户可新增标签。
	 */
	function appendEmptyTag() {
		if (tagsWithKey.get(maxIndex.value)?.trim() !== "")
			tagsWithKey.set(maxIndex.value + 1, "");
	}

	/**
	 * 在离开过渡开始时调用。
	 * 用这个来开始离开动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onTagLeave(el: Element, done: () => void) {
		await delay(250);
		await animateSize(el, null, { endWidth: 0, endStyle: { marginLeft: "-8px" }, specified: "width" });
		done();
	}
</script>

<template>
	<Comp class="tags">
		<TransitionGroup @leave="onTagLeave">
			<Tag
				v-for="[key, tag] in tagsWithKey"
				:key="key"
				v-model:input="tagsWithKeyProxy[key]"
				:placeholder="t.press_enter_to_add"
				@change="updateTags(key)"
			>{{ tag }}</Tag>
		</TransitionGroup>
	</Comp>
</template>

<style scoped lang="scss">
	.tags {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;

		.tag {
			&.v-enter-from,
			&.v-leave-to {
				scale: 0.7;
				opacity: 0;
			}

			&.v-leave-active {
				white-space: nowrap;
			}
		}
	}
</style>
