<script setup lang="ts">
	useHead({ title: "首页" });

	const videos = ref<CapitalizeObject<Videos200Response>>(); // TODO: API 返回是大驼峰，而之前的 interface 又是小驼峰，后期可能需要重新写一下 interface。
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
	const handleError = (error: unknown) => error && console.error(error);

	// fetch the videos according to the query
	// watch(data, () => {
	// 	const api = useApi();
	// 	const utf8Encode = new TextEncoder();
	// 	const encodedContent = utf8Encode.encode(data.search) as unknown as string;
	// 	const cat = data.selectedTab !== "Home" ? data.selectedTab : "undefined";
	// 	const encodedCategory = utf8Encode.encode(cat) as unknown as string;

	// 	api?.videos(encodedContent, data.sortCategory, data.sortDirection, "true", data.page, encodedCategory).then(video => {
	// 		numberOfPages.value = Math.ceil(video.paginationData!.numberOfItems! / 50.0);
	// 		numberOfItems.value = video.paginationData!.numberOfItems!;
	// 		videos.value = video;
	// 	}).catch(handleError);

	// 	api?.categories().then(categoriesResult => {
	// 		categories.value = new Map(categoriesResult.map(cat => [cat.name!, cat.cardinality]));
	// 	}).catch(handleError);
	// }, { immediate: true, deep: true });

	const config = useRuntimeConfig();
	const siteUrl = config.public.siteUrl;
	console.log(siteUrl);

	const encoder = new TextEncoder();
	const videosAsyncData = await useFetch(siteUrl + "/api/videos", {
		method: "GET",
		body: undefined,
		credentials: "same-origin",
		headers: {
			Accept: "application/json, */*;q=0.8",
			unapproved: "true",
			pageNumber: 1,
			search: encoder.encode("none"),
			category: encoder.encode("undefined"),
		} as never,
	});
	console.log(videosAsyncData);
	handleError(videosAsyncData.error.value);
	const videosResponse = videosAsyncData.data.value as CapitalizeObject<Videos200Response>;
	numberOfPages.value = Math.ceil(videosResponse.PaginationData!.NumberOfItems! / 50);
	numberOfItems.value = videosResponse.PaginationData!.NumberOfItems!;
	videos.value = videosResponse;

	const categoriesAsyncData = await useFetch(siteUrl + "/api/categories");
	handleError(categoriesAsyncData.error.value);
	const categoriesResponse = categoriesAsyncData.data.value as CapitalizeObject<Categories200ResponseInner>[];
	categories.value = new Map(categoriesResponse.map(cat => [cat.Name!, cat.Cardinality]));

	// fetch("https://localhost:3000/api/videos", { method: "GET", body: undefined, credentials: "same-origin", headers: { Accept: "application/json, */*;q=0.8", search: t.encode("none"), unapproved: "true", pageNumber: 1, category: t.encode("undefined") } }).then(r => r.text()).then(r => console.log(r))
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
					v-for="video in videos?.Videos"
					:key="video.VideoID"
					:link="'/videos/kv' + video.VideoID ?? ''"
					:uploader="video.AuthorName ?? ''"
					:image="video.ThumbnailLoc"
					:date="new Date()"
					:watchedCount="video.Views"
					:duration="new Duration(0, video.VideoDuration ?? 0)"
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
