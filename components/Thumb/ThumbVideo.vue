<script setup lang="ts">
	import testBackground from "assets/images/test-background.png";

	const props = withDefaults(defineProps<{
		/** 最终视频链接。目前仅在开发环境中使用，生产环境应该换成 kv 编号。 */
		link: string;
		/** 图片链接。 */
		image?: string;
		/** 视频上传日期。 */
		date?: Date;
		/** 视频播放量。 */
		watchedCount?: number;
		/** UP 主名称。 */
		uploader: string;
		/** 视频时长。 */
		duration?: Duration;
		/** 在新窗口打开视频？ */
		blank?: boolean;
	}>(), {
		image: testBackground,
		date: undefined,
		watchedCount: 0,
		duration: undefined,
	});

	const date = computed(() => props.date ? formatDate(props.date, "yyyy/MM/dd") : "----/--/--");
	const watchedCount = computed(() => getWatchCount(props.watchedCount));
	const duration = computed(() => props.duration ?? "--:--");
</script>

<template>
	<LocaleLink class="thumb-video lite" :to="link" :blank="blank">
		<div class="card">
			<div class="cover-wrapper">
				<img :src="image" alt="cover" class="cover" />
			</div>
			<div class="text-wrapper">
				<div class="title"><slot>视频标题</slot></div>
				<div class="info">
					<div class="line">
						<div class="item">
							<Icon name="play" />
							<p>{{ watchedCount }}</p>
						</div>
						<div class="item">
							<Icon name="time" />
							<p>{{ duration }}</p>
						</div>
					</div>
					<div class="line">
						<LocaleLink class="item uploader" to="/user" linkInLink :blank="blank">
							<Icon name="person" />
							<div>{{ uploader }}</div>
						</LocaleLink>
						<div class="item">
							<Icon name="calendar" />
							<div>{{ date }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</LocaleLink>
</template>

<style scoped lang="scss">
	.thumb-video {
		@include round-large;
		--view: grid;
		position: relative;
		display: inline-block;
		color: c(text-color);

		@container style(--view: list) {
			width: 100%;
		}

		&:any-hover:not(:active) {
			z-index: 1;

			.card {
				@include system-card;
				translate: 0 -6px;
				background-color: c(surface-color);
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

		@container style(--view: tile) {
			display: flex;
			gap: 8px;
			align-items: center;
		}

		@container style(--view: list) {
			display: flex;
			gap: 16px;
			align-items: center;
		}
	}

	.cover-wrapper {
		@include round-large;
		overflow: hidden;
		aspect-ratio: 16 / 9;

		@container style(--view: grid) {
			margin-bottom: 8px;
		}

		img.cover {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.title {
		overflow: hidden;
		font-weight: 500;
		white-space: nowrap;
		text-align: justify;
		text-overflow: ellipsis;
	}

	.info {
		display: flex;
		flex-direction: column;
		gap: 4px;
		justify-content: space-between;
		margin: 6px 0 0 -2px;
		color: c(icon-color);
		font-size: 12px;

		.line {
			display: flex;
			gap: 8px;
			justify-content: space-between;
		}

		.item {
			@include flex-center;
			flex-shrink: 0;
			gap: 2px;

			.icon {
				font-size: 16px;
			}
		}

		.uploader {
			justify-content: flex-start;
			color: inherit;
			text-decoration: none;

			> div {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}
</style>
