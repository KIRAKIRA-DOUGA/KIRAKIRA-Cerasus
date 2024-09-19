<script setup lang="ts">
	const searchText = ref(""); // 用户输入的搜索字符
	const browsingHistory = ref<GetUserBrowsingHistoryWithFilterResponseDto["result"]>([]); // 获取到的浏览历史
	const browsingHistoryGroupedByDays = computed(() => { // 将浏览历史按当前语言所在时区的日期按天分组
		return browsingHistory.value?.reduce((acc, video) => {
			const date = formatLocalizationSemanticDateTime(video.lastUpdateDateTime, 2);
			if (!acc[date])
				acc[date] = [];
			acc[date].push(video);
			return acc;
		}, {} as { [key: string]: GetUserBrowsingHistoryWithFilterResponseDto["result"] });
	});

	/**
	 * 获取全部或过滤后的用户浏览历史
	 */
	async function getUserBrowsingHistory() {
		const getUserBrowsingHistoryWithFilterRequest: GetUserBrowsingHistoryWithFilterRequestDto = {
			videoTitle: searchText.value,
		};
		const headerCookie = useRequestHeaders(["cookie"]);
		const result = await api.browsingHistory.getUserBrowsingHistoryWithFilter(getUserBrowsingHistoryWithFilterRequest, headerCookie);
		browsingHistory.value = result.result;
	}

	useHead({ title: t.history });
	await getUserBrowsingHistory();
</script>

<template>
	<div class="container">
		<div class="card-container">
			<div class="center">
				<div class="line"></div>
				<section v-for="browsingHistory, dayString in browsingHistoryGroupedByDays" :key="dayString">
					<div class="sticky" :key="dayString">
						<div class="ball"></div>
						<span class="day-string">{{ dayString }}</span>
					</div>
					<ThumbGrid>
						<template v-for="browsingHistoryItem in browsingHistory" :key="browsingHistoryItem.id">
							<ThumbVideo
								v-if="browsingHistoryItem.category === 'video'"
								:videoId="parseInt(browsingHistoryItem.id, 10)"
								:uploader="browsingHistoryItem.uploader ?? ''"
								:uploaderId="browsingHistoryItem.uploaderId"
								:image="browsingHistoryItem.image"
								:date="new Date(browsingHistoryItem.uploadDate || 0)"
								:watchedCount="browsingHistoryItem.watchedCount"
								:duration="new Duration(0, browsingHistoryItem.duration ?? 0)"
							>{{ browsingHistoryItem.title }}</ThumbVideo>
							<!-- TODO: 现在只能显示视频，以后应该可以可以显示其他类型的历史记录 -->
						</template>
					</ThumbGrid>
				</section>
			</div>

			<div class="right">
				<div class="toolbox-card">
					<TextBox v-model="searchText" :placeholder="t.search" icon="search" @keydown.enter="getUserBrowsingHistory" @clear="getUserBrowsingHistory" />
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	$line-size: 6px;
	$ball-size: 24px;

	.container {
		position: relative;
	}

	.line {
		@include oval(top);
		position: absolute;
		top: 38px;
		bottom: 0;
		width: $line-size;
		background-color: c(accent);

		@include mobile {
			display: none;
		}
	}

	.card-container {
		display: flex;
		gap: 16px;

		@include tablet {
			flex-direction: column-reverse;
		}

		.center {
			width: 100%;
		}

		.right {
			display: flex;
			flex-direction: column;
			gap: 1rem;

			@include computer {
				$margin-top: 1rem;
				position: sticky;
				top: $margin-top;
				height: fit-content;
				max-height: calc(100dvh - 2 * $margin-top);
			}
		}
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
					content: "";
					display: block;
					background-color: c(accent);
					scale: 0.5;
				}
			}

			span {
				flex-shrink: 0;
				width: 80px;
				color: c(accent);
				font-weight: bold;
			}
		}

		.thumb-grid {
			width: 100%;
		}
	}
</style>
