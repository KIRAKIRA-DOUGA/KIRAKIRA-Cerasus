<script setup lang="ts">
	useHead({ title: t.search });
	const router = useRouter(), route = useRoute();
	const querySearch = route.query.q ?? "";

	const view = ref<ViewType>("grid");
	const displayPageCount = ref(6);
	const videos = ref<Videos200Response>();
	const searchModes = ["video", "tag", "user"] as const;
	const searchMode = ref<typeof searchModes[number]>("tag");
	const searchModesSorted = computed(() => searchModes.toSorted((a, b) =>
		a === searchMode.value ? -1 : b === searchMode.value ? 1 : 0));
	// 注意：请更新你的 Node.js 版本为 20 及以上才能支持该函数，否则会报错。

	const data = reactive({
		selectedTab: "Home",
		search: querySearch,
		sort: ref<SortModel>(["upload_date", "descending"]),
		page: 1,
		pages: 99,
	});

	/**
	watch(() => data.search, search => {
		router.push({ path: route.path, query: { ...route.query, q: search || undefined } });
	});
	 */
</script>

<template>
	<div class="container">
		<ShadingIcon icon="search" position="right top" />
		<HeadingGroup :name="t.search" englishName="Search" />

		<div class="card-container">
			<div class="center">
				<div class="videos-grid">
					<ThumbVideo
						v-for="video in videos?.videos"
						:key="video.videoID"
						:videoId="video.videoID"
						:uploader="video.authorName ?? ''"
						:uploaderId="video.authorID"
						:image="video.thumbnailLoc"
						:date="new Date()"
						:watchedCount="video.views"
						:duration="new Duration(0, video.videoDuration ?? 0)"
						:style="{ '--view': view }"
					>{{ video.title }}</ThumbVideo>
				</div>
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
					<Button icon="tune">{{ t.advanced_search }}</Button>
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
					<Pagination v-model="data.page" :pages="data.pages" :displayPageCount="displayPageCount" enableArrowKeyMove />
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
		gap: 1rem;

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

		button {
			--appearance: tertiary;
		}
	}
</style>
