<script setup lang="ts">
	import { numbers } from "virtual:scss-var:theme/_variables";

	const { t } = useI18n();
	useHead({ title: t("search") });
	definePageMeta({
		hideAppBar: true,
		flatAppBar: true,
	});
	const router = useRouter(), route = useRoute();
	const querySearch = computed(() => route.query.query ?? "");
	const tagSearch = computed(() => {
		const tagIds = route.query.tagId;
		if (Array.isArray(tagIds))
			return tagIds.map(tagId => parseInt(tagId!, 10));
		else if (typeof tagIds === "string")
			return [parseInt(tagIds, 10)];
		else
			return [];
	});

	const windowSize = useWindowSize();
	const isMobileWidth = computed(() => windowSize.width.value <= numbers.tabletMaxWidth);

	const showResult = ref(false);
	const loading = ref(false);
	const error = ref(false);
	const view = ref<ViewType>("grid");
	const displayPageCount = ref(6);
	const videos = ref<SearchVideoByKeywordResponseDto | ThumbVideoResponseDto>();
	const searchModes = ["keyword", "tag", "user", "advanced_search"] as const;
	const querySearchMode = route.query.mode as typeof searchModes[number] ?? "keyword";
	const searchMode = ref<typeof searchModes[number]>(querySearchMode);
	const searchModeI18nKey: Record<typeof searchModes[number], string> = {
		keyword: "keyword",
		tag: "tag.title",
		user: "user.title",
		advanced_search: "advanced_search",
	};
	// const searchModesSorted = computed(() => searchModes.toSorted((a, b) =>
	// 	a === searchMode.value ? -1 : b === searchMode.value ? 1 : 0));
	// 注意：请更新你的 Node.js 版本为 20 及以上才能支持该函数，否则会报错。 // 02: 确实！
	const currentLanguage = computed(getCurrentLocale); // 当前用户的语言
	const flyoutTag = ref<FlyoutModel>(); // 绑定到 FlyoutTag 上的参数，当 target 不为空时会显示 Flyout
	const tags = reactive<Map<VideoTag["tagId"], VideoTag>>(new Map()); // 视频标签
	const displayTags = computed<DisplayVideoTag[]>(() => [...tags.values()].map(tagName => getDisplayVideoTagWithCurrentLanguage(currentLanguage.value, tagName))); // 用于显示的 TAG，相较于上方的 tags 数据结构更简单。
	const contextualToolbar = ref<FlyoutModel>(); // TAG 的工具烂浮窗
	const hoveredTagContent = ref<[number, string]>(); // 鼠标 hover 的 TAG
	const hideExceptMe = ref(false);
	const hideTimeoutId = ref<Timeout>();
	const flyoutSort = ref<FlyoutModel>(); // 排序选择浮窗

	const data = reactive({
		selectedTab: "Home",
		search: querySearch.value,
		sort: ref<SortModel>(["upload_date", "descending"]),
		page: 1,
		pages: 99,
	});

	/**
	 * 通过关键字搜索视频，并赋值给 video
	 * @param keyword - 关键字
	 */
	async function searchVideoByKeyword(keyword: string) {
		const searchVideoByKeywordRequest: SearchVideoByKeywordRequestDto = { keyword };
		loading.value = true;
		error.value = false;
		const videoResult = await api.video.searchVideoByKeyword(searchVideoByKeywordRequest);
		loading.value = false;
		if (videoResult && videoResult.success) {
			videos.value = videoResult;
			data.pages = Math.max(1, Math.ceil(videoResult.videosCount / 50));
		} else
			error.value = true;
	}

	/**
	 * 通过关键字搜索视频，并赋值给 video
	 * @param tagIds - 关键字
	 */
	async function searchVideoByTagIds(tagIds: number[]) {
		const searchVideoByVideoTagIdRequest: SearchVideoByVideoTagIdRequestDto = { tagId: tagIds };
		loading.value = true;
		error.value = false;
		const videoResult = await api.video.searchVideoByTagIds(searchVideoByVideoTagIdRequest);
		loading.value = false;
		if (videoResult && videoResult.success) {
			videos.value = videoResult;
			data.pages = Math.max(1, Math.ceil(videoResult.videosCount / 50));
		} else
			error.value = true;
	}

	/**
	 * 像首页一样获取视频，并赋值给 video
	 */
	async function getHomeVideo() {
		const videoResult = await api.video.getHomePageThumbVideo();
		if (videoResult && videoResult.success) {
			videos.value = videoResult;
			data.pages = Math.max(1, Math.ceil(videoResult.videosCount / 50));
		}
	}

	/**
	 * 鼠标移入区域，取消自动隐藏。
	 */
	function reshowContextualToolbar() {
		clearTimeout(hideTimeoutId.value);
	}

	/**
	 * 从视频 TAG 列表中移除一个 TAG（注意，此时 TAG 列表没有传递给后端数据库存储）
	 * @param tagId - TAG 编号
	 */
	function removeTag(tagId: number) {
		if (tagId !== undefined || tagId !== null) tags.delete(tagId);
		hideContextualToolbar();
	}

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
	 * 搜索视频数据
	 */
	async function searchVideo() {
		const query = querySearch.value; // 关键词
		const tag = tagSearch.value; // 视频标签
		switch (searchMode.value) {
			case "keyword": {
				if (query) {
					showResult.value = true;
					await searchVideoByKeyword(query as string);
				}
				// else
				// 	await getHomeVideo();
				break;
			}

			case "tag": {
				if (tag?.length) {
					showResult.value = true;
					await searchVideoByTagIds(tag);
				}
				// else
				// 	await getHomeVideo();
				break;
			}

			case "user": {
				useToast(t("under_construction.search_mode"), "error", 10000);
				console.warn("no support search mode: user");
				await getHomeVideo();
				break;
			}

			case "advanced_search": {
				useToast(t("under_construction.search_mode"), "error", 10000);
				console.warn("no support search mode: advanced_search");
				await getHomeVideo();
				break;
			}

			default:
				break;
		}
	}

	/** 监听路由中的关键词，如果发生变化，则防抖搜索视频 */
	watch(querySearch, searchVideo);

	/** 监听路由中的 TAG ID，如果发生变化，则防抖搜索视频 */
	watch(tagSearch, searchVideo);

	function onSearch() {
		// 如果当前是关键字搜索模式，向 URL 中更新搜索的关键字
		if (searchMode.value === "keyword")
			router.push({ path: route.path, query: { ...route.query, query: data.search || undefined } });
	}

	// 如果当前是 TAG 搜索模式，并且 TAG 发生变化，则向 URL 中更新 tagIds
	watch(() => displayTags.value, tags => {
		if (searchMode.value === "tag") {
			const tagIds = tags.map(tag => tag.tagId);
			router.push({ path: route.path, query: { ...route.query, tagId: tagIds } });
		}
	});

	// 向路由中更新当前的搜索模式，立即执行
	watch(() => searchMode.value, searchMode => {
		router.push({ path: route.path, query: { ...route.query, mode: searchMode } });
	});

	// 页面初始化后设置 URL Query 中包含搜索模式
	onMounted(() => {
		router.push({ path: route.path, query: { ...route.query, mode: searchMode.value } });
	});

	/**
	 * 搜索页初始化时要执行的一系列操作
	 */
	async function searchPageInit() {
		// SSR 时搜索视频
		await searchVideo();

		if (tagSearch.value.length > 0) {
			const getVideoTagByTagIdRequest: GetVideoTagByTagIdRequestDto = { tagId: tagSearch.value };
			const tagsResult = await api.videoTag.getTagsByTagIds(getVideoTagByTagIdRequest);
			if (tagsResult.success && tagsResult.result)
				tagsResult.result.map(tag => tags.set(tag.tagId, tag));
		}
	}
	await searchPageInit();

	const [DefineSearchForm, SearchForm] = createReusableTemplate();
</script>

<template>
	<div>
		<DefineSearchForm>
			<div class="search-form">
				<div class="tags">
					<TransitionGroup>
						<Tag
							v-for="mode in searchModes"
							:key="mode"
							:checked="searchMode === mode"
							@click="searchMode = mode"
						>{{ $t(searchModeI18nKey[mode]) }}</Tag>
					</TransitionGroup>
				</div>
				<form v-if="searchMode !== 'tag'" @submit.prevent="onSearch">
					<TextBox v-model="data.search" :placeholder="$t('search')" autoFocus>
						<template #actions>
							<SoftButton icon="search" @click="onSearch" />
						</template>
					</TextBox>
				</form>
				<div v-else class="search-item-tags">
					<Tag
						v-for="tag in displayTags"
						:key="tag.tagId"
						:query="{ q: tag.tagId }"
						@mouseenter="e => showContextualToolbar(tag.tagId, tag.mainTagName, e)"
						@mouseleave="hideContextualToolbar"
					>
						<div v-if="tag.tagId >= 0" class="display-tag">
							<div v-if="tag.mainTagName">{{ tag.mainTagName }}</div>
							<div v-if="tag.originTagName" class="original-tag-name">{{ tag.originTagName }}</div>
						</div>
					</Tag>
					<Tag key="add-tag-button" class="add-tag" :checkable="false" @click="e => flyoutTag = [e, 'y']">
						<Icon name="add" />
					</Tag>
				</div>
				<FlyoutTag v-model="flyoutTag" v-model:tags="tags" />

				<Flyout
					v-model="contextualToolbar"
					noPadding
					class="contextual-toolbar"
					@mouseenter="reshowContextualToolbar"
					@mouseleave="hideContextualToolbar"
				>
					<Button icon="close" @click="removeTag(hoveredTagContent![0])">{{ $t("delete") }}</Button>
				</Flyout>
			</div>
		</DefineSearchForm>

		<ShadingIcon icon="search" position="right top" />

		<Transition name="page-jump-in" mode="out-in">
			<!-- 大搜索页 -->
			<div v-if="!showResult" class="search-home-page">
				<div class="content">
					<div class="logo">
						<LogoText />
						<div class="title">
							<span class="line"></span>
							<h2>Search</h2>
							<span class="line"></span>
						</div>
					</div>
					<SearchForm />
				</div>
			</div>

			<!-- 结果页 -->
			<div v-else class="search-result-page">
				<header>
					<SearchForm />
					<div class="toolbar">
						<div class="left">
							<ViewSwitch v-model="view" />
							<Button icon="sort" @click="e => flyoutSort = [e, 'y']">{{ $t("sort.by") }}</Button>
							<SoftButton icon="slider_3" @click="e => flyoutSort = [e, 'y']" />
							<Flyout v-model="flyoutSort">
								<div class="flyout-sort">
									<template v-if="isMobileWidth">
										<section>
											<Subheader icon="grid">{{ $t("view.title") }}</Subheader>
											<ViewSwitch v-model="view" />
										</section>
									</template>
									<section>
										<Subheader v-if="isMobileWidth" icon="sort">{{ $t("sort.by") }}</Subheader>
										<Sort v-model="data.sort">
											<SortItem id="upload_date" preferOrder="descending">{{ $t("upload_date") }}</SortItem>
											<SortItem id="view" preferOrder="descending">{{ $t("sort.view") }}</SortItem>
											<SortItem id="danmaku" preferOrder="descending">{{ $t("sort.danmaku") }}</SortItem>
											<SortItem id="comment" preferOrder="descending">{{ $t("sort.comment") }}</SortItem>
											<SortItem id="save" preferOrder="descending">{{ $t("sort.save") }}</SortItem>
											<SortItem id="duration" preferOrder="descending">{{ $t("duration") }}</SortItem>
											<SortItem id="rating">{{ $t("rating") }}</SortItem>
										</Sort>
									</section>
								</div>
							</Flyout>
						</div>
						<Pagination v-model="data.page" :pages="data.pages" :displayPageCount enableArrowKeyMove />
					</div>
				</header>
				<div class="videos-container" :class="{ loading }">
					<div v-if="loading" class="loading-indicator">
						<ProgressRing />
					</div>
					<ContentUnavailable v-if="!loading && (!videos || videos.videosCount === 0)" type="search" />
					<ContentUnavailable v-else-if="error" type="error" />
					<ThumbGrid :view :inert="loading">
						<ThumbVideo
							v-for="video in videos?.videos"
							:key="video.videoId"
							:videoId="video.videoId"
							:uploader="video.uploader ?? ''"
							:uploaderId="video.uploaderId"
							:image="video.image"
							:date="new Date(video.uploadDate || 0)"
							:watchedCount="video.watchedCount"
							:duration="new Duration(0, video.duration ?? 0)"
						>{{ video.title }}</ThumbVideo>
					</ThumbGrid>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style scoped lang="scss">
	.search-home-page {
		@include flex-center;
		@include page-padding-x;
		width: 100%;
		min-height: 70dvh;

		> .content {
			@include flex-center;
			flex-direction: column;
			gap: 40px;
			width: 100%;

			.logo {
				@include flex-center;
				flex-direction: column;

				.logo-text {
					--form: visible;
					font-size: 48px;
				}

				.title {
					display: flex;
					gap: 24px;
					align-items: center;
					color: c(accent);
					text-transform: uppercase;

					* {
						font-family: $english-logo-fonts;
						font-size: 14px;
					}

					h2 {
						margin-right: -32px;
						letter-spacing: 32px;
					}

					.line {
						width: 20px;
						height: 2px;
						background-color: c(accent);
					}
				}
			}
		}
	}

	.search-form {
		display: flex;
		flex-direction: column;
		gap: 16px;
		width: 100%;
		max-width: 560px;

		.text-box {
			--size: large;
			flex-grow: 1;
			width: 100%;
		}
	}

	.search-result-page {
		display: flex;
		flex-direction: column;

		> header {
			@include card-shadow-with-blur;
			@include page-padding-x;
			position: sticky;
			top: 0;
			z-index: 5;
			display: flex;
			flex-direction: column;
			gap: 16px;
			padding-block: 16px;
			background-color: c(surface-color);
		}

		.videos-container {
			@include page-padding-x;
			position: relative;
			padding-block: 16px;

			&.loading .thumb-grid {
				opacity: 0;
			}
		}

		.loading-indicator {
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			display: flex;
			justify-content: center;
			padding-block: 48px;
		}
	}

	.sort {
		grid-template-columns: repeat(2, 1fr);
	}

	.tags {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.search-item-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;

		.add-tag {
			aspect-ratio: 1 / 1;
			padding: 6px;
			color: c(icon-color);
			font-size: 18px;
		}
	}

	.display-tag {
		display: flex;
		flex-flow: row wrap;
		gap: 0.5em;

		.original-tag-name {
			color: c(text-color, 50%);
		}
	}

	.contextual-toolbar {
		button {
			--appearance: tertiary;
		}
	}

	.toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		justify-content: space-between;
		align-items: center;

		.left {
			display: flex;
			gap: 4px;

			button {
				--appearance: secondary;

				&:deep(.button-content) {
					background-color: c(inset-bg);
				}
			}

			.soft-button {
				--wrapper-size: 36px;
				--ripple-size: 44px;
			}

			@include not-mobile {
				.soft-button {
					display: none;
				}
			}

			@include mobile {
				button,
				> .view-switch {
					display: none;
				}
			}
		}
	}

	.flyout-sort {
		display: flex;
		flex-direction: column;
		gap: 24px;

		section {
			display: flex;
			flex-direction: column;
			gap: 8px;
		}
	}
</style>
