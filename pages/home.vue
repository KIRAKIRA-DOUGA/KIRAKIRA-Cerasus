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

		api?.videos(encodedContent, sortCategory, sortDirection, "true", pageValue, encodedCategory).then(x => {
			numberOfPages.value = Math.ceil(x.paginationData!.numberOfItems! / 50.0);
			numberOfItems.value = x.paginationData!.numberOfItems!;
			videos.value = x;
		}).catch(error => console.error(error));
		api?.categories().then(x => {
			categories.value = new Map(x.map(cat => [cat.name, cat.cardinality]));
		}).catch(error => console.error(error));
	}, { immediate: true });

	const pages = getPages(
		["组件测试页", "/components"],
		["示例视频", "/video"],
		["示例音频", "/audio"],
		["富文本测试页", "/test-rich-text-editor"],
		["API 测试页", "/test-api"],
		["动态图标测试页", "/test-lottie"],
		["搜索", "/search"],
		["投稿", "/upload"],
		["稿件编辑", "/upload/edit"],
		["个人中心", "/user"],
		["内容", "/hello"],
		["下一页", "/next"],
	);

	const httpCodes = getPages(
		233,
		404,
		500,
		502,
		503,
		601,
	);

	type Page = { name: string; link: string };

	/**
	 * 获取页面列表。
	 * @param pages - 页面数组。
	 * @returns 页面对象。
	 */
	function getPages(...pages: [string, string][]): Page[];
	/**
	 * 获取页面列表。
	 * @param httpCodes - HTTP 代码数组。
	 * @returns 页面对象。
	 */
	function getPages(...httpCodes: number[]): Page[];
	/**
	 * 获取页面列表。
	 * @param pages - 页面数组。
	 * @returns 页面对象。
	 */
	function getPages(...pages: ([string, string] | number)[]): Page[] {
		return pages.map(page => (typeof page === "number" ? { name: String(page), link: String(page) } :
			{ name: page[0], link: page[1] }) as Page);
	}
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

		<Subheader icon="science">{{ t.test }}</Subheader>
		<div class="pages">
			<LocaleLink v-for="page in pages" :key="page.name" class="link lite" :to="page.link">{{ page.name }}</LocaleLink>
		</div>
		<Subheader icon="error">{{ t.error_pages }}</Subheader>
		<div class="pages">
			<a v-for="page in httpCodes" :key="page.name" class="link lite" :href="'/error/' + page.link">{{ page.name }}</a>
		</div>
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
	
	.pages {
		@extend %tabulation;

		.link {
			@include round-small;
			padding: 7px 16px;
			background-color: c(accent-10);

			&:hover {
				opacity: 0.75;
			}

			&:focus {
				@include button-shadow-focus;
			}

			.dark & {
				color: c(icon-color);
			}
		}
	}

	.videos {
		@extend %tabulation;
		gap: 4px;
		margin: 0 -8px;
	}
</style>
