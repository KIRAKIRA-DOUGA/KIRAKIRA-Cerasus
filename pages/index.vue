<script setup lang="ts">
	const { t } = useI18n();
	const videos = ref<ThumbVideoResponseDto>();
	const route = useRoute();
	const { query } = route;
	const transitionName = ref("page-jump-in");

	const data = reactive({
		selectedTab: "Home",
		search: query.search ?? "none",
		sortCategory: query.sortCategory!,
		sortDirection: query.sortDirection!,
		page: +(query.page ?? 1),
	});

	/**
	 * 请求主页视频数据。
	 */
	async function fetchHomePageVideoData() {
		try {
			const headerCookie = useRequestHeaders(["cookie"]);
			videos.value = await api.video.getHomePageThumbVideo(headerCookie);
		} catch (error) {
			// TODO: anyting can do if data fetch field in the home page? -add a 'refresh' button?
			console.error("ERROR", "Unable to fetch home page video data", error);
			useToast(t("toast.something_went_wrong"), "error", 5000);
		}
	}

	/**
	 * 首页视频的守卫进程。
	 * 如果首页视频没有数据，则等待三秒后每隔五秒重新请求视频数据，尝试三次。
	 */
	function homePageDaemon() {
		observeEmptyVarbAndRequestData(
			videos, // 要监听的响应式变量
			(value: typeof videos) => value.value?.videos.length === 0, // 检测方法
			fetchHomePageVideoData, // 如果不成功要执行的操作
			{ delay: 3000, intervalTime: 3000, attempts: 3 }, // 配置
		);
	}

	await fetchHomePageVideoData(); // SSR
	onMounted(homePageDaemon); // Client Mounted

	const categoryItemCount = ref(0);
	const pageCount = ref(1);
	const categoryList = ["Anime", "Music", "Otomad", "Tech", "Design", "Game", "Misc"];
	const categories = ref<Map<string | undefined, number | undefined>>();
	const resultTimestamp = ref(0);

	// 发生用户登录事件时重新获取主页视频数据
	useListen("user:login", async loginStatus => {
		if (loginStatus)
			await fetchHomePageVideoData();
	});
</script>

<template>
	<div class="container">
		<TabBar v-model="data.selectedTab" @movingForTransition="name => transitionName = name">
			<TabItem
				id="Home"
			>{{ $t("home") }}</TabItem>
			<TabItem
				v-for="cat in categoryList"
				:id="cat"
				:key="cat"
				:badge="categories?.get(cat.toLowerCase())"
			>
				{{ $t(`category.${cat.toLowerCase()}`) }}
			</TabItem>
		</TabBar>
		<InfoBar :title="$t('announcement.title')" lite>
			<TransInterpolation keypath="announcement.homepage">
				<template #discord-server>
					<a href="https://discord.gg/uVd9ZJzEy7" target="_blank">{{ $t("platform.discord.server") }}</a>
				</template>
			</TransInterpolation>
		</InfoBar>
		<Subheader icon="upload" :badge="categoryItemCount">{{ $t("latest") }}</Subheader>
		<Transition :name="transitionName" mode="out-in">
			<ThumbGrid :key="resultTimestamp">
				<ThumbVideo
					v-for="video in videos?.videos"
					:key="video.videoId"
					:videoId="video.videoId"
					:uploader="video.uploaderNickname ?? video.uploader ?? 'Unknown uploader'"
					:uploaderId="video.uploaderId"
					:image="video.image"
					:date="new Date(video.uploadDate || 0)"
					:watchedCount="video.watchedCount"
					:duration="new Duration(0, video.duration ?? 0)"
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

		@include not-mobile {
			padding-top: 0 !important;
		}
	}

	.tab-bar {
		--loose: true;
		margin: 0 (-$page-padding-x);

		&:deep(.items) {
			padding: 0 $page-padding-x;
		}

		@include mobile {
			display: none;
		}
	}
</style>
