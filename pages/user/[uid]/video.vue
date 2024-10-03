<script setup lang="ts">
	const displayPageCount = ref(6);
	const sort = ref<SortModel>(["date", "descending"]);

	const route = useRoute();

	const urlUid = ref();
	// SSR
	urlUid.value = currentUserUid();
	// CSR
	const nuxtApp = useNuxtApp();
	nuxtApp.hook("page:finish", () => {
		urlUid.value = currentUserUid();
	});

	const videos = ref<GetVideoByUidResponseDto>();
	const { query } = route;

	const data = reactive({
		uid: urlUid,
		search: query.search ?? "none",
		sortCategory: query.sortCategory!,
		sortDirection: query.sortDirection!,
		page: +(query.page ?? 1),
	});
	const pages = ref(1);

	/**
	 * fetch the videos according to the query.
	 */
	async function fetchUserVideoData() {
		try {
			const getVideoByUidRequest: GetVideoByUidRequestDto = {
				uid: urlUid.value,
			};
			const videosResponse = await api.video.getVideoByUid(getVideoByUidRequest);
			pages.value = Math.max(1, Math.ceil(videosResponse.videosCount / 50));
			videos.value = videosResponse;
		} catch (error) { console.error(error); }
	}
	watch(data, fetchUserVideoData, { deep: true });
	onMounted(fetchUserVideoData);
	await fetchUserVideoData();
</script>

<template>
	<div class="container">
		<div class="toolbox-card center">
			<ThumbGrid>
				<ThumbVideo
					v-for="video in videos?.videos"
					:key="video.videoId"
					:videoId="video.videoId"
					:uploader="video.uploader ?? ''"
					:uploaderId="video.uploaderId"
					:image="video.image"
					:date="new Date()"
					:watchedCount="video.watchedCount"
					:duration="new Duration(0, video.duration ?? 0)"
				>{{ video.title }}</ThumbVideo>
			</ThumbGrid>
		</div>

		<div class="toolbox-card right">
			<section>
				<Subheader icon="sort">{{ t.sort.by }}</Subheader>
				<Sort v-model="sort">
					<SortItem id="date" preferOrder="descending">{{ t.upload_date }}</SortItem>
					<SortItem id="view" preferOrder="descending">{{ t.sort.view }}</SortItem>
					<SortItem id="danmaku" preferOrder="descending">{{ t.sort.danmaku }}</SortItem>
					<SortItem id="comment" preferOrder="descending">{{ t.sort.comment }}</SortItem>
					<SortItem id="favorite" preferOrder="descending">{{ t.sort.favorite }}</SortItem>
					<SortItem id="duration" preferOrder="descending">{{ t.duration }}</SortItem>
					<SortItem id="rating">{{ t.rating }}</SortItem>
				</Sort>
			</section>
			<Pagination v-model="data.page" :pages :displayPageCount enableArrowKeyMove />
		</div>
	</div>
</template>

<style scoped lang="scss">
	$header-height: 134px;
	$main-margin-top: 32px;
</style>
