<script setup lang="tsx">
	const counts = reactive({
		play: 100,
		rating: 5,
		star: 100,
		danmaku: 100,
		watching: 10,
	});

	/**
	 * 收藏视频。
	 */
	function favorite() {
		useEvent("app:requestLogin");
	}

	/**
	 * 分享视频。
	 */
	function share() {
		navigator.share({
			title: document.title,
			text: "绮良动画",
			url: location.href,
		});
	}

	const CountItem = (() => {
		interface Props {
			value: number | string;
			icon: string;
		}
		return ((props, { slots }) => (
			<div>
				<Icon name={props.icon} />
				<span>
					{slots.default()}
					<span class="value">{props.value}</span>
				</span>
			</div>
		)) as VueJsx<Props>;
	})();
</script>

<template>
	<Comp>
		<div class="top">
			<div class="info">
				<CountItem icon="play" :value="counts.play">播放</CountItem>
				<CountItem icon="thumb_up" :value="counts.rating" :class="{ dislike: counts.rating < 0 }">评分</CountItem>
				<CountItem icon="star" :value="counts.star">收藏</CountItem>
				<CountItem icon="play" :value="counts.danmaku">弹幕</CountItem>
				<div class="watching">
					<span class="watching-number">10</span>
					<span class="watching-description">人正在看</span>
				</div>
			</div>
			<div class="buttons">
				<LargeRippleButton icon="thumb_up" class="button-like" @click="counts.rating++" />
				<LargeRippleButton icon="thumb_down" class="button-dislike" @click="counts.rating--" />
				<LargeRippleButton icon="star" class="button-star" @click="favorite" />
				<LargeRippleButton icon="share" class="button-share" @click="share" />
				<LargeRippleButton icon="history" class="button-history" />
				<LargeRippleButton icon="settings" class="button-settings" />
			</div>
		</div>
		<PlayerVideoPanelDanmakuList />
		<PlayerVideoPanelDanmakuSend />
	</Comp>
</template>

<style scoped lang="scss">
	$panel-width: 350px;
	$info-height: 80px;
	$buttons-height: 48px;

	:comp {
		@include flex-block;
		flex-shrink: 0;
		width: $panel-width;
		height: inherit;
		overflow: hidden;

		@include tablet {
			display: none;
		}
	}

	.top {
		@include card-in-card-shadow;
	}

	.info {
		display: grid;
		grid-auto-flow: column;
		grid-template-rows: repeat(2, 1fr);
		width: 100%;
		height: $info-height;
		color: c(icon-color);

		> :deep(*) {
			@include flex-center;
			gap: 4px;

			.icon {
				font-size: 20px;
			}

			.value {
				display: inline-block;
				min-width: 3ch;
				margin-left: 0.2em;
				text-align: center;
			}

			&.dislike .icon {
				rotate: 0.5turn;
			}
		}

		> .watching {
			flex-direction: column;
			grid-row: 1 / -1;

			.watching-number {
				font-weight: 500;
				font-size: 24px;
			}
		}
	}

	.buttons {
		@include flex-center;
		justify-content: space-evenly;
		height: $buttons-height;
		overflow: hidden;
	}
</style>
