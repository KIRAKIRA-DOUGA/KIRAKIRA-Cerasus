<script setup lang="ts">
	const urlUid = ref<number>(undefined!);
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
	const followingListRef = ref<InstanceType<typeof UserList>>();
	const followerListRef = ref<InstanceType<typeof UserList>>();

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
	 * 处理关注数点击
	 */
	function handleFollowingClick() {
		if (currentListType.value === "following")
			currentListType.value = "videos";
		else {
			currentListType.value = "following";
			// 使用 nextTick 确保组件已渲染
			nextTick(() => {
				followingListRef.value?.fetchList(true);
			});
		}
	}

	/**
	 * 处理粉丝数点击
	 */
	function handleFollowerClick() {
		if (currentListType.value === "followers")
			currentListType.value = "videos";
		else {
			currentListType.value = "followers";
			// 使用 nextTick 确保组件已渲染
			nextTick(() => {
				followerListRef.value?.fetchList(true);
			});
		}
	}

	/**
	 * 处理关注列表中的取消关注事件
	 */
	function handleUnfollow(uid: number) {
		followingCount.value = Math.max(0, followingCount.value - 1);
	}

	// 监听事件总线，在关注/取消关注后刷新统计数据
	useListen("feed:refreshFollowStats", event => {
		if (event.uid === urlUid.value)
			fetchFollowStats();
	});

	watch(urlUid, fetchData, { deep: true });
	await fetchData();
</script>

<template>
	<div class="container">
		<div class="toolbox-card center">
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
<<<<<<< HEAD
			<UserList
				v-else-if="currentListType === 'following'"
				ref="followingListRef"
				:target-uid="urlUid"
				list-type="following"
				@unfollow="handleUnfollow"
			/>

			<!-- 粉丝列表 -->
			<UserList
				v-else-if="currentListType === 'followers'"
				ref="followerListRef"
				:target-uid="urlUid"
				list-type="followers"
			/>
=======
			<div v-else-if="currentListType === 'following'" class="user-list">
				<UserCard
					v-for="user in followingList"
					:key="user.uid"
					:uid="user.uid"
					:avatar="user.avatar"
					:userNickname="user.userNickname"
					:username="user.username"
					:isFollowing="true"
					@update:isFollowing="(value) => { if (!value) { const index = followingList.findIndex(u => u.uid === user.uid); if (index !== -1) followingList.splice(index, 1); followingCount = Math.max(0, followingCount - 1); } }"
				/>
				<div v-if="isLoadingList" class="loading">
					<ProgressRing />
				</div>
				<div v-else-if="!hasMoreFollowing && followingList.length === 0" class="empty">¯\_(ツ)_/¯</div>
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
					@update:isFollowing="(value) => { const targetUser = followerList.find(u => u.uid === user.uid); if (targetUser) targetUser.isFollowing = value; }"
				/>
				<div v-if="isLoadingList" class="loading">
					<ProgressRing />
				</div>
				<div v-else-if="!hasMoreFollowers && followerList.length === 0" class="empty">¯\_(ツ)_/¯</div>
			</div>
>>>>>>> a82e2d2908f427538e7f8df866c1d8018d6ba6c4
		</div>

		<div class="right">
			<Button v-if="urlUid === selfUserInfoStore.userInfo.uid" href="/upload">{{ $t("manage_content") }}</Button>

			<div class="toolbox-card">
				<div class="user-counts">
					<div class="clickable" :class="{ active: currentListType === 'following' }" @click="handleFollowingClick">
						<span class="value">{{ followingCount }}</span>
						<p>{{ $t("following", followingCount) }}</p>
					</div>
					<div class="clickable" :class="{ active: currentListType === 'followers' }" @click="handleFollowerClick">
						<span class="value">{{ followerCount }}</span>
						<p>{{ $t("follower", followerCount) }}</p>
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

			&,
			.value {
				transition: $fallback-transitions, color $ease-out-expo 200ms;
			}

			&:any-hover .value {
				color: c(accent);
			}

			&.active .value {
				color: c(accent);
			}
		}
	}

	.center {
		max-height: calc(100dvh - 200px);
		overflow: hidden auto;
	}

<<<<<<< HEAD
=======
	.user-list {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.loading {
		@include flex-center;
		padding: 32px;
		color: c(icon-color);
	}

	.empty {
		@include flex-center;
		padding: 32px;
		color: c(icon-color, 50%);
	}

>>>>>>> a82e2d2908f427538e7f8df866c1d8018d6ba6c4
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
