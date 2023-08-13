<script setup lang="ts">
	useHead({ title: "首页" });

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
	const categories = ref<Map<string, number | undefined>>(new Map());
	const handleError = (error: unknown) => console.error(error);

	// fetch the videos according to the query
	watch(data, () => {
		const api = useApi();
		const utf8Encode = new TextEncoder();
		const encodedContent = utf8Encode.encode(data.search) as unknown as string;
		const cat = data.selectedTab !== "Home" ? data.selectedTab : "undefined";
		const encodedCategory = utf8Encode.encode(cat) as unknown as string;

		api?.videos(encodedContent, data.sortCategory, data.sortDirection, "true", data.page, encodedCategory).then(video => {
			numberOfPages.value = Math.ceil(video.paginationData!.numberOfItems! / 50.0);
			numberOfItems.value = video.paginationData!.numberOfItems!;
			videos.value = video;
		}).catch(handleError);

		api?.categories().then(categoriesResult => {
			categories.value = new Map(categoriesResult.map(cat => [cat.name!, cat.cardinality]));
		}).catch(handleError);
	}, { immediate: true, deep: true });
	// TODO: Support SSR.
</script>

<template>
	<div class="container">
		<div>
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
					:badge="categories.get(cat) || ''"
				>
					{{ t["category_" + cat.toLowerCase()] }}
				</TabItem>
			</TabBar>
		</div>
		<Subheader icon="upload" :badge="numberOfItems">{{ t.latest }}</Subheader>
		<Transition :name="transitionName" mode="out-in">
			<div :key="data.selectedTab" class="videos-grid">
				<ThumbVideo
					v-for="video in videos?.videos"
					:key="video.videoID"
					:link="'/videos/kv' + video.videoID ?? ''"
					:uploader="video.authorName ?? ''"
					:image="video.thumbnailLoc"
					:date="new Date()"
					:watchedCount="video.views"
					:duration="new Duration(0, video.videoDuration ?? 0)"
				>{{ video.title }}</ThumbVideo>
			</div>
		</Transition>
		<Pagination v-model="data.page" :pages="numberOfPages" :displayPageCount="12" enableArrowKeyMove />
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
		margin-left: -8px;

		:deep(.items) {
			gap: 0;

			> * {
				width: 72px;
				font-weight: 500;
			}
		}
	}
</style>
