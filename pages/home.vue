<script setup lang="ts">
	useHead({ title: t.home });

	const videos = ref<Videos200Response>();
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

	const numberOfItems = ref(0);
	const numberOfPages = ref(1);
	const categoryList = ["Anime", "Music", "Otomad", "Tech", "Design", "Game", "Other"];
	const categories = ref<Map<string | undefined, number | undefined>>();
	const resultTimestamp = ref(0);

	/**
	 * Fetch the videos according to the query.
	 */
	async function fetchData() {
		const api = useApi();
		const utf8Encoder = new TextEncoder();
		const encodedContent = utf8Encoder.encode(data.search) as unknown as string;
		const cat = data.selectedTab !== "Home" ? data.selectedTab : "undefined";
		const encodedCategory = utf8Encoder.encode(cat) as unknown as string;
		const handleError = (error: unknown) => error && console.error(error);

		try {
			const videosResponse = await api?.videos(encodedContent, data.sortCategory, data.sortDirection, "true", data.page, encodedCategory);
			numberOfPages.value = Math.ceil(videosResponse.paginationData!.numberOfItems! / 50.0);
			numberOfItems.value = videosResponse.paginationData!.numberOfItems!;
			videos.value = videosResponse;
			resultTimestamp.value = new Date().valueOf();
			// pepelaugh TODO FIXME
			categories.value = new Map(videosResponse?.categories?.map(cat => [cat.name, cat.cardinality]));
		} catch (error) { handleError(error); }
	}
	watch(data, fetchData, { deep: true });
	await fetchData();
</script>

<template>
	<div class="container">
		<TabBar v-model="data.selectedTab" @movingForTransition="name => transitionName = name">
			<TabItem
				id="Home"
				direction="vertical"
				icon="home"
			>{{ t.home }}</TabItem>
			<TabItem
				v-for="cat in categoryList"
				:id="cat"
				:key="cat"
				direction="vertical-reverse"
				:badge="categories.get(cat.toLowerCase())"
			>
				{{ t.category[cat.toLowerCase()] }}
			</TabItem>
		</TabBar>
		<Subheader icon="upload" :badge="numberOfItems">{{ t.latest }}</Subheader>
		<Transition :name="transitionName" mode="out-in">
			<div :key="resultTimestamp" class="videos-grid">
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
		</Transition>
		<Pagination v-model="data.page" :pages="Math.max(1, numberOfPages)" :displayPageCount="12" enableArrowKeyMove />
	</div>
</template>

<style scoped lang="scss">
	.container {
		padding-top: 0 !important;

		> * {
			margin: 26px 0;
		}
	}

	.tab-bar {
		--loose: true;

		:deep(.items) {
			gap: 0;
			margin-left: -8px;

			> * {
				width: 72px;
				font-weight: 500;
			}
		}
	}
</style>
