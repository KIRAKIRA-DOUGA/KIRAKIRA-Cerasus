<script setup lang="ts">
	import type { UserInfoForFollowList } from "api/Feed/FeedControllerDto";

	const urlUid = ref();
	// SSR
	urlUid.value = currentUserUid();
	// CSR
	const nuxtApp = useNuxtApp();
	nuxtApp.hook("page:finish", () => {
		urlUid.value = currentUserUid();
	});

	const selfUserInfoStore = useSelfUserInfoStore();

	const userBirthday = ref(0);
	const userJoinDate = ref(0);
	const userId = ref<number>();

	const userVideos = ref<GetVideoByUidResponseDto>();

	const followingCount = ref(0);
	const followerCount = ref(0);

	// 列表显示相关
	const currentListType = ref<"videos" | "following" | "followers">("videos");
	const followingList = ref<UserInfoForFollowList[]>([]);
	const followerList = ref<UserInfoForFollowList[]>([]);
	const isLoadingList = ref(false);
	const hasMoreFollowing = ref(true);
	const hasMoreFollowers = ref(true);
	const followingPage = ref(1);
	const followerPage = ref(1);
	const PAGE_SIZE = 18;

	/**
	 * Fetch all data.
	 */
	async function fetchData() {
		const fetchUserDataPromise = new Promise<void>(resolve => {
			fetchUserData().then(resolve);
		});
		const fetchUserVideoDataPromise = new Promise<void>(resolve => {
			fetchUserVideoData().then(resolve);
		});
		const fetchFollowStatsPromise = new Promise<void>(resolve => {
			fetchFollowStats().then(resolve);
		});
		await Promise.allSettled([fetchUserDataPromise, fetchUserVideoDataPromise, fetchFollowStatsPromise]);
	}

	/**
	 * Fetch the user profile data.
	 */
	async function fetchUserData() {
		// TODO: 现在获取用户信息的接口还没法获得这些信息

		const getUserInfoByUidRequest: GetUserInfoByUidRequestDto = {
			uid: urlUid.value,
		};
		const userInfoResult = await api.user.getUserInfo(getUserInfoByUidRequest);
		if (userInfoResult.success) {
			const userInfo = userInfoResult.result;
			userJoinDate.value = userInfo?.userCreateDateTime ?? 0; // TODO
		}
		userBirthday.value = 0; // TODO
		userId.value = urlUid.value; // TODO
	}

	/**
	 * Fetch the videos according to the query.
	 */
	async function fetchUserVideoData() {
		try {
			const getVideoByUidRequest: GetVideoByUidRequestDto = {
				uid: urlUid.value,
			};
			const videosResponse = await api.video.getVideoByUid(getVideoByUidRequest);
			userVideos.value = videosResponse;
		} catch (error) { console.error(error); }
	}

	/**
	 * Fetch the follow stats (following count and follower count).
	 */
	async function fetchFollowStats() {
		try {
			if (!urlUid.value) return;
			// 只在服务端使用 useRequestHeaders，客户端会自动通过 credentials: "include" 传递 cookie
			const headerCookie = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;
			const statsResponse = await api.feed.getFollowStats(urlUid.value, headerCookie);
			if (statsResponse.success) {
				followingCount.value = statsResponse.followingCount ?? 0;
				followerCount.value = statsResponse.followerCount ?? 0;
			}
		} catch (error) {
			console.error("Failed to fetch follow stats:", error);
		}
	}

	/**
	 * 获取关注列表
	 */
	async function fetchFollowingList(reset = false) {
		if (isLoadingList.value || !hasMoreFollowing.value) return;
		if (reset) {
			followingPage.value = 1;
			followingList.value = [];
			hasMoreFollowing.value = true;
		}

		isLoadingList.value = true;
		try {
			const headerCookie = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;
			const response = await api.feed.getFollowingList(urlUid.value, followingPage.value, PAGE_SIZE, headerCookie);
			if (response.success && response.result) {
				if (reset) {
					followingList.value = response.result;
				} else {
					followingList.value.push(...response.result);
				}
				hasMoreFollowing.value = followingList.value.length < (response.totalCount ?? 0);
				if (hasMoreFollowing.value) {
					followingPage.value++;
				}
			} else {
				hasMoreFollowing.value = false;
			}
		} catch (error) {
			console.error("Failed to fetch following list:", error);
			hasMoreFollowing.value = false;
		}
		isLoadingList.value = false;
	}

	/**
	 * 获取粉丝列表
	 */
	async function fetchFollowerList(reset = false) {
		if (isLoadingList.value || !hasMoreFollowers.value) return;
		if (reset) {
			followerPage.value = 1;
			followerList.value = [];
			hasMoreFollowers.value = true;
		}

		isLoadingList.value = true;
		try {
			const headerCookie = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;
			const response = await api.feed.getFollowerList(urlUid.value, followerPage.value, PAGE_SIZE, headerCookie);
			if (response.success && response.result) {
				if (reset) {
					followerList.value = response.result;
				} else {
					followerList.value.push(...response.result);
				}
				hasMoreFollowers.value = followerList.value.length < (response.totalCount ?? 0);
				if (hasMoreFollowers.value) {
					followerPage.value++;
				}
			} else {
				hasMoreFollowers.value = false;
			}
		} catch (error) {
			console.error("Failed to fetch follower list:", error);
			hasMoreFollowers.value = false;
		}
		isLoadingList.value = false;
	}

	/**
	 * 处理关注数点击
	 */
	function handleFollowingClick() {
		if (currentListType.value === "following") {
			currentListType.value = "videos";
		} else {
			currentListType.value = "following";
			if (followingList.value.length === 0) {
				fetchFollowingList(true);
			}
		}
	}

	/**
	 * 处理粉丝数点击
	 */
	function handleFollowerClick() {
		if (currentListType.value === "followers") {
			currentListType.value = "videos";
		} else {
			currentListType.value = "followers";
			if (followerList.value.length === 0) {
				fetchFollowerList(true);
			}
		}
	}

	/**
	 * 无限滚动处理
	 */
	const listContainer = ref<HTMLElement>();
	function handleScroll() {
		if (!listContainer.value || isLoadingList.value) return;
		const container = listContainer.value;
		const scrollBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
		if (scrollBottom < 100) {
			if (currentListType.value === "following" && hasMoreFollowing.value) {
				fetchFollowingList();
			} else if (currentListType.value === "followers" && hasMoreFollowers.value) {
				fetchFollowerList();
			}
		}
	}

	// 注册刷新函数到父组件，以便在关注/取消关注后刷新数据
	const refreshFollowStats = inject<Ref<(() => void) | undefined>>("refreshFollowStats");
	if (refreshFollowStats) {
		refreshFollowStats.value = fetchFollowStats;
	}

	watch(urlUid, fetchData, { deep: true });
	await fetchData();
</script>

<template>
	<div class="container">
		<div ref="listContainer" class="toolbox-card center" @scroll="handleScroll">
			<!-- 视频列表 -->
			<ThumbGrid v-if="currentListType === 'videos'">
				<ThumbVideo
					v-for="video in userVideos?.videos"
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

			<!-- 关注列表 -->
			<div v-else-if="currentListType === 'following'" class="user-list">
				<UserCard
					v-for="user in followingList"
					:key="user.uid"
					:uid="user.uid"
					:avatar="user.avatar"
					:userNickname="user.userNickname"
					:username="user.username"
					:isFollowing="true"
				/>
				<div v-if="isLoadingList" class="loading">
					<Icon name="refresh" class="spinning" />
				</div>
				<div v-else-if="!hasMoreFollowing && followingList.length === 0" class="empty">
					这里暂时还没有数据捏~(￣▽￣)~*
				</div>
			</div>

			<!-- 粉丝列表 -->
			<div v-else-if="currentListType === 'followers'" class="user-list">
				<UserCard
					v-for="user in followerList"
					:key="user.uid"
					:uid="user.uid"
					:avatar="user.avatar"
					:userNickname="user.userNickname"
					:username="user.username"
					:isFollowing="user.isFollowing"
				/>
				<div v-if="isLoadingList" class="loading">
					<Icon name="refresh" class="spinning" />
				</div>
				<div v-else-if="!hasMoreFollowers && followerList.length === 0" class="empty">
					这里暂时还没有数据捏~(￣▽￣)~*
				</div>
			</div>
		</div>

		<div class="right">
			<Button v-if="urlUid === selfUserInfoStore.userInfo.uid" href="/upload">{{ $t("manage_content") }}</Button>

			<div class="toolbox-card">
				<div class="user-counts">
					<div class="clickable" :class="{ active: currentListType === 'following' }" @click="handleFollowingClick">
						<span class="value">{{ followingCount }}</span>
						<p>{{ $t("following", 2) }}</p>
					</div>
					<div class="clickable" :class="{ active: currentListType === 'followers' }" @click="handleFollowerClick">
						<span class="value">{{ followerCount }}</span>
						<p>{{ $t("follower", 2) }}</p>
					</div>
					<div>
						<span class="value">{{ 0 }}</span>
						<p>{{ $t("watched", 2) }}</p>
					</div>
					<div>
						<span class="value">{{ 0 }}</span>
						<p>{{ $t("rating", 2) }}</p>
					</div>
				</div>
			</div>

			<div class="toolbox-card user-info-container">
				<div class="user-info">
					<h3>{{ $t("user.info") }}</h3>
					<div class="items">
						<div v-if="userBirthday" v-tooltip:x="$t('user.birthday')" class="birthday">
							<Icon name="birthday" />
							<DateTime :dateTime="new Date(userBirthday)" />
						</div>

						<div v-if="userJoinDate" v-tooltip:x="$t('user.join_time')" class="join-time">
							<Icon name="history" />
							<DateTime :dateTime="new Date(userJoinDate)" />
						</div>

						<div v-tooltip:x="'UID'" class="uid">
							<Icon name="fingerprint" />
							<span>{{ userId }}</span>
						</div>
					</div>
					<div class="shading shading-title">
						Info
					</div>
					<div class="shading shading-icon">
						<Icon name="person" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.container {
		display: flex;
	}

	.right {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		@include tablet {
			width: 100%;
		}
	}

	.user-counts {
		display: flex;
		justify-content: space-around;

		> * {
			@include flex-center;
			flex-direction: column;

			span {
				font-size: 20px;
				font-weight: bold;
			}

			p {
				color: c(icon-color);
				font-size: 13px;
			}
		}

		.clickable {
			cursor: pointer;
			transition: color 0.2s;

			.value {
				transition: color 0.2s;
			}

			&:any-hover {
				.value {
					color: c(accent);
				}
			}

			&.active {
				.value {
					color: c(accent);
				}
			}
		}
	}

	.center {
		max-height: calc(100vh - 200px);
		overflow-y: auto;
		overflow-x: hidden;
	}

	.user-list {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.loading {
		@include flex-center;
		padding: 32px;
		color: c(icon-color);

		.spinning {
			font-size: 24px;
			animation: spin 1s linear infinite;
		}
	}

	.empty {
		@include flex-center;
		padding: 32px;
		color: c(icon-color);
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.user-info-container {
		position: relative;

		.shading {
			position: absolute;
			right: 16px;
			color: c(gray-80, 5%);

			&.shading-title {
				top: 10px;
				font-family: $english-logo-fonts;
				font-size: 32px;
				font-weight: 600;
				font-style: italic;
				text-align: center;
				text-transform: capitalize;
			}

			&.shading-icon {
				bottom: 0;
				font-size: 48px;
			}
		}
	}

	.user-info {
		h3 {
			font-size: 20px;
			font-weight: bold;
		}

		.items {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			margin-top: 1rem;

			> * {
				display: flex;
				gap: 8px;
				align-items: center;
			}

			.icon {
				font-size: 24px;
			}
		}

		.birthday .icon {
			color: c(pink);
		}

		.join-time .icon {
			color: c(yellow);
		}

		.uid .icon {
			color: c(green);
		}
	}
</style>
