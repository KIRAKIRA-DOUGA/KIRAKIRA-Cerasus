<script setup lang="ts">
	const urlUid = ref();
	// SSR
	urlUid.value = currentUserUid();
	// CSR
	const nuxtApp = useNuxtApp();
	nuxtApp.hook("page:finish", () => {
		urlUid.value = currentUserUid();
	});

	const userBirthday = ref(0);
	const userJoinDate = ref(0);
	const userId = ref<number>();

	const userVideos = ref<GetVideoByUidResponseDto>();

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
		await Promise.allSettled([fetchUserDataPromise, fetchUserVideoDataPromise]);
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
	watch(urlUid, fetchData, { deep: true });
	await fetchData();
</script>

<template>
	<div class="container">
		<div class="toolbox-card center">
			<ThumbGrid>
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
		</div>

		<div class="right">
			<div class="toolbox-card">
				<div class="user-counts">
					<div>
						<span class="value">{{ 0 }}</span>
						<p>{{ t(0).follow }}</p>
					</div>
					<div>
						<span class="value">{{ 0 }}</span>
						<p>{{ t(0).fans }}</p>
					</div>
					<div>
						<span class="value">{{ 0 }}</span>
						<p>{{ t(0).watched }}</p>
					</div>
					<div>
						<span class="value">{{ 0 }}</span>
						<p>{{ t(0).rating }}</p>
					</div>
				</div>
			</div>

			<div class="toolbox-card user-info-container">
				<div class="user-info">
					<h3>{{ t.user.info }}</h3>
					<div class="items">
						<div v-if="userBirthday" v-tooltip:x="t.user.birthday" class="birthday">
							<Icon name="birthday" />
							<DateTime :dateTime="new Date(userBirthday)" />
						</div>

						<div v-if="userJoinDate" v-tooltip:x="t.user.join_time" class="join-time">
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
			color: c(orange);
		}

		.uid .icon {
			color: c(green);
		}
	}
</style>
