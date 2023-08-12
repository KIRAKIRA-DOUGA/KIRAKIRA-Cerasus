<script setup lang="ts">
	useHead({ title: "首页" });

	const videos = ref<Videos200Response>();
	const route = useRoute();
	const { query } = route;

	const data = reactive({
		selectedTab: "Home",
		search: query.search ?? "none",
		sortCategory: query.sortCategory!,
		sortDirection: query.sortDirection!,
		page: +(query.page ?? 1),
	});

	/* const selectedTab = ref("Home");
	const search = ref(query.search ?? "none");
	const sortCategory = ref(query.sortCategory!);
	const sortDirection = ref(query.sortDirection!);
	const page = ref(+(query.page ?? 1)); */
	
	const numberOfItems = ref(0);
	const numberOfPages = ref(1);

	const categories = ref<Map<string, number | undefined>>();
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
</script>

<template>
	<div class="container">
		<div>
			<TabBar v-if="categories" v-model="data.selectedTab">
				<TabItem id="Home" direction="vertical" icon="home">{{ t.home }}</TabItem>
				<TabItem id="Anime" direction="vertical-reverse" :badge="categories.get('Anime')">{{ t.category_anime }}</TabItem>
				<TabItem id="Music" direction="vertical-reverse" :badge="categories.get('Music')">{{ t.category_music }}</TabItem>
				<TabItem id="Otomad" direction="vertical-reverse" :badge="categories.get('Otomad')">{{ t.category_otomad }}</TabItem>
				<TabItem id="Tech" direction="vertical-reverse" :badge="categories.get('Tech')">{{ t.category_tech }}</TabItem>
				<TabItem id="Design" direction="vertical-reverse" :badge="categories.get('Design')">{{ t.category_design }}</TabItem>
				<TabItem id="Game" direction="vertical-reverse" :badge="categories.get('Game')">{{ t.category_game }}</TabItem>
				<TabItem id="Other" direction="vertical-reverse" :badge="categories.get('Other')">{{ t.category_other }}</TabItem>
			</TabBar>
		</div>
		<Subheader icon="upload" :badge="numberOfItems">{{ t.latest }}</Subheader>
		<Transition name="right" mode="out-in">
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
