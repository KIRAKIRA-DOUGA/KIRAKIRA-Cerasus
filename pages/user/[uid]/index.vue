<script setup lang="ts">
	import { Users200Response } from "kirakira-backend";

	const uid = currentUserUid();
	const user = ref<Users200Response>();

	const data = reactive({
		uid,
	});

	/** fetch the user profile data */
	async function fetchData() {
		const api = useApi();
		try {
			user.value = await api.users(uid);
		} catch (error) { console.error(error); }
	}
	watch(data, fetchData, { deep: true });
	await fetchData();
</script>

<template>
	<div class="container">
		<div class="toolbox-card center">
			<div class="videos-grid">
				<ThumbVideo
					v-for="video in user?.videos"
					:key="video.videoID"
					:videoId="video.videoID"
					:uploader="video.authorName ?? ''"
					:uploaderId="video.authorID"
					:image="video.thumbnailLoc"
					:date="new Date()"
					:watchedCount="video.views"
					:duration="new Duration(0, video.videoDuration ?? 0)"
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
						<div v-if="user?.birthdate" v-tooltip:x="t.user.birthday" class="birthday">
							<Icon name="birthday" />
							<span>{{ formatDateWithLocale(new Date(user?.birthdate)) }}</span>
						</div>

						<div v-if="user?.joinDate" v-tooltip:x="t.user.join_time" class="join-time">
							<Icon name="history" />
							<span>{{ formatDateWithLocale(new Date(user?.joinDate)) }}</span>
						</div>

						<div v-tooltip:x="'UID'" class="uid">
							<Icon name="fingerprint" />
							<span>{{ user?.userID }}</span>
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
