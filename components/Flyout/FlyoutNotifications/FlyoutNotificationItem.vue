<docs>
	# 通知浮窗的每条通知内容
</docs>

<script setup lang="ts">
	const props = defineProps<{
		/** 发起对象的名字。 */
		name?: string;
		/** 用户名。 */
		username?: string;
		/** 用户 UID。 */
		uid?: number;
		/** 通知日期。 */
		date: Date;
		/** 引用内容。 */
		quote?: string;
		/** 评论唯一 ID。 */
		commentId?: string;
		/** 评论所在的视频的 ID。 */
		videoId?: number;
	}>();

	const menu = ref<FlyoutModel>();
</script>

<template>
	<Comp>
		<UserAvatar v-if="uid" :uid />
		<div class="texts">
			<LocaleLink v-if="name" :to="`/user/${uid ?? ''}`" blank class="lite">
				<p class="user">
					<span class="name">{{ name }}</span>
					<span class="id">@{{ username }}</span>
				</p>
			</LocaleLink>

			<!-- TODO: 点击内容跳转到对应视频中的评论。 -->
			<p class="content"><slot></slot></p>

			<div v-if="quote" class="quote">
				<Icon name="quote_start" />
				<p>{{ quote }}</p>
			</div>

			<div class="footer">
				<DateTime :dateTime="date" showTime />

				<!-- TODO: 实现对应操作。 -->
				<div class="buttons">
					<SoftButton v-tooltip:bottom="t.reply" icon="reply" />
					<SoftButton v-tooltip:bottom="t.more" icon="more_vert" @click="e => menu = [e, 'bottom']" />
					<!-- TODO: 制作富文本后展开需要**带格式**。 -->
					<SoftButton icon="chevron_down" />
					<Menu v-model="menu">
						<MenuItem icon="delete">{{ t.delete }}</MenuItem>
						<MenuItem icon="pin">{{ t.pin }}</MenuItem>
						<MenuItem icon="flag">{{ t.report }}</MenuItem>
					</Menu>
				</div>
			</div>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include round-small;
		@include chip-shadow;
		display: flex;
		gap: 16px;
		padding: 16px;
		background-color: c(surface-color, 75%);
	}

	.user-avatar {
		--size: 42px;
	}

	.texts {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		gap: 8px;
		min-width: 0;

		* {
			user-select: text;
		}

		.user {
			display: flex;
			gap: 4px;
			align-items: center;

			.name {
				color: c(text-color);
				font-size: 16px;
				font-weight: bold;
			}

			:not(.name) {
				color: c(icon-color);
			}

			&:hover {
				> * {
					color: c(accent);
				}
			}
		}

		.content {
			overflow: clip;
			white-space: nowrap;
			text-align: left;
			text-overflow: ellipsis;
			hyphens: auto;

			&:lang(zh, ja) {
				text-overflow: "⋯⋯";
			}

			@supports (display: -webkit-box) { // 只有 -webkit-box 才能支持多行省略号
				$title-line-height: 22px;
				// stylelint-disable-next-line value-no-vendor-prefix
				display: -webkit-box;
				max-height: $title-line-height * 2;
				line-height: $title-line-height;
				-webkit-line-clamp: 2;
				white-space: normal;
				-webkit-box-orient: vertical;
			}
		}
	}

	.quote {
		@include round-small;
		container: flyout-notification-item-quote / inline-size;
		display: flex;
		gap: 4px;
		align-items: center;
		padding: 4px;
		color: c(icon-color);
		font-size: 12px;
		background-color: c(gray-10);

		.icon {
			font-size: 16px;
		}

		> p {
			width: calc(100cqw - 16px - 4px);
			overflow: clip;
			white-space: nowrap;
			text-overflow: ellipsis;
			hyphens: auto;
		}
	}

	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: -8px 0;
		color: c(icon-color);
		font-size: 13px;
	}

	.buttons {
		display: flex;

		.soft-button {
			--wrapper-size: 36px;
			--ripple-size: var(--wrapper-size);
			--icon-size: 20px;
		}
	}
</style>
