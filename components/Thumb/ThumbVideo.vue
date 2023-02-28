<script setup lang="ts">
	import testBackground from "assets/images/test-background.png";

	const props = withDefaults(defineProps<{
		link: string;
		image?: string;
		date?: Date;
		watchedCount?: number;
	}>(), {
		image: testBackground,
		date: undefined,
		watchedCount: 0,
	});

	const date = computed(() => props.date ?
		formatDate(props.date, "yyyy/MM/dd") :
		"----/--/--"); // 我突然想到要是日期分隔符为横杠的话，那这个占位符就是一排横杠了。

	const watchedCount = computed(() => {
		let count = props.watchedCount | 0;
		let count_str = count + "";
		if ((count = count / 10000 | 0) !== 0)
			count_str = count + "万";
		if ((count = count / 10000 | 0) !== 0)
			count_str = count + "亿";
		return count_str;
	});
</script>

<template>
	<LocaleLink class="thumb-video lite" :to="link">
		<div class="cover-wrapper">
			<img :src="image" alt="cover" class="cover" />
		</div>
		<div><slot>视频标题</slot></div>
		<div class="bottom">
			<div>{{ date }}</div>
			<div class="item">
				<NuxtIcon name="play" />
				<p>{{ watchedCount }}</p>
			</div>
		</div>
	</LocaleLink>
</template>

<style scoped lang="scss">
	$width: 208px;
	$height: calc($width / 16 * 9);

	.thumb-video {
		@include radius-large;
		$padding: 8px 9px;
		position: relative;
		display: inline-block;
		// margin: list-negative($padding);
		padding: $padding;
		color: c(text-color);

		&:hover:not(:active) {
			@include system-card;
			z-index: 1;
			background-color: c(main-bg, 90%);
			translate: 0 -6px;
		}

		&:focus-visible {
			@include large-shadow-focus;
		}

		&:active {
			@include button-scale-pressed;
		}
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

	.bottom {
		@include flex-center;
		justify-content: space-between;
		margin-top: 3px;
		color: c(icon-color);

		.item {
			@include flex-center;
			gap: 2px;

			.nuxt-icon {
				font-size: 18px;
			}
		}
	}
</style>
