<script setup lang="ts">
	const displayPageCount = ref(6);
	const sort = ref<SortModel>(["date", "descending"]);

	const route = useRoute();
	const uid = currentUserUid();
	const videos = ref<Videos200Response>();
	const { query } = route;

	const data = reactive({
		search: query.search ?? "none",
		sortCategory: query.sortCategory!,
		sortDirection: query.sortDirection!,
		page: +(query.page ?? 1),
	});
	const pages = ref(1);

	/**
	 * fetch the videos according to the query.
	 */
	async function fetchData() {
		const api = useApi();
		try {
			const videoResponse = await api.users(uid);
			pages.value = Math.ceil(videoResponse.paginationData!.numberOfItems! / 50);
			videos.value = videoResponse;
		} catch (error) { console.error(error); }
	}
	watch(data, fetchData, { deep: true });
	await fetchData();
</script>

<template>
	<div class="container">
		<div class="toolbox-card center">
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

		<div class="toolbox-card right">
			<section>
				<Subheader icon="sort">{{ t.sort_by }}</Subheader>
				<Sort v-model="sort">
					<SortItem id="date" preferOrder="descending">{{ t.upload_date }}</SortItem>
					<SortItem id="view" preferOrder="descending">{{ t.sort_view }}</SortItem>
					<SortItem id="danmaku" preferOrder="descending">{{ t.sort_danmaku }}</SortItem>
					<SortItem id="comment" preferOrder="descending">{{ t.sort_comment }}</SortItem>
					<SortItem id="favorite" preferOrder="descending">{{ t.sort_favorite }}</SortItem>
					<SortItem id="duration" preferOrder="descending">{{ t.duration }}</SortItem>
					<SortItem id="rating">{{ t.rating }}</SortItem>
				</Sort>
			</section>
			<Pagination v-model="data.page" :pages="pages" :displayPageCount="displayPageCount" enableArrowKeyMove />
		</div>
	</div>
</template>

<style scoped lang="scss">
	$header-height: 134px;
	$main-margin-top: 32px;
</style>
