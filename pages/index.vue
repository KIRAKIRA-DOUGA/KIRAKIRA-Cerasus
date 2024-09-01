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

		<InfoBar title="计划中的服务器维护" lite>
			各位用户，KIRAKIRA 预计在 2024/09/08 06:00 - 12:00 窗口期内开始服务器维护，预计维护时间 30 分钟，在维护期间可能无法访问。
			<br />
			我们为暂时给您造成的不便表示歉意，并感谢您的理解！
		</InfoBar>

		<InfoBar title="公告" lite>
			目前网站仍然处于早期的公测中，由于用户数量增长速度远超预期，站娘已暂停发放邀请码，请不要一直私聊啦！
			<br />
			上传、关注等功能也因为还在开发中暂时无法开放。但是我们可能会不定期上传一些视频喔～
			<br />
			非常感谢大家对我们的网站能有如此高的热情，但是我们团队所有人都是在业余时间才能开发的，因此速度较为缓慢，希望大家谅解，谢谢啦！❤️
			<br />
			也欢迎有开发或者社区管理能力的人前来联系<a href="https://aira.cafe" target="_blank">站娘</a>～
		</InfoBar>
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
