<script setup lang="ts">
	import type { ThumbVideoResponseDto } from "~/composables/api/Video/VideoControllerDto";
	import { getHomePageThumbVideo } from "../composables/api/Video/VideoController";

	useHead({ title: t.home });

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

	videos.value = await getHomePageThumbVideo();

	const categoryItemCount = ref(0);
	const pageCount = ref(1);
	const categoryList = ["Anime", "Music", "Otomad", "Tech", "Design", "Game", "Misc"];
	const categories = ref<Map<string | undefined, number | undefined>>();
	const resultTimestamp = ref(0);
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
				:badge="categories?.get(cat.toLowerCase())"
			>
				{{ t.category[cat.toLowerCase()] }}
			</TabItem>
		</TabBar>
		<Subheader icon="upload" :badge="categoryItemCount">{{ t.latest }}</Subheader>
		<Transition :name="transitionName" mode="out-in">
			<div :key="resultTimestamp" class="videos-grid">
				<ThumbVideo
					v-for="video in videos?.videos"
					:key="video.videoId"
					:videoId="video.videoId"
					:uploader="video.uploader ?? ''"
					:uploaderId="video.uploaderId"
					:image="video.image"
					:date="new Date(video.updateDate || 0)"
					:watchedCount="video.watchedCount"
					:duration="new Duration(0, video.duration ?? 0)"
				>{{ video.title }}</ThumbVideo>
			</div>
		</Transition>
		<Pagination v-model="data.page" :pages="Math.max(1, pageCount)" :displayPageCount="12" enableArrowKeyMove />
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
