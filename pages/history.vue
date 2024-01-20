<script setup lang="ts">
	useHead({ title: t.history });
</script>

<template>
	<div class="container">
		<ShadingIcon icon="history" position="right top" />
		<HeadingGroup :name="t.history" englishName="History" />

		<div class="wrapper">
			<div class="line"></div>
			<section>
				<div class="sticky">
					<div class="ball today"></div>
					<span>今天</span>
				</div>
				<ThumbGrid>
					<ThumbVideo
						v-for="i in 5"
						:key="i"
						link="video"
						uploader="艾了个拉"
					>{{ "测试视频".repeat(10) }}</ThumbVideo>
				</ThumbGrid>
			</section>
			<section>
				<div class="sticky">
					<div class="ball"></div>
					<span>昨天</span>
				</div>
				<ThumbGrid>
					<ThumbVideo
						v-for="i in 5"
						:key="i"
						link="video"
						uploader="艾了个拉"
						:date="new Date()"
						:watchedCount="233_0000"
						:duration="new Duration(2, 33)"
					>{{ "测试视频".repeat(10) }}</ThumbVideo>
				</ThumbGrid>
			</section>
		</div>
	</div>
</template>

<style scoped lang="scss">
	$line-size: 6px;
	$ball-size: 24px;

	header {
		margin-bottom: 1rem;
	}

	.container {
		position: relative;
	}

	.line {
		@include oval;
		position: absolute;
		top: 100px;
		bottom: -$line-size;
		width: $line-size;
		background-color: c(accent);

		@include mobile {
			display: none;
		}
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	section {
		$gap: 32px;
		$gap-mobile: 16px;

		display: flex;
		gap: $gap;
		align-items: flex-start;

		@include not-mobile {
			margin-left: -$ball-size * 0.5 + $line-size * 0.5;
		}

		@include mobile {
			flex-direction: column;
			gap: $gap-mobile * 0.5;
		}

		.sticky {
			@include flex-center;
			position: sticky;
			top: 16px;
			display: flex;
			flex-shrink: 0;
			gap: $gap;

			@include mobile {
				gap: $gap-mobile;
			}

			.ball {
				@include mobile {
					display: none;
				}

				@include square($ball-size);
				@include control-ball-shadow;
				@include circle;
				flex-shrink: 0;
				background-color: c(main-bg);

				&.today::after {
					@include square(100%);
					@include circle;
					display: block;
					background-color: c(accent);
					content: "";
					scale: 0.5;
				}
			}

			span {
				flex-shrink: 0;
				color: c(accent);
				font-weight: bold;
			}
		}

		.thumb-grid {
			flex-grow: 1;
		}
	}
</style>
