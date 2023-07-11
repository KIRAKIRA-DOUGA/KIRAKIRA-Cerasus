<script setup lang="ts">
	import testVideo from "assets/images/cav5-cover.png";

	const displayPageCount = ref(6);
	const sort = ref<SortModel>(["date", "descending"]);

	const router = useRouter();
	const id = router.currentRoute.value.path.split("/")[2];

	const videos = ref<User>();

	const queryVals = router.currentRoute.value.query;

	const search = ref(queryVals.search?.toString() ?? "none");
	const sortCategory = ref(queryVals.sortCategory?.toString());
	const sortDirection = ref(queryVals.sortDirection?.toString());
	const page = ref(parseInt(queryVals.page?.toString() ?? "1"));
	const pages = ref(1);

	// fetch the videos according to the query
	watch([() => search.value, () => sortCategory.value, () => sortDirection.value, () => page.value], async ([newSearch, newSortCategory, newSortDirection, newPageValue]) => {
		const api = useApi();
		const utf8Encode = new TextEncoder();
		const encodedContent = utf8Encode.encode(newSearch);
		api.users(id).then(x => {
			pages.value = Math.ceil(x.paginationData.numberOfItems / 50.0);
			videos.value = x;
		})
			.catch((error: any) => console.error(error));
	}, { immediate: true });
</script>

<template>
	<div class="container">
		<div class="toolbox-card center">
			<div class="videos-grid">
				<ThumbVideo
					v-for="video in videos?.videos"
					:key="video.videoID"
					:link="'/videos/' + video.videoID ?? ''"
					:uploader="video.authorName ?? ''"
					:image="video.thumbnailLoc"
					:date="new Date()"
					:watchedCount="video.views"
					:duration="new Duration(2, 33)"
				>{{ video.title }}</ThumbVideo>
			</div>
			<!-- <PaginationSimple v-model="page" :pages="pages" :displayPageCount="8" enableArrowKeyMove /> -->

		</div>

		<div class="toolbox-card right">
			<Subheader icon="sort">排序</Subheader>
			<Sort v-model="sort">
				<SortItem id="date" preferOrder="descending">投稿日期</SortItem>
				<SortItem id="play" preferOrder="descending">播放数</SortItem>
				<SortItem id="danmaku" preferOrder="descending">弹幕数</SortItem>
				<SortItem id="comment" preferOrder="descending">评论数</SortItem>
				<SortItem id="star" preferOrder="descending">收藏数</SortItem>
				<SortItem id="duration">视频时长</SortItem>
			</Sort>
			<Pagination v-model="page" :pages="pages" :displayPageCount="displayPageCount" enableArrowKeyMove />
		</div>
	</div>
</template>

<style scoped lang="scss">
	$header-height: 134px;
	$main-margin-top: 32px;
</style>
