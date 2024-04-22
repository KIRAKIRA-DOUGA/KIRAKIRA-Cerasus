<script setup lang="ts">
	useHead({ title: t.search });
	const router = useRouter(), route = useRoute();
	const querySearch = computed(() => route.query.query ?? "");

	const view = ref<ViewType>("grid");
	const displayPageCount = ref(6);
	const videos = ref<SearchVideoByKeywordResponseDto | ThumbVideoResponseDto>();
	const searchModes = ["keyword", "tag", "user", "advanced_search"] as const;
	const querySearchMode = route.query.mode as typeof searchModes[number] ?? "tag";
	const searchMode = ref<typeof searchModes[number]>(querySearchMode);
	const searchModesSorted = computed(() => searchModes.toSorted((a, b) =>
		a === searchMode.value ? -1 : b === searchMode.value ? 1 : 0));
	// 注意：请更新你的 Node.js 版本为 20 及以上才能支持该函数，否则会报错。 // 02: 确实！

	const data = reactive({
		selectedTab: "Home",
		search: querySearch.value,
		sort: ref<SortModel>(["upload_date", "descending"]),
		page: 1,
		pages: 99,
	});

	/**
	 * 通过关键字搜索视频，并赋值给 video
	 * @param keyword 关键字
	 */
	async function searchVideoByKeyword(keyword: string) {
		const searchVideoByKeywordRequest: SearchVideoByKeywordRequestDto = { keyword };
		const videoResult = await api.video.searchVideoByKeyword(searchVideoByKeywordRequest);
		if (videoResult && videoResult.success) {
			videos.value = videoResult;
			data.pages = Math.floor(videoResult.videosCount / 50) + 1;
		}
	}

	/**
	 * 像首页一样获取视频，并赋值给 video
	 */
	async function getHomeVideo() {
		const videoResult = await api.video.getHomePageThumbVideo();
		if (videoResult && videoResult.success) {
			videos.value = videoResult;
			data.pages = Math.floor(videoResult.videosCount / 50) + 1;
		}
	}

	/**
	 * 搜索视频数据
	 */
	async function searchVideo() {
		const query = querySearch.value;
		if (query)
			switch (searchMode.value) {
				case "keyword": {
					await searchVideoByKeyword(query);
					break;
				}

				case "tag": {
					useToast("暂时不支持这种搜索方法，请使用关键字搜索", "error", 10000); // TODO: 使用多语言
					console.warn("no support search mode: tag");
					await getHomeVideo();
					break;
				}

				case "user": {
					useToast("暂时不支持这种搜索方法，请使用关键字搜索", "error", 10000); // TODO: 使用多语言
					console.warn("no support search mode: user");
					await getHomeVideo();
					break;
				}

				case "advanced_search": {
					useToast("暂时不支持这种搜索方法，请使用关键字搜索", "error", 10000); // TODO: 使用多语言
					console.warn("no support search mode: advanced_search");
					await getHomeVideo();
					break;
				}

				default:
					console.log("do nothing");
					break;
			}
		else
			await getHomeVideo();
	}

	/** 创建防抖视频搜索 */
	const debounceVideoSearcher = useDebounce(searchVideo, 500);

	/** 监听路由中的关键词，如果发生变化，则防抖搜索视频 */
	watch(querySearch, debounceVideoSearcher);

	await searchVideo();

	// 向路由中更新搜索的关键字
	watch(() => data.search, search => {
		router.push({ path: route.path, query: { ...route.query, query: search || undefined } });
	});

	// 向路由中更新当前的搜索模式
	watch(() => searchMode.value, searchMode => {
		router.push({ path: route.path, query: { ...route.query, mode: searchMode || undefined } });
	});
</script>

<template>
	<div class="container">
		<ShadingIcon icon="search" position="right top" />
		<HeadingGroup :name="t.search" englishName="Search" />

		<div class="card-container">
			<div class="center">
				<ThumbGrid :view>
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

			<div class="right">
				<div class="toolbox-card search">
					<TextBox v-model="data.search" :placeholder="t.search" icon="search" />
					<div class="tags">
						<TransitionGroup>
							<Tag
								v-for="mode in searchModesSorted"
								:key="mode"
								:checked="searchMode === mode"
								@click="searchMode = mode"
							>{{ t[mode] }}</Tag>
						</TransitionGroup>
					</div>
				</div>

				<div class="toolbox-card">
					<section>
						<ToolboxView v-model="view" />
					</section>

					<section>
						<Subheader icon="sort">{{ t.sort.by }}</Subheader>
						<Sort v-model="data.sort">
							<SortItem id="upload_date" preferOrder="descending">{{ t.upload_date }}</SortItem>
							<SortItem id="views" preferOrder="descending">{{ t.sort.view }}</SortItem>
							<SortItem id="danmaku" preferOrder="descending">{{ t.sort.danmaku }}</SortItem>
							<SortItem id="comments" preferOrder="descending">{{ t.sort.comment }}</SortItem>
							<SortItem id="favorites" preferOrder="descending">{{ t.sort.favorite }}</SortItem>
							<SortItem id="duration" preferOrder="descending">{{ t.duration }}</SortItem>
							<SortItem id="rating">{{ t.rating }}</SortItem>
						</Sort>
					</section>
					<Pagination v-model="data.page" :pages="data.pages" :displayPageCount enableArrowKeyMove />
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	header {
		margin-bottom: 1rem;
	}

	.card-container {
		display: flex;
		gap: 16px;

		@include tablet {
			flex-direction: column-reverse;
		}

		.right {
			display: flex;
			flex-direction: column;
			gap: 1rem;

			@include computer {
				$margin-top: 1rem;
				position: sticky;
				top: $margin-top;
				height: fit-content;
				max-height: calc(100dvh - 2 * $margin-top);
			}
		}
	}

	.center {
		width: 100%;
	}

	.sort {
		grid-template-columns: repeat(2, 1fr);
	}

	.toolbox-view {
		width: 100%;
	}

	.tags {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.toolbox-card.search {
		gap: 16px;
	}
</style>
