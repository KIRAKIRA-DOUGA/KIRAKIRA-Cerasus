<script setup lang="ts">
	import { numbers } from "virtual:scss-var:theme/_variables";

	const { t } = useI18n();
	useHead({ title: t("search") });
	definePageMeta({
		hideAppBar: true,
		flatAppBar: true,
	});
	const router = useRouter(), route = useRoute();

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
	const currentLanguage = computed(getCurrentLocale); // 当前用户的语言
	const flyoutTag = ref<FlyoutModel>(); // 绑定到 FlyoutTag 上的参数，当 target 不为空时会显示 Flyout
	const tags = reactive<Map<VideoTag["tagId"], VideoTag>>(new Map()); // 视频标签
	const displayTags = computed<DisplayVideoTag[]>(() => [...tags.values()].map(tagName => getDisplayVideoTagWithCurrentLanguage(currentLanguage.value, tagName))); // 用于显示的 TAG，相较于上方的 tags 数据结构更简单。
	const contextualToolbar = ref<FlyoutModel>(); // TAG 的工具烂浮窗
	const hoveredTagContent = ref<[number, string]>(); // 鼠标 hover 的 TAG
	const hideExceptMe = ref(false);
	const hideTimeoutId = ref<Timeout>();
	const flyoutSort = ref<FlyoutModel>(); // 排序选择浮窗
	const keywordQueryString = ref(""); // 搜索关键词输入框绑定的响应式变量，注意它和 URL 中的 query.keyword 不是同一个变量，但它们的值会相互同步

	const settings = reactive({ // TODO: 某些设置项可以迁移到设置页
		sort: ref<SortModel>(["upload_date", "descending"]),
		isDynamicUrl: ref(true), // 是否在用户输入搜索条件时动态更新 URL 中的 query 参数，默认为 true // TODO: 暂时无法更改，计划迁移到设置页
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
			settings.pages = Math.max(1, Math.ceil(videoResult.videosCount / 50));
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
			settings.pages = Math.max(1, Math.ceil(videoResult.videosCount / 50));
		} else
			error.value = true;
	}

	/**
	 * 像首页一样获取视频，并赋值给 video
	 */
	async function getHomeVideo() {
		const headerCookie = useRequestHeaders(["cookie"]);
		const videoResult = await api.video.getHomePageThumbVideo(headerCookie);
		if (videoResult && videoResult.success) {
			videos.value = videoResult;
			settings.pages = Math.max(1, Math.ceil(videoResult.videosCount / 50));
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
	 * 根据用户的输入更新 URL(可选),然后搜索视频
	 */
	async function updateUrlAndSearch() {
		const mode = searchMode.value;
		const keyword = keywordQueryString.value.trim();
		const tagIdList = displayTags.value.map(tag => tag.tagId);

		switch (mode) {
			case "keyword": {
				if (keyword) {
					if (settings.isDynamicUrl)
						router.push({ path: route.path, query: { mode, keyword } });
					else
						clearUrlQuery();
					await searchVideoByKeyword(keyword);
					showResult.value = true;
				}
				break;
			}
			case "tag": {
				if (
					Array.isArray(tagIdList) &&
					tagIdList.every((tagId): tagId is number => typeof tagId === "number") &&
					tagIdList.length > 0
				) {
					if (settings.isDynamicUrl)
						router.push({ path: route.path, query: { mode, tagId: tagIdList } });
					else
						clearUrlQuery();
					await searchVideoByTagIds(tagIdList);
					showResult.value = true;
				}
				break;
			}
			case "user":
			case "advanced_search":
				useToast(t("under_construction.search_mode"), "error", 10000);
				console.warn(`no support search mode: ${mode}`);
				await getHomeVideo();
				break;

			default:
				break;
		}
	}

	/**
	 * 搜索模式改变时的处理函数
	 * @param mode - 搜索模式
	 */
	function handleSearchModeChange(mode: typeof searchModes[number]) {
		switch (mode) {
			case "keyword":
				keywordQueryString.value = "";
				searchMode.value = mode;
				if (settings.isDynamicUrl)
					router.push({ path: route.path, query: { mode } });
				else
					clearUrlQuery();
				break;
			case "tag":
				tags.clear();
				searchMode.value = mode;
				if (settings.isDynamicUrl)
					router.push({ path: route.path, query: { mode } });
				else
					clearUrlQuery();
				break;
			case "user":
			case "advanced_search":
				useToast(t("under_construction.search_mode"), "error", 10000);
				console.warn(`no support search mode: ${mode}`);
				break;
			default:
				break;
		}
	}

	/**
	 * 清理 URL 中的查询参数
	 */
	function clearUrlQuery() {
		router.push({ path: route.path, query: {} });
	}

	/**
	 * 搜索页初始化时要执行的一系列操作
	 */
	async function searchPageInit() {
		const mode = route.query.mode as typeof searchModes[number];
		switch (mode) {
			case "keyword": {
				const originKeywordInUrl = route.query.keyword;
				const keywordInUrl = typeof originKeywordInUrl === "string" ? originKeywordInUrl : "";
				if (keywordInUrl) keywordQueryString.value = keywordInUrl;
				break;
			}

			case "tag": {
				const originTagIdListInUrl = route.query.tagId;

				let urlTagIdList: number[] = [];
				if (Array.isArray(originTagIdListInUrl))
					urlTagIdList = originTagIdListInUrl.map(tagId => parseInt(tagId!, 10));
				else if (typeof originTagIdListInUrl === "string")
					urlTagIdList = [parseInt(originTagIdListInUrl, 10)];

				if (urlTagIdList.length > 0) {
					const getVideoTagByTagIdRequest: GetVideoTagByTagIdRequestDto = { tagId: urlTagIdList };
					const tagsResult = await api.videoTag.getTagsByTagIds(getVideoTagByTagIdRequest);
					if (tagsResult.success && tagsResult.result)
						tagsResult.result.forEach(tag => tags.set(tag.tagId, tag));
				}
				break;
			}
			case "user":
			case "advanced_search": {
				useToast(t("under_construction.search_mode"), "error", 10000);
				console.warn(`no support search mode: ${mode}`);
				await getHomeVideo();
				break;
			}
			default:
				break;
		}
		updateUrlAndSearch();
	}

	watch(tags, updateUrlAndSearch); // TAG 模式不需要防抖
	await searchPageInit(); // WARN: searchPageInit 一定要在 watch 后面
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
							@click="handleSearchModeChange(mode)"
						>{{ $t(searchModeI18nKey[mode]) }}</Tag>
					</TransitionGroup>
				</div>
				<form v-if="searchMode !== 'tag'" @submit.prevent="updateUrlAndSearch">
					<TextBox v-model="keywordQueryString" :placeholder="$t('search')" autoFocus>
						<template #actions>
							<SoftButton icon="search" @click="updateUrlAndSearch" />
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
										<Sort v-model="settings.sort">
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
						<Pagination v-model="settings.page" :pages="settings.pages" :displayPageCount enableArrowKeyMove />
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
