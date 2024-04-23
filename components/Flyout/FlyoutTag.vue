<script setup lang="ts">
	const flyout = defineModel<FlyoutModel>();
	const tags = defineModel< Map<VideoTag["tagId"], VideoTag> >("tags"); // TAG 数据
	const search = ref("");
	const isSearched = computed(() => !!search.value.trim());
	const matchedTags = ref<VideoTag[]>([]);
	const showCreateNew = ref(false); // 是否显示 “创建 TAG” 按钮
	const showTagEditor = ref(false); // 是否显示 TAG（创建）编辑器
	const isCreatingTag = ref(false); // 是否正在创建 TAG
	const languages = [
		{ langId: "zhs", langName: t.language.zhs },
		{ langId: "en", langName: t.language.en },
		{ langId: "ja", langName: t.language.ja },
		{ langId: "zht", langName: t.language.zht },
		{ langId: "ko", langName: t.language.ko },
		{ langId: "vi", langName: t.language.vi },
		{ langId: "id", langName: t.language.id },
		{ langId: "ar", langName: "阿拉伯语" }, // TODO: 使用多语言
		{ langId: "other", langName: "其它" }, // TODO: 使用多语言
	] as const; // 可选语言列表
	type LanguageList = typeof languages[number];
	type EditorType = { language: LanguageList | { langId: ""; langName: "" }; values: string[]; default: [number, string] | null }[];
	const editor = reactive<EditorType>([]); // TAG 编辑器实例
	const availableLanguages = ref<LanguageList[][]>([]); // 除去用户已经选择的语言之外的其他语言
	const currentLanguage = computed(getCurrentLocale); // 当前用户的语言

	/**
	 * 搜索视频 TAG
	 */
	async function searchVideoTag() {
		showCreateNew.value = true;
		const text = halfwidth(search.value.trim().replaceAll(/\s+/g, " ").toLowerCase());
		if (text)
			try {
				const result = await api.videoTag.searchVideoTag({ tagNameSearchKey: text });
				if (result?.success && result.result && result.result.length > 0) {
					matchedTags.value = result.result;
					const hasSameWithInput = checkTagUnique(text, result.result);
					if (hasSameWithInput) showCreateNew.value = false;
					else showCreateNew.value = true;
				} else showCreateNew.value = true;
			} catch (error) {
				console.error("ERROR", "搜索 TAG 时出错：", error);
				useToast("搜索 TAG 失败", "error"); // TODO: 使用多语言
			}
	}
	const debounceVideoTagSearcher = useDebounce(searchVideoTag, 500);

	/**
	 * 用户在搜索框内输入文本时的事件。
	 */
	async function onInput() {
		await debounceVideoTagSearcher();
	}

	/**
	 * TAG 编辑器生成的数据转换为适用于后端存储的格式
	 * @param editor TAG 编辑器数据
	 * @returns 适于存储的 TAG 数据
	 *
	 * @example
	 * 假设有如下数据：
	 * const foo = [
	 *		{
	 *			default: "StarCitizen",
	 *			language: {
	 *				langId: "en",
	 *				langName: "",
	 *			},
	 *			value: ["StarCitizen", "SC"],
	 *		}, {
	 *			default: null,
	 *			language: {
	 *				langId: "zhs",
	 *				langName: "",
	 *			},
	 *			value: ["星际公民"],
	 *		},
	 *	]
	 *
	 * 执行 editorData2Dto(foo), 结果为：
	 *	{
	 *		tagNameList: [
	 *			{
	 *				lang: "en",
	 *				tagName: [
	 *					{
	 *						name: "StarCitizen",
	 *						isDefault: true,
	 *						isOriginalTagName: false,
	 *					}, {
	 *						name: "SC",
	 *						isDefault: false,
	 *						isOriginalTagName: false,
	 *					},
	 *				],
	 *			}, {
	 *				lang: "zhs",
	 *				tagName: [
	 *					{
	 *						name: "星际公民",
	 *						isDefault: false,
	 *						isOriginalTagName: false,
	 *					},
	 *				],
	 *			},
	 *		],
	 *	}
	 */
	function editorData2TagDto(editor: EditorType): CreateVideoTagRequestDto {
		const tagNameList = editor.filter(tag => !!tag.language.langId || !!tag.values?.[0]).map(filteredTag => {
			return {
				lang: filteredTag.language.langId,
				tagName: filteredTag.values.map(tagName => {
					return {
						name: tagName,
						isDefault: tagName === filteredTag.default?.[1], // TODO: 如果没有指定默认 TAG 怎么办？
						isOriginalTagName: false, // TODO: 是否为原始 TAG
					};
				}),
			};
		});
		return { tagNameList };
	}

	/**
	 * 检查 TAG 数据是否合法
	 * @param createVideoTagRequest TAG 数据
	 * @returns boolean 合法返回 true, 不合法返回 false
	 */
	function checkTagData(createVideoTagRequest: CreateVideoTagRequestDto): boolean {
		return createVideoTagRequest.tagNameList.filter(tag => !!tag.lang && tag.tagName.length > 0).length > 0;
	}

	/**
	 * 切换标签编辑器。
	 * @param shown - 是否显示？
	 */
	async function switchTagEditor(shown: true | "ok" | "cancel") {
		if (shown === "ok") {
			const tagData = editorData2TagDto(editor);
			if (checkTagData(tagData)) {
				isCreatingTag.value = true;
				const result = await api.videoTag.createVideoTag(tagData);
				if (result.result?.tagId !== null && result.result?.tagId !== undefined) tags.value?.set(result.result.tagId, result.result);
				isCreatingTag.value = false;
				onFlyoutHide();
			} else useToast(t.toast.no_language_selected, "warning");
		} else if (shown === "cancel") showTagEditor.value = false;
		else {
			const text = search.value.trim().replaceAll(/\s+/g, " ");
			arrayClearAll(editor);
			editor.push({ language: { langId: "", langName: "" }, values: [text], default: null });
			showTagEditor.value = true;
		}
	}

	/**
	 * 用户点击一个搜索到的 TAG，将其添加到视频 TAG 列表中。
	 * @param tag 用户点击的 TAG 数据。
	 */
	function addTag(tag: VideoTag) {
		if (tag.tagId) tags.value?.set(tag.tagId, tag);
	}

	watch(editor, editor => {
		if (editor.at(-1)?.language.langId !== "")
			editor.push({ language: { langId: "", langName: "" }, values: [], default: null });
		availableLanguages.value = [];
		const allComboBoxLanguages = editor.map(item => item.language.langId);
		editor.forEach(({ language, default: def }, index) => {
			if (!language && def) {
				editor[index].default = null;
				useToast(t.toast.no_language_selected, "warning");
			}
			availableLanguages.value[index] = languages.filter(lang => {
				if (lang.langId === language.langId) return true;
				else if (allComboBoxLanguages.includes(lang.langId)) return false;
				else return true;
			});
		});
	}, { deep: true });

	/**
	 * 关闭浮窗后事件。
	 */
	function onFlyoutHide() {
		showTagEditor.value = false;
		search.value = "";
	}
</script>

<template>
	<Flyout v-model="flyout" noPadding :ignoreOutsideElementClasses="['contextual-toolbar']">
		<Comp>
			<Transition :name="showTagEditor ? 'page-forward' : 'page-backward'" mode="out-in">
				<div v-if="!showTagEditor" class="page-search">
					<div class="list-wrapper">
						<Transition>
							<div v-if="!isSearched" class="empty">
								<Icon name="tag" />
								<p>{{ t.unselected.tag }}</p>
							</div>
							<div v-else class="list">
								<TransitionGroup>
									<div v-for="tag in matchedTags" :key="tag.tagId" v-ripple class="list-item">
										<div class="content" @click="addTag(tag)">
											<p class="title">{{ getVideoTagNameWithCurrentLanguage(currentLanguage, tag)?.tagNameList[0] }}</p>
											<p class="count">{{ t(100).video_count(100) }}</p>
										</div>
										<div class="trailing-icons">
											<SoftButton icon="edit" @click.stop />
										</div>
									</div>
									<div v-if="showCreateNew" key="add-tag" v-ripple class="list-item create-new" @click="switchTagEditor(true)">
										<div class="leading-icons">
											<Icon name="add" />
										</div>
										<div class="content">
											<p class="title">{{ t.tag.new }}</p>
										</div>
									</div>
								</TransitionGroup>
							</div>
						</Transition>
					</div>
					<TextBox v-model="search" icon="search" :placeholder="t.tag.search" @input="onInput" />
				</div>
				<div v-else class="page-editor">
					<div class="list-wrapper">
						<div class="list">
							<template v-for="(item, index) in editor" :key="index">
								<ComboBox v-model="item.language.langId" :placeholder="t.unselected.language">
									<ComboBoxItem v-for="lang in availableLanguages[index]" :id="lang.langId" :key="lang.langId">{{ lang.langName }}</ComboBoxItem>
								</ComboBox>
								<TagsEditor v-model="item.values" v-model:default="item.default" />
							</template>
						</div>
					</div>
					<div class="submit">
						<Button class="secondary" :disabled="isCreatingTag" @click="switchTagEditor('cancel')">{{ t.step.cancel }}</Button>
						<Button :disabled="isCreatingTag" :loading="isCreatingTag" @click="switchTagEditor('ok')">{{ t.step.ok }}</Button>
					</div>
				</div>
			</Transition>
		</Comp>
	</Flyout>
</template>

<style scoped lang="scss">
	$width: 500px;
	$height: 360px;
	$translate: 30px;

	:comp {
		position: relative;
		width: $width;
		height: $height;
	}

	.page-search {
		display: flex;
		flex-direction: column;
		height: 100%;

		.text-box {
			--square: true;
		}

		.empty {
			@include flex-center;
			flex-direction: column;
			gap: 8px;
			height: 100%;
			color: c(icon-color);
			font-size: 16px;

			.icon {
				font-size: 42px;
			}

			&.v-enter-from,
			&.v-leave-to {
				opacity: 0;
				translate: 0 (-$translate);
			}
		}

		.list-wrapper {
			position: relative;
			height: 100%;
			overflow: auto;

			.list {
				&.v-enter-from,
				&.v-leave-to {
					opacity: 0;
					translate: 0 $translate;
				}
			}
		}

		.empty,
		.list {
			position: absolute;
			width: 100%;
		}

		.list-item {
			display: flex;
			gap: 4px;
			align-items: center;
			width: 100%;
			padding: 8px 16px;
			cursor: pointer;

			&:first-child {
				padding-top: 16px;
			}

			&.create-new {
				color: c(icon-color);
			}

			.leading-icons {
				display: flex;

				.icon {
					font-size: 24px;
				}
			}

			&:has(.leading-icons .icon) {
				padding: 8px 12px;

				&:only-child {
					padding: 16px 12px;
				}
			}

			.content {
				flex-grow: 1;
			}

			.title {
				font-weight: bold;
			}

			.count {
				font-size: 10px;
			}

			&:any-hover {
				background-color: c(hover-overlay);
			}

			.soft-button {
				--ripple-size: 80px;
			}

			&.v-enter-from,
			&.v-leave-to {
				opacity: 0;
				translate: 0 $translate;
			}

			&.v-leave-active {
				position: absolute;
			}
		}
	}

	.page-editor {
		display: flex;
		flex-direction: column;
		height: 100%;

		.list-wrapper {
			position: relative;
			height: 100%;
			overflow: hidden auto; // FIXME: 开启页面滚动，但是会导致打开下拉菜单时，元素溢出到外面。
		}

		.list {
			position: absolute;
			display: grid;
			grid-template-columns: 110px auto;
			gap: 16px 8px;
			width: 100%;
			margin: 16px;

			&::after {
				content: "";
			}
		}

		.submit {
			position: relative;
			bottom: 0;
			display: flex;
			gap: 5px;
			margin: 16px;
			margin-top: 0;

			> :first-child {
				margin-left: auto;
			}
		}
	}

	.flyout,
	.flyout .page-editor .list-wrapper {
		&:has(.combo-box .show) {
			overflow: visible;
		}
	}
</style>
