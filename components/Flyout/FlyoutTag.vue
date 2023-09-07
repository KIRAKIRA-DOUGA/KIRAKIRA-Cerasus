<script setup lang="ts">
	const flyout = defineModel<FlyoutModel>();

	const search = ref("");
	const isSearched = computed(() => !!search.value.trim());
	const allTags = ["Minecraft", "音MAD", "OS", "NOVA", "UTAU", "Vocaloid", "2号", "niconico", "House Music", "EDM"];
	const matchedTags = ref<string[]>([]);
	const showCreateNew = ref(false);
	const showTagEditor = ref(false);
	const languages = ["简体中文", "英语", "日语", "繁体中文", "韩语", "越南语", "印尼语", "阿拉伯语", "西班牙语", "葡萄糖语", "其它"] as const;
	const editor = reactive<{ language: typeof languages[number] | ""; values: string[]; default?: string }[]>([]);
	const showComboBox = ref(false);

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
	 * 切换标签编辑器。
	 * @param shown - 是否显示？
	 */
	function switchTagEditor(shown: true | "ok" | "cancel") {
		if (shown === "ok") {
			flyout.value = undefined;
			onFlyoutHide();
		} else if (shown === "cancel") showTagEditor.value = false;
		else {
			const text = search.value.trim().replaceAll(/\s+/g, " ");
			arrayClearAll(editor);
			// editor.push({ language: "", values: [text] });
			editor.push(
				{ language: "英语", values: ["Minecraft", "MC"], default: "Minecraft" },
				{ language: "简体中文", values: ["我的世界", "当个创世神"], default: "我的世界" },
				{ language: "日语", values: ["マインクラフト", "マイクラ"], default: "マインクラフト" },
			);
			showTagEditor.value = true;
		}
	}

	/**
	 * 关闭浮窗后事件。
	 */
	function onFlyoutHide() {
		showTagEditor.value = false;
		search.value = "";
	}
</script>

<template>
	<Flyout v-model="flyout" noPadding :class="{ 'show-combobox': showComboBox }">
		<Comp>
			<Transition :name="showTagEditor ? 'page-forward' : 'page-backward'" mode="out-in">
				<div v-if="!showTagEditor" class="page-search">
					<div class="list-wrapper">
						<Transition>
							<div v-if="!isSearched" class="empty">
								<Icon name="tag" />
								<p>请搜索标签</p>
							</div>
							<div v-else class="list">
								<TransitionGroup>
									<div v-for="tag in matchedTags" :key="tag" v-ripple class="list-item">
										<p class="title">{{ tag }}</p>
										<p class="count">100个视频</p>
									</div>
									<div v-if="showCreateNew" v-ripple class="list-item" @click="switchTagEditor(true)">
										<p class="title">创建新标签</p>
									</div>
								</TransitionGroup>
							</div>
						</Transition>
					</div>
					<TextBox v-model="search" icon="search" placeholder="搜索标签" @input="onInput" />
				</div>
				<div v-else class="page-editor">
					<div class="list-wrapper">
						<div class="list">
							<template v-for="(item, index) in editor" :key="index">
								<ComboBox v-model="item.language" v-model:shown="showComboBox" placeholder="选择语言">
									<ComboBoxItem v-for="lang in languages" :id="lang" :key="lang">{{ lang }}</ComboBoxItem>
								</ComboBox>
								<div class="tags">
									<Tag v-for="value in item.values" :key="value" :checked="item.default === value" @click="item.default = value">{{ value }}</Tag>
								</div>
							</template>
						</div>
					</div>
					<div class="submit">
						<Button class="secondary" @click="switchTagEditor('cancel')">取消</Button>
						<Button @click="switchTagEditor('ok')">确定</Button>
					</div>
				</div>
			</Transition>
		</Comp>
	</Flyout>
</template>

<style scoped lang="scss">
	$translate: 30px;

	:comp {
		@include square(360px);
		position: relative;
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
			width: 100%;
			padding: 8px 16px;
			cursor: pointer;

			&:first-child {
				padding-top: 16px;
			}

			&:last-child {
				padding-bottom: 16px;
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

			&.v-enter-from,
			&.v-leave-to {
				translate: 0 $translate;
				opacity: 0;
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
		padding: 16px;

		.list-wrapper {
			position: relative;
			height: 100%;
			overflow: auto;
		}

		.list {
			position: absolute;
			display: grid;
			grid-template-columns: repeat(2, auto);
			gap: 16px 8px;
			width: 100%;

			.tags {
				display: flex;
				flex-wrap: wrap;
				gap: 8px;

				.tag {
					min-height: 36px;
				}
			}
		}

		.submit {
			position: relative;
			bottom: 0;
			display: flex;
			gap: 5px;
			margin-top: 12px;

			> :first-child {
				margin-left: auto;
			}
		}
	}

	.flyout.show-combobox {
		&,
		.page-editor .list-wrapper {
			overflow: visible;
		}
	}
</style>
