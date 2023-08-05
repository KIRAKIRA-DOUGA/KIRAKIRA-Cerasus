<script setup lang="tsx">
	import { Icon } from "#components";

	const counts = reactive({
		play: 100,
		rating: 5,
		favorite: 100,
		danmaku: 10000,
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
			text: "KIRAKIRA☆DOUGA", // XXX: 这里得放页面的 title。
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
				<CountItem icon="play" :value="getWatchCount(counts.play)">{{ t.views_video }}</CountItem>
				<CountItem icon="thumb_up" :value="getWatchCount(counts.rating)" :class="{ dislike: counts.rating < 0 }">{{ t.rating }}</CountItem>
				<CountItem icon="star" :value="getWatchCount(counts.favorite)">{{ t.favorites }}</CountItem>
				<CountItem icon="danmaku" :value="getWatchCount(counts.danmaku)">{{ t.danmaku }}</CountItem>
				<div class="watching">
					<span class="watching-number">10</span>
					<span class="watching-description">Viewers</span>
				</div>
			</div>
			<div class="buttons">
				<SoftButton v-tooltip:bottom="t.bonus_point" icon="thumb_up" class="button-like" @click="counts.rating++" />
				<SoftButton v-tooltip:bottom="t.minus_point" icon="thumb_down" class="button-dislike" @click="counts.rating--" />
				<SoftButton v-tooltip:bottom="t.favorite_verb" icon="star" class="button-favorite" @click="favorite" />
				<SoftButton v-tooltip:bottom="t.share" icon="share" class="button-share" @click="share" />
				<SoftButton v-tooltip:bottom="t.danmaku_history" icon="history" class="button-history" />
				<SoftButton v-tooltip:bottom="t.settings" icon="settings" class="button-settings" />
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
		display: flex;
		flex-direction: column;
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
