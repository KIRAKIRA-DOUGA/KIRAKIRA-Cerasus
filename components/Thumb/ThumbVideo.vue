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
	}>(), {
		image: testBackground,
		date: undefined,
		watchedCount: 0,
		duration: undefined,
	});

	const date = computed(() => props.date ?
		formatDate(props.date, "yyyy-MM-dd") :
		"----------");

	const watchedCount = computed(() => {
		let count = props.watchedCount | 0;
		let count_str = count + "";
		if ((count = count / 10000 | 0) !== 0)
			count_str = count + "万";
		if ((count = count / 10000 | 0) !== 0)
			count_str = count + "亿";
		return count_str;
	});

	const duration = computed(() => props.duration ?? "--:--");
</script>

<template>
	<LocaleLink class="thumb-video lite" :to="link">
		<div class="card">
			<div class="cover-wrapper">
				<img :src="image" alt="cover" class="cover" />
			</div>
			<div class="title"><slot>视频标题</slot></div>
			<div class="info">
				<div class="line">
					<div class="item">
						<NuxtIcon name="play" />
						<p>{{ watchedCount }}</p>
					</div>
					<div class="item">
						<NuxtIcon name="time" />
						<p>{{ duration }}</p>
					</div>
				</div>
				<div class="line">
					<object>
						<LocaleLink class="item uploader" to="components">
							<NuxtIcon name="person" />
							<div>{{ uploader }}</div>
						</LocaleLink>
					</object>
					<div class="item">
						<NuxtIcon name="calendar" />
						<div>{{ date }}</div>
					</div>
				</div>
			</div>
		</div>
	</LocaleLink>
</template>

<style scoped lang="scss">
	$width: 208px;
	$height: calc($width / 16 * 9);

	.thumb-video {
		@include radius-large;
		position: relative;
		display: inline-block;
		color: c(text-color);

		&:hover:not(:active) {
			z-index: 1;

			.card {
				@include system-card;
				translate: 0 -6px;
				background-color: c(main-bg, 90%);
				backdrop-filter: none !important; // BUG: [艾拉] Chromium 111 开始的 bug。https://bugs.chromium.org/p/chromium/issues/detail?id=1422867
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
		@include radius-large;
		padding: 8px 9px;
	}

	.cover-wrapper {
		@include radius-large;
		@include flex-center;
		width: 208px;
		height: $height;
		margin-bottom: 8px;
		overflow: hidden;

		img.cover {
			width: 100%;
		}
	}

	.title {
		font-weight: 500;
	}

	.info {
		@include flex-block;
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
			gap: 2px;

			.nuxt-icon {
				font-size: 16px;
			}
		}

		.uploader {
			color: inherit;
			text-decoration: none;
		}
	}
</style>
