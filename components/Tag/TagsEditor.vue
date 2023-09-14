<docs>
	# 多标签编辑器
</docs>

<script setup lang="ts">
	/** 指定默认的标签值，如为 null 表示未设定默认值，如为 undefined 表示当前组件不适用默认值。 */
	const def = defineModel<string | null | undefined>("default");
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
	const tagsWithKeySorted = computed(() =>
		[...tagsWithKey.entries()].sort((a, b) =>
			a[1] === def.value ? -1 : b[1] === def.value ? 1 : a[0] - b[0]));
	const isUpdatingTags = ref(false);
	const maxIndex = computed(() => {
		let maxIndex = Math.max(...tagsWithKey.keys());
		if (maxIndex === -Infinity) maxIndex = -1;
		return maxIndex;
	});
	const contextualToolbar = ref<FlyoutModel>();
	const hoveredTagContent = ref<[number, string]>();
	const hideExceptMe = ref(false);
	const hideTimeoutId = ref<Timeout>();

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
	 * @param value - 可在此直接设值。
	 */
	async function updateTags(index: number, value?: string) {
		if (index === undefined) return;
		isUpdatingTags.value = true;
		const tag = value ?? tagsWithKey.get(index);
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
		contextualToolbar.value = undefined;
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

	/**
	 * 将某个标签设为默认值（如果允许）。
	 */
	function setToDefault() {
		const tag = hoveredTagContent.value?.[1];
		if (def.value === undefined || !tag) return;
		def.value = tag;
		contextualToolbar.value = undefined;
	}

	const a = ref();
	/**
	 * 显示标签的上下文工具栏。
	 * @param key - 标签键名。
	 * @param tag - 标签内容。
	 * @param e - 鼠标事件。
	 */
	function showContextualToolbar(key: number, tag: string, e: MouseEvent) {
		if (!tag) return;
		if ((e.currentTarget as HTMLSpanElement).querySelector(".text-box:focus")) return;
		reshowContextualToolbar();
		if (hoveredTagContent.value?.[0] === key && hoveredTagContent.value?.[1] === tag) return;
		hoveredTagContent.value = [key, tag];
		hideExceptMe.value = true;
		useEvent("component:hideAllContextualToolbar");
		hideExceptMe.value = false;
		contextualToolbar.value = [e, "top", 0];
	}

	/**
	 * 隐藏标签的上下文工具栏。
	 */
	function hideContextualToolbar() {
		hideTimeoutId.value = setTimeout(() => {
			contextualToolbar.value = undefined;
			hoveredTagContent.value = undefined;
		}, 100);
	}

	/**
	 * 鼠标移入区域，取消自动隐藏。
	 */
	function reshowContextualToolbar() {
		clearTimeout(hideTimeoutId.value);
	}

	useListen("component:hideAllContextualToolbar", () => {
		if (hideExceptMe.value) return;
		contextualToolbar.value = undefined;
	});
</script>

<template>
	<Comp class="tags">
		<TransitionGroup @leave="onTagLeave">
			<Tag
				v-for="[key, tag] in tagsWithKeySorted"
				:key="key"
				v-model:input="tagsWithKeyProxy[key]"
				:placeholder="t.press_enter_to_add"
				:checked="def === tag"
				@change="updateTags(key)"
				@mouseenter="e => showContextualToolbar(key, tag, e)"
				@mouseleave="hideContextualToolbar"
			>{{ tag }}</Tag>
		</TransitionGroup>

		<Flyout
			v-if="def !== undefined"
			ref="a"
			v-model="contextualToolbar"
			noPadding
			class="contextual-toolbar"
			@mouseenter="reshowContextualToolbar"
			@mouseleave="hideContextualToolbar"
		>
			<Button v-if="hoveredTagContent?.[1] !== def" icon="check" @click="setToDefault()">{{ t.set_as_default }}</Button>
			<Button icon="close" @click="updateTags(hoveredTagContent![0], '')">{{ t.delete }}</Button>
		</Flyout>
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

	.contextual-toolbar {
		button {
			--appearance: tertiary;
		}
	}
</style>
