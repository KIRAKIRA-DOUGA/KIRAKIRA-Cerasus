<docs>
	# 多标签编辑器
</docs>

<script setup lang="ts">
	/** 指定默认的标签值，如为 null 表示未设定默认值，如为 undefined 表示当前组件不适用默认值。 */
	const def = defineModel<[number, string] | null | undefined>("default");
	/** 指定标签值的原文，如为 null 表示未设定原文，如为 undefined 表示当前组件不适用原文。 */
	const editorOriginal = defineModel<[number, string] | null | undefined>("editor-original");
	/** 所有 TAG 编辑器之间共享的原文 */
	const original = defineModel<[number, string] | undefined>("original");
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
		appendEmptyTag();
		if (index === undefined) return;
		isUpdatingTags.value = true;
		const tag = value ?? tagsWithKey.get(index);
		if (!tag) { // 删除 TAG
			if (index !== maxIndex.value) {
				tagsWithKey.delete(index);
				if (hoveredTagContent.value && isDefaultTag(def.value, hoveredTagContent.value)) def.value = null;
				if (hoveredTagContent.value && isOriginalTag(original.value, hoveredTagContent.value)) {
					original.value = undefined;
					editorOriginal.value = null;
				}
			}
		} else {
			const normalizedTag = normalizeTag(tag);
			let duplicated = false;
			for (const [i, curTag] of tagsWithKey) {
				if (i === index) continue;
				if (curTag === normalizedTag) {
					duplicated = true;
					useToast(t.toast.duplicate_tag, "warning");
					break;
				}
			}
			if (!duplicated) tagsWithKey.set(index, normalizedTag);
			else tagsWithKey.delete(index);

			const text = halfwidth(normalizedTag);
			try {
				const result = await api.videoTag.searchVideoTag({ tagNameSearchKey: text });
				if (result?.success && result.result && result.result.length > 0) {
					const hasSameWithInput = checkTagUnique(text, result.result);
					if (hasSameWithInput) {
						useToast("不允许 TAG 名重复，请更换。", "warning"); // TODO: 使用多语言
						console.warn("WARN", "WARNING", "查找到重复的 TAG 名");
						tagsWithKey.delete(index);
						return;
					}
				}
			} catch (error) {
				useToast("查找重复 TAG 失败", "error"); // TODO: 使用多语言
				console.error("ERROR", "查找重复 TAG 时出错：", error);
				return;
			}
		}
		tags.value = normalizeTags();
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
		return tag.trim().replaceAll(/[\r\n\t\v]/g, "").replaceAll(/\s+/g, " ");
	}

	/**
	 * 规范化标签数组。
	 * @param tags - 标签数组。
	 * @returns 规范化后的新的标签数组。
	 */
	function normalizeTags(tags?: string[]) {
		tags ??= [...tagsWithKey.values()];
		return arrayToRemoveDuplicates(tags.map(normalizeTag).filter(Boolean));
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
		const tag = hoveredTagContent.value;
		if (tag?.[0] === undefined || tag?.[0] === null || tag[0] < 0 || !tag?.[1]) return;
		def.value = [tag[0], tag[1]];
		contextualToolbar.value = undefined;
	}

	/**
	 * 将某个标签取消默认值。
	 */
	function clearDefault() {
		def.value = null;
		contextualToolbar.value = undefined;
	}

	/**
	 * 将某个标签设为原文。
	 */
	function setToOriginal() {
		const tag = hoveredTagContent.value;
		if (tag?.[0] === undefined || tag?.[0] === null || tag[0] < 0 || !tag?.[1] || original.value) return;
		editorOriginal.value = [tag[0], tag[1]];
		original.value = [tag[0], tag[1]];
		contextualToolbar.value = undefined;
	}

	/**
	 * 将某个标签取消设为原文。
	 */
	function clearOriginal() {
		editorOriginal.value = null;
		original.value = undefined;
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

	/**
	 * 判断一个 TAG 是否为默认 TAG 并高亮。
	 * @param def 默认 TAG
	 * @param tag TAG
	 * @returns 是默认返回 true, 否则返回 false
	 */
	function isDefaultTag(def: [number, string] | null | undefined, tag: [number, string]): boolean {
		return !!(def && tag && def[0] === tag[0] && def[1] === tag[1]);
	}

	/**
	 * 判断一个 TAG 是否为 TAG 原文。
	 * @param original 原文 TAG
	 * @param tag TAG
	 * @returns 是默认返回 true, 否则返回 false
	 */
	function isOriginalTag(original: [number, string] | null | undefined, tag: [number, string]): boolean {
		return !!(original && tag && original[0] === tag[0] && original[1] === tag[1]);
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
				v-for="[key, tag] in tagsWithKey"
				:key="key"
				v-model:input="tagsWithKeyProxy[key]"
				:placeholder="t.press_enter_to_add"
				:checked="isDefaultTag(def, [key, tag])"
				:original="isOriginalTag(original, [key, tag])"
				@change="updateTags(key)"
				@mouseenter="e => showContextualToolbar(key, tag, e)"
				@mouseleave="hideContextualToolbar"
			>{{ tag }}</Tag>
		</TransitionGroup>

		<Flyout
			ref="a"
			v-model="contextualToolbar"
			noPadding
			class="contextual-toolbar"
			@mouseenter="reshowContextualToolbar"
			@mouseleave="hideContextualToolbar"
		>
			<Button v-if="def !== undefined && hoveredTagContent && !isDefaultTag(def, hoveredTagContent) && !original && !isOriginalTag(editorOriginal, hoveredTagContent)" icon="check" @click="setToDefault()">{{ t.set_as_default }}</Button>
			<Button v-if="hoveredTagContent && !isOriginalTag(editorOriginal, hoveredTagContent) && isDefaultTag(def, hoveredTagContent)" icon="close" @click="clearDefault()">{{ t.unset_as_default }}</Button>
			<Button v-if="!original && hoveredTagContent && isDefaultTag(def, hoveredTagContent) && !isOriginalTag(editorOriginal, hoveredTagContent)" icon="star" @click="setToOriginal()">{{ t.tag.set_as_original }}</Button>
			<Button v-if="hoveredTagContent && isDefaultTag(def, hoveredTagContent) && isOriginalTag(editorOriginal, hoveredTagContent)" icon="close" @click="clearOriginal()">{{ t.tag.unset_as_original }}</Button>
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
