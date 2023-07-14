<script setup lang="ts">
	import testVideo from "assets/images/cav5-cover.png";

	const displayPageCount = ref(6);
	const sort = ref<SortModel>(["date", "descending"]);

	const route = useRoute();
	const id = currentUserUid();
	const videos = ref<Videos200Response>();
	const { query } = route;

	const search = ref(query.search ?? "none");
	const sortCategory = ref(query.sortCategory!);
	const sortDirection = ref(query.sortDirection!);
	const page = ref(+(query.page ?? 1));
	const pages = ref(1);

	// fetch the videos according to the query
	watch([() => search.value, () => sortCategory.value, () => sortDirection.value, () => page.value], () => {
		const api = useApi();
		api.users(id).then(video => {
			pages.value = Math.ceil(video.paginationData!.numberOfItems! / 50.0);
			videos.value = video;
		}).catch(error => console.error(error));
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
			<section>
				<Subheader icon="sort">排序</Subheader>
				<Sort v-model="sort">
					<SortItem id="date" preferOrder="descending">投稿日期</SortItem>
					<SortItem id="play" preferOrder="descending">播放数</SortItem>
					<SortItem id="danmaku" preferOrder="descending">弹幕数</SortItem>
					<SortItem id="comment" preferOrder="descending">评论数</SortItem>
					<SortItem id="star" preferOrder="descending">收藏数</SortItem>
					<SortItem id="duration">视频时长</SortItem>
				</Sort>
			</section>
			<Pagination v-model="page" :pages="pages" :displayPageCount="displayPageCount" enableArrowKeyMove />
		</div>
	</div>
</template>

<style scoped lang="scss">
	$header-height: 134px;
	$main-margin-top: 32px;
</style>
