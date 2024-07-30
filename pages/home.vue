<script setup lang="ts">
	const videos = ref<ThumbVideoResponseDto>();
	const route = useRoute();
	const { query } = route;
	const transitionName = ref("page-jump");

	const data = reactive({
		selectedTab: "Home",
		search: query.search ?? "none",
		sortCategory: query.sortCategory!,
		sortDirection: query.sortDirection!,
		page: +(query.page ?? 1),
	});

	videos.value = await api.video.getHomePageThumbVideo();

	const categoryItemCount = ref(0);
	const pageCount = ref(1);
	const categoryList = ["Anime", "Music", "Otomad", "Tech", "Design", "Game", "Misc"];
	const categories = ref<Map<string | undefined, number | undefined>>();
	const resultTimestamp = ref(0);

	const appSettings = useAppSettingsStore();
</script>

<template>
	<div class="container">
		<TabBar v-model="data.selectedTab" @movingForTransition="name => transitionName = name">
			<TabItem
				id="Home"
			>{{ t.home }}</TabItem>
			<TabItem
				v-for="cat in categoryList"
				:id="cat"
				:key="cat"
				:badge="categories?.get(cat.toLowerCase())"
			>
				{{ t.category[cat.toLowerCase()] }}
			</TabItem>
		</TabBar>
		<Subheader icon="upload" :badge="categoryItemCount">{{ t.latest }}</Subheader>
		<Transition :name="transitionName" mode="out-in">
			<ThumbGrid :key="resultTimestamp">
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
					:blank="appSettings.isOpenVideoInNewWindow"
				>{{ video.title }}</ThumbVideo>
			</ThumbGrid>
		</Transition>
		<!-- <Pagination v-model="data.page" :pages="Math.max(1, pageCount)" :displayPageCount="12" enableArrowKeyMove /> -->
	</div>
</template>

<style scoped lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding-top: 0 !important;
	}

	.tab-bar {
		--loose: true;

		:deep(.items > *) {
			padding-bottom: 10px;
		}
	}
</style>
