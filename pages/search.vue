<script setup lang="ts">
	useHead({ title: t.search });
	const querySearch = useRoute().query.q ?? "";

	const view = ref<ViewType>("grid");
	const displayPageCount = ref(6);
	const videos = ref<Videos200Response>();

	const data = reactive({
		selectedTab: "Home",
		search: querySearch,
		sort: ref<SortModel>(["upload_date", "descending"]),
		page: 1,
		pages: 99,
	});

	/**
	 * Fetch the videos according to the query.
	 */
	async function fetchData() {
		const api = useApi();
		const utf8Encoder = new TextEncoder();
		const encodedContent = utf8Encoder.encode(data.search !== "" ? data.search : "none") as unknown as string;
		useRouter().push({ path: useRoute().path, query: { ...useRoute().query, q: data.search } });
		const handleError = (error: unknown) => error && console.error(error);

		const cat = data.selectedTab !== "Home" ? data.selectedTab : "undefined";
		const encodedCategory = utf8Encoder.encode(cat) as unknown as string;
		try {
			const videosResponse = await api?.videos(encodedContent, data.sort[0], data.sort[1].slice(0, -6), "true", data.page, encodedCategory);
			data.pages = Math.ceil(videosResponse.paginationData!.numberOfItems! / 50.0);
			videos.value = videosResponse;
		} catch (error) { handleError(error); }
	}
	watch(data, fetchData, { deep: true });
	await fetchData();
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
					>{{ video.title }}</ThumbVideo>
				</div>
			</div>

			<div class="right">
				<div class="toolbox-card">
					<TextBox v-model="data.search" :placeholder="t.search" icon="search" />
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
							<!-- TODO: OTOMAN WILL IMPLEMENT -->
							<!-- <SortItem id="danmaku" preferOrder="descending">{{ t.sort.danmaku }}</SortItem>
							<SortItem id="comments" preferOrder="descending">{{ t.sort.comment }}</SortItem>
							<SortItem id="favorites" preferOrder="descending">{{ t.sort.favorite }}</SortItem>
							<SortItem id="duration" preferOrder="descending">{{ t.duration }}</SortItem> -->
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
	.card-container {
		display: flex;
		gap: 1rem;

		@include mobile {
			flex-direction: column-reverse;
		}
	}

	.center {
		width: 100%;
	}

	.sort {
		grid-template-columns: repeat(2, 1fr);
	}

	.right {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
