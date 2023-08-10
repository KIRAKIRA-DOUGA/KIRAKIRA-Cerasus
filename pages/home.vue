<script setup lang="ts">
	import testVideo from "assets/images/cav5-cover.png";
	import testVideo2 from "assets/images/av820864307.jpg";
	import testAudio from "assets/images/av893640047.jpg";
	import { Categories200ResponseInner } from "../packages/kirakira-backend/models/Categories200ResponseInner";

	const selectedTab = ref("Home");

	useHead({ title: "首页" });

	const videos = ref<Videos200Response>();
	const route = useRoute();
	const { query } = route;

	const search = ref(query.search ?? "none");
	const sortCategory = ref(query.sortCategory!);
	const sortDirection = ref(query.sortDirection!);
	const page = ref(+(query.page ?? 1));
	const numberOfItems = ref(0);
	const numberOfPages = ref(1);

	const categories = ref<Map<string, number | undefined>>();

	// fetch the videos according to the query
	watch([() => search.value, () => sortCategory.value, () => sortDirection.value, () => page.value, () => selectedTab.value], ([search, sortCategory, sortDirection, pageValue, categ]) => {
		const api = useApi();
		const utf8Encode = new TextEncoder();
		const encodedContent = utf8Encode.encode(search) as unknown as string;
		const cat = categ !== "Home" ? categ : "undefined";
		const encodedCategory = utf8Encode.encode(cat) as unknown as string;

		api?.videos(encodedContent, sortCategory, sortDirection, "true", pageValue, encodedCategory).then(video => {
			numberOfPages.value = Math.ceil(video.paginationData!.numberOfItems! / 50.0);
			numberOfItems.value = video.paginationData!.numberOfItems!;
			videos.value = video;
		}).catch(error => console.error(error));
		api?.categories().then(categoriesResult => {
			categories.value = new Map(categoriesResult.map(cat => [cat.name!, cat.cardinality]));
		}).catch(error => console.error(error));
	}, { immediate: true });
</script>

<template>
	<div class="container">
		<TabBar v-if="categories" v-model="selectedTab">
			<TabItem id="Home" direction="vertical" icon="home">{{ t.home }}</TabItem>
			<TabItem id="Anime" direction="vertical-reverse" :badge="categories.get('Anime')">{{ t.category_anime }}</TabItem>
			<TabItem id="Music" direction="vertical-reverse" :badge="categories.get('Music')">{{ t.category_music }}</TabItem>
			<TabItem id="Otomad" direction="vertical-reverse" :badge="categories.get('Otomad')">{{ t.category_otomad }}</TabItem>
			<TabItem id="Tech" direction="vertical-reverse" :badge="categories.get('Tech')">{{ t.category_tech }}</TabItem>
			<TabItem id="Design" direction="vertical-reverse" :badge="categories.get('Design')">{{ t.category_design }}</TabItem>
			<TabItem id="Game" direction="vertical-reverse" :badge="categories.get('Game')">{{ t.category_game }}</TabItem>
			<TabItem id="Other" direction="vertical-reverse" :badge="categories.get('Other')">{{ t.category_other }}</TabItem>
		</TabBar>
		<Subheader icon="upload" :badge="numberOfItems">{{ t.latest }}</Subheader>
		<div class="videos-grid">
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
		<Pagination v-model="page" :pages="numberOfPages" :displayPageCount="12" enableArrowKeyMove />
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

	%tabulation {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.videos {
		@extend %tabulation;
		gap: 4px;
		margin: 0 -8px;
	}
</style>
