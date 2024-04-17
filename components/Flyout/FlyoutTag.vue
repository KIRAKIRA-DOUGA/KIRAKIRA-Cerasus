<script setup lang="ts">
	const flyout = defineModel<FlyoutModel>();

	const search = ref("");
	const isSearched = computed(() => !!search.value.trim());
	const allTags = ["Minecraft", "音MAD", "OS", "NOVA", "UTAU", "Vocaloid", "2号", "niconico", "House Music", "EDM"];
	const matchedTags = ref<string[]>([]);
	const showCreateNew = ref(false);
	const showTagEditor = ref(false);
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
	] as const;
	type LanguageList = typeof languages[number];
	type EditorType = { language: LanguageList | { langId: ""; langName: "" }; values: string[]; default: string | null }[];
	const editor = reactive<EditorType>([]);
	const availableLanguages = ref<LanguageList[][]>([]);

	/**
	 * 用户在搜索框内输入文本时的事件。
	 */
	function onInput() {
		let hasSame = false;
		const text = halfwidth(search.value.trim().replaceAll(/\s+/g, " ").toLowerCase());
		matchedTags.value = allTags.filter(tag => {
			const normalizedTag = halfwidth(tag.toLowerCase());
			if (normalizedTag === text) hasSame = true;
			return normalizedTag.includes(text);
		});
		showCreateNew.value = !hasSame;
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
	function editorData2Dto(editor: EditorType): CreateVideoTagRequestDto {
		const tagNameList = editor.filter(tag => !!tag.language.langId || !!tag.values?.[0]).map(filteredTag => {
			return {
				lang: filteredTag.language.langId,
				tagName: filteredTag.values.map(tagName => {
					return {
						name: tagName,
						isDefault: tagName === filteredTag.default, // TODO: 如果没有指定默认 TAG 怎么办？
						isOriginalTagName: false, // TODO: 是否为原始 TAG
					};
				}),
			};
		});
		return { tagNameList };
	}

	/**
	 * 切换标签编辑器。
	 * @param shown - 是否显示？
	 */
	async function switchTagEditor(shown: true | "ok" | "cancel") {
		if (shown === "ok") {
			const result = await api.videoTag.createVideoTag(editorData2Dto(editor));
			flyout.value = undefined;
			onFlyoutHide();
		} else if (shown === "cancel") showTagEditor.value = false;
		else {
			const text = search.value.trim().replaceAll(/\s+/g, " ");
			arrayClearAll(editor);
			editor.push({ language: { langId: "", langName: "" }, values: [text], default: null }); // 正式上线时把下面的范例 tag 去掉，然后把这行代码取消注释。
			/* editor.push(
				{ language: "英语", values: ["Minecraft", "MC"], default: "Minecraft" },
				{ language: "简体中文", values: ["我的世界", "当个创世神"], default: "我的世界" },
				{ language: "日语", values: ["マインクラフト", "マイクラ"], default: "マインクラフト" },
			); */
			showTagEditor.value = true;
		}
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
									<div v-for="tag in matchedTags" :key="tag" v-ripple class="list-item">
										<div class="content">
											<p class="title">{{ tag }}</p>
											<p class="count">{{ t(100).video_count(100) }}</p>
										</div>
										<div class="trailing-icons">
											<SoftButton icon="edit" @click.stop />
										</div>
									</div>
									<div v-if="showCreateNew" v-ripple class="list-item create-new" @click="switchTagEditor(true)">
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
						<Button class="secondary" @click="switchTagEditor('cancel')">{{ t.step.cancel }}</Button>
						<Button @click="switchTagEditor('ok')">{{ t.step.ok }}</Button>
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
