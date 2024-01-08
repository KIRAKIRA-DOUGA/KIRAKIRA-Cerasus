<script setup lang="ts">
	// import { Users200Response } from "kirakira-backend";

	const urlUid = computed(currentUserUid);
	// const user = ref<Users200Response>();
	const userBirthday = ref(0);
	const userJoinDate = ref(0);
	const userId = ref<number>();

	const userVideos = ref<GetVideoByUidResponseDto>();

	/** fetch all data */
	async function fetchData() {
		const fetchUserDataPromise = new Promise<void>(resolve => {
			fetchUserData().then(resolve);
		});
		const fetchUserVideoDataPromise = new Promise<void>(resolve => {
			fetchUserVideoData().then(resolve);
		});
		await Promise.allSettled([fetchUserDataPromise, fetchUserVideoDataPromise]);
	}

	/** fetch the user profile data */
	async function fetchUserData() {
		// TODO: 现在获取用户信息的接口还没法获得这些信息
		// const userInfoResult = await api.user.getSelfUserInfo();
		await console.log("TODO -> TODO user info index");
		userBirthday.value = 0; // TODO
		userJoinDate.value = 0; // TODO
		userId.value = -1; // TODO
	}
	/**
	 * fetch the videos according to the query.
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
	fetchData(); // WARN 为什么在此处使用 await 会导致第二次进入用户主页时，Vue 卡死
</script>

<template>
	<div class="container">
		<div class="toolbox-card center">
			<div class="videos-grid">
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
			</div>
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
							<span>{{ formatDateWithLocale(new Date(userBirthday)) }}</span>
						</div>

						<div v-if="userJoinDate" v-tooltip:x="t.user.join_time" class="join-time">
							<Icon name="history" />
							<span>{{ formatDateWithLocale(new Date(userJoinDate)) }}</span>
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
				font-weight: bold;
				font-size: 20px;
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
				font-weight: 600;
				font-size: 32px;
				font-family: $english-logo-fonts;
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
			font-weight: bold;
			font-size: 20px;
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
