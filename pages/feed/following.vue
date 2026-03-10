<docs>
	# 关注

	显示比如关注的用户发了新东西、关注的收藏夹有了更新等。
	当前只支持显示视频。

	TODO: 滚动加载更多，希望可以像Twitter一样尽可能无感（在还没到最底部的时候就开始往下加载）。
</docs>

<script setup lang="ts">
	const loadingMore = ref(false);
	const reachedEnd = ref(true);
	const refreshing = ref(false);
</script>

<template>
	<div class="container">
		<PullToRefresh v-model:refreshing="refreshing" />
		<!-- TODO: 切换视图 -->
		<div class="feed">
			<UserContent
				v-for="i in 10"
				:key="i"
				:uid="1"
				nickname="占位符"
				username="LoremIpsum0123"
				avatarInside
			>
				<template #description>
					<DateTime :dateTime="new Date()" showTime />
				</template>
				<ThumbGrid view="list">
					<ThumbVideo
						:videoId="1"
					>
						占位符
					</ThumbVideo>
				</ThumbGrid>
			</UserContent>
			<div v-if="loadingMore || reachedEnd" class="bottom">
				<ProgressRing v-if="loadingMore" />
				<p v-if="reachedEnd">¯\_(ツ)_/¯</p>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.conatiner {
		position: relative;
	}

	.feed {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.user-content {
		@include card-shadow;
		@include round-large;
		padding: 16px;
	}

	.thumb-grid {
		margin-bottom: -8px;
	}

	.bottom {
		@include flex-center;
		width: 100%;
		padding: 8px 0;
		color: c(icon-color, 50%);

		.progress-ring {
			--size: 30px;
			--thickness: 3px;
		}
	}
</style>
