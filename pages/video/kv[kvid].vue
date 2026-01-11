<script setup lang="ts">
	const { t } = useI18n();
	import { numbers } from "virtual:scss-var:theme/_variables";
	import { ScrollContainer } from "#components";

	definePageMeta({
		flatAppBar: true,
		hideBottomNav: true,
	});

	const windowSize = useWindowSize();
	const isMobileWidth = computed(() => windowSize.width.value <= numbers.tabletMaxWidth);

	const route = useRoute();
	const kvid = +route.params.kvid;
	const videoSource = ref<string>();
	const videoDetails = ref<VideoData>();
	const isBlockedByUploader = ref(false);
	const selectedTab = ref("info");
	const transitionName = ref("page-jump-in");
	const title = computed(() => videoDetails.value?.title ?? "");
	const thumbnail = computed(() => videoDetails.value?.image || defaultThumbnail);
	const currentLanguage = computed(getCurrentLocale); // 当前用户的语言
	// const recommendations = ref<Videos200ResponseVideosInner[]>();

	const uploaderFollowers = ref(0); // 上传者粉丝数
	const uploaderFollowing = ref(0); // 上传者关注数

	const playing = ref(false);
	const currentTime = ref(NaN);
	const sendDanmaku = ref<DanmakuComment[]>();
	const insertDanmaku = ref<DanmakuListItem[]>();

	type VideoData = GetVideoByKvidResponseDto["video"];

	/**
	 * Fetch video data.
	 */
	async function fetchVideoData() {
		const handleError = (message: string, severity: Parameters<typeof useToast>[1] = "error") => {
			if (environment.client)
				useToast(message, severity);
		};

		if (Number.isFinite(kvid)) {
			const getVideoByKvidRequest: GetVideoByKvidRequestDto = { videoId: kvid };
			const headerCookie = useRequestHeaders(["cookie"]);
			const videoDataResponse = await api.video.getVideoByKvid(getVideoByKvidRequest, headerCookie);

			if (!videoDataResponse.success)
				handleError(t("toast.video_request_failed"));

			if (videoDataResponse.isBlocked)
				navigateToErrorPage(404);

			isBlockedByUploader.value = videoDataResponse.isBlockedByOther;
			const videoData = videoDataResponse.video;
			const videoPartData = videoData?.videoPart?.[0]; // TODO: 因为要做 分P 视频，所以这里获取到的视频是一个数组，这里暂时取了数组第 0 位。应改进为读取数组中的所有视频，并根据 id 排序渲染成 分P 列表
			if (videoData?.title && videoPartData?.link) {
				videoSource.value = videoPartData.link;
				videoDetails.value = {
					videoPart: videoData.videoPart ?? [],
					title: videoData.title ?? "",
					videoTagList: videoData.videoTagList ?? [],
					uploaderInfo: videoData.uploaderInfo,
					uploadDate: videoData.uploadDate,
					videoId: kvid,
					videoCategory: videoData.videoCategory ?? "",
					copyright: videoData.copyright,
					image: videoData.image,
				};

				// 获取上传者的关注数和粉丝数
				if (videoData.uploaderInfo?.uid) {
					fetchUploaderStats(videoData.uploaderInfo.uid);
				}
			} else
				handleError(t("toast.video_invalid_result"));
		} else
			handleError(t("toast.video_no_id"));
	}

	/**
	 * 获取上传者的关注数和粉丝数
	 */
	async function fetchUploaderStats(uid: number) {
		try {
			const headerCookie = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;
			const statsResponse = await api.feed.getFollowStats(uid, headerCookie);
			if (statsResponse.success) {
				uploaderFollowers.value = statsResponse.followerCount ?? 0;
				uploaderFollowing.value = statsResponse.followingCount ?? 0;
			}
		} catch (error) {
			console.error("Failed to fetch uploader stats:", error);
		}
	}

	// 监听事件总线，在关注/取消关注后刷新统计数据
	const uploaderUid = computed(() => videoDetails.value?.uploaderInfo?.uid);
	useListen("feed:refreshFollowStats", (event) => {
		if (event.uid === uploaderUid.value) {
			fetchUploaderStats(event.uid);
		}
	});

	watch(() => kvid, fetchVideoData);
	await fetchVideoData();

	useHead({
		title: title.value,
		meta: [
			{ property: "og:type", content: "video" },
			{ property: "og:title", content: title },
			{ property: "og:description", content: videoDetails.value?.description },
			{ property: "og:image", content: videoDetails.value?.image },
			{ property: "og:image:width", content: 1280 },
			{ property: "og:image:height", content: 720 },
			{ name: "twitter:title", content: title },
			{ name: "twitter:description", content: videoDetails.value?.description },
			{ name: "twitter:image", content: videoDetails.value?.image },
		],
	});

	const [DefineComments, Comments] = createReusableTemplate();
	const [DefineDanmakus, Danmakus] = createReusableTemplate();
</script>

<template>
	<div class="container" :class="{ playing }">
		<DefineComments>
			<ClientOnly>
				<LazyCreationComments :videoId="kvid" :editable="!isBlockedByUploader" />
			</ClientOnly>
		</DefineComments>

		<DefineDanmakus>
			<ClientOnly>
				<PlayerVideoDanmakuList v-model="insertDanmaku" />
				<PlayerVideoDanmakuSender v-model="sendDanmaku" :videoId="videoDetails?.videoId ?? 0" :currentTime :editable="!isBlockedByUploader" />
			</ClientOnly>
		</DefineDanmakus>

		<div class="player-container">
			<PlayerVideo
				v-if="videoSource !== undefined"
				:videoId="videoDetails?.videoId ?? 0"
				:src="videoSource"
				:title
				:thumbnail
				v-model:playing="playing"
				v-model:currentTime="currentTime"
				v-model:sendDanmaku="sendDanmaku"
				v-model:insertDanmaku="insertDanmaku"
			>
				<template #danmaku>
					<Danmakus v-if="!isMobileWidth" />
				</template>
			</PlayerVideo>
			<TabBar v-model="selectedTab" @movingForTransition="name => transitionName = name">
				<TabItem id="info">{{ $t("info") }}</TabItem>
				<TabItem id="comments">{{ $t("comments") }}</TabItem>
				<TabItem id="danmakus">{{ $t("danmaku.title", 2) }}</TabItem>
			</TabBar>
		</div>
		<div class="below-player">
			<component :is="isMobileWidth ? ScrollContainer : 'div'">
				<Transition :name="transitionName" mode="out-in">
					<div v-if="selectedTab === 'info' || !isMobileWidth" class="info">
						<div class="left">
							<CreationDetail
								:date="new Date(videoDetails?.uploadDate!)"
								:category="videoDetails?.videoCategory!"
								:title="videoDetails?.title ?? ''"
								:videoId="videoDetails?.videoId ?? NaN"
								:copyright="(videoDetails?.copyright! as Copyright)"
								:tags="videoDetails?.videoTagList.map(tag => getDisplayVideoTagWithCurrentLanguage(currentLanguage, tag)) ?? []"
								:cover="videoDetails?.image"
							/>
							<p class="description">
								<Preserves>{{ videoDetails?.description }}</Preserves>
							</p>
							<Comments v-if="!isMobileWidth" />
						</div>
						<div class="right">
							<CreationUploader
								:uid="videoDetails?.uploaderInfo?.uid ?? 0"
								:avatar="videoDetails?.uploaderInfo?.avatar"
								:nickname="videoDetails?.uploaderInfo?.userNickname ?? ''"
								:username="videoDetails?.uploaderInfo?.username ?? ''"
								:fans="uploaderFollowing"
								:followers="uploaderFollowers"
								:isFollowing="!!videoDetails?.uploaderInfo?.isFollowing"
								:isSelf="videoDetails?.uploaderInfo?.isSelf"
								@update:isFollowing="(value) => { if (videoDetails?.uploaderInfo) videoDetails.uploaderInfo.isFollowing = value; }"
							/>
						</div>
					</div>
					<div v-else-if="selectedTab === 'comments'">
						<Comments v-if="isMobileWidth" />
					</div>
					<div v-else-if="selectedTab === 'danmakus'" class="danmakus">
						<Danmakus v-if="isMobileWidth" />
					</div>
				</Transition>
			</component>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.container {
		max-width: 1920px;
		margin: 0 auto;

		@include tablet {
			display: flex;
			flex-direction: column;
			height: 100dvh;
			padding: 0;
		}

		@include mobile {
			height: calc(100dvh - $mobile-toolbar-height);
		}
	}

	.player-container {
		@include player-shadow;
		background-color: c(main-bg);

		.tab-bar {
			@include computer {
				display: none;
			}
		}
	}

	.recommendations-header {
		margin: 20px 0 5px 5px;
	}

	.video-recomendation {
		max-width: 100%;
	}

	.tab-bar {
		--clipped: true;
		--full: true;
	}

	.below-player {
		@include tablet {
			flex-grow: 1;
			min-height: 0;

			.scroll-container,
			.scroll-container:deep(> .scroller > .content) {
				@include square(100%);
			}
		}

		.info {
			@include computer {
				display: flex;
				margin-top: 24px;
			}
		}

		.creation-comments {
			width: 100%;
		}

		.danmakus {
			display: flex;
			flex-direction: column;
			height: 100%;
		}

		.info,
		.creation-comments {
			@include tablet {
				padding: $page-padding-x-tablet;
			}

			@include mobile {
				padding: $page-padding-x-mobile;
			}
		}
	}

	.left {
		width: 100%;

		.creation-comments {
			margin-top: 32px;
		}
	}

	.right {
		flex-shrink: 0;

		@include computer {
			width: 350px;
		}
	}

	.description {
		margin: 1.5rem 0;
	}
</style>
