<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/**
		 * 最终视频链接。
		 * @deprecated 目前仅在开发环境中使用，生产环境应该换成 kv 编号。
		 */
		link?: string;
		/** 视频编号 KVID。 */
		videoId?: number;
		/** 图片链接。 */
		image?: string;
		/** 视频上传日期。 */
		date?: Date;
		/** 视频播放量。 */
		watchedCount?: number;
		/** 创作者名称。 */
		uploader?: string;
		/** 创作者编号 UID。 */
		uploaderId?: number;
		/** 视频时长。 */
		duration?: Duration;
		/** 在新窗口打开视频？ */
		blank?: boolean;
	}>(), {
		link: "#",
		videoId: undefined,
		image: undefined,
		date: undefined,
		watchedCount: 0,
		uploaderId: undefined,
		duration: undefined,
		blank: () => useAppSettingsStore().isOpenVideoInNewTab,
	});

	const watchedCount = computed(() => getCompactDecimal(props.watchedCount));
	const duration = computed(() => props.duration ?? Duration.placeholder);
	const link = computed(() => props.videoId !== undefined && props.videoId !== null ?
		`/video/kv${props.videoId}` : props.link);
	const useRelativeDate = useAppSettingsStore().relativeDate;
</script>

<template>
	<LocaleLink class="thumb-video lite" :to="link" :blank>
		<div class="card-wrapper">
			<div v-ripple class="card">
				<div class="cover-wrapper">
					<NuxtImg
						v-if="image"
						:provider="environment.cloudflareImageProvider"
						:src="image"
						alt="cover"
						class="cover"
						:draggable="false"
						format="avif"
						width="320"
						height="180"
						:placeholder="[50, 50, 100, 5]"
					/>
				</div>
				<div class="text-wrapper">
					<div class="title"><slot>视频标题</slot></div>
					<div class="info">
						<div v-if="uploader || uploaderId" class="line">
							<LocaleLink class="item uploader" :to="`/user/${uploaderId ?? ''}`" linkInLink :blank>
								<Icon name="person" />
								<div>{{ uploader ?? uploaderId }}</div>
							</LocaleLink>
						</div>
						<div class="line">
							<div class="item">
								<Icon name="play" />
								<p>{{ watchedCount }}</p>
							</div>
							<div class="item">
								<Icon name="duration" />
								<p class="duration">{{ duration }}</p>
							</div>
							<div v-if="date" class="item">
								<Icon name="calendar" />
								<div><DateTime :dateTime="date" :relativeTime="useRelativeDate && 'short'" /></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</LocaleLink>
</template>

<style scoped lang="scss">
	a:comp {
		@include round-large;
		position: relative;
		display: inline-block;
		min-width: 0;
		color: c(text-color);

		&:not(:has(.uploader:any-hover)):any-hover {
			.title {
				color: c(accent);
			}
		}

		&:any-hover:not(:active) {
			z-index: 1;

			.card-wrapper {
				@include round-large;
				@include system-card;
				translate: 0 -6px;
			}

			.card {
				background-color: c(surface-color);
				backdrop-filter: none;
			}
		}

		&:focus-visible {
			@include large-shadow-focus;
		}

		&:active {
			@include button-scale-pressed;
		}
	}

	.card {
		@include round-large;
		padding: 8px 9px;

		.tile & {
			display: flex;
			gap: 8px;
			align-items: center;
		}

		.list & {
			display: flex;
			gap: 16px;
			align-items: center;
		}
	}

	.cover-wrapper {
		@include round-large;
		flex-shrink: 0;
		aspect-ratio: 16 / 9;
		margin-bottom: 8px;
		overflow: clip;

		img.cover {
			&,
			:deep(img) {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}

		.list &,
		.tile & {
			width: 135px;
			margin-bottom: 0;
		}
	}

	.text-wrapper {
		flex-grow: 1;
		overflow: clip;
	}

	.title {
		overflow: clip;
		font-weight: 500;
		white-space: nowrap;
		text-align: left;
		text-overflow: ellipsis;
		hyphens: auto;

		&:lang(zh, ja) {
			text-overflow: "⋯⋯";
		}

		@supports (display: -webkit-box) {
			// 只有 -webkit-box 才能支持多行省略号
			$title-line-height: 22px;
			// stylelint-disable-next-line value-no-vendor-prefix
			display: -webkit-box;
			-webkit-box-orient: vertical;
			height: $title-line-height * 2;
			line-height: $title-line-height;
			-webkit-line-clamp: 2;
			white-space: normal;
		}
	}

	.info {
		display: flex;
		flex-direction: column;
		gap: 8px;
		justify-content: space-between;
		margin: 6px 0 0 -2px;
		color: c(icon-color);
		font-size: 12px;

		.list & {
			flex-direction: row;
			gap: 14px;
			justify-content: start;
		}

		.line {
			display: flex;
			flex-wrap: wrap;
			gap: 8px 12px;

			.list & {
				gap: 14px;
			}
		}

		.item {
			@include flex-center;
			flex-shrink: 0;
			gap: 2px;
			justify-content: start;

			.icon {
				font-size: 16px;
			}
		}

		.uploader {
			justify-content: start;
			color: c(icon-color);
			text-decoration: none;

			&:any-hover {
				color: c(accent);
				opacity: 1;
			}

			> div {
				overflow: clip;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}

		.duration {
			font-feature-settings: "case" on;
			font-variant-numeric: tabular-nums;
		}
	}
</style>
