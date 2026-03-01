<docs>
	# 通知浮窗的每条通知内容
</docs>

<script setup lang="ts">
	const props = defineProps<{
		/** 发起对象的昵称。 */
		nickname?: string;
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
		<UserContent :nickname :username :uid :date>
			<div class="content">
				<slot></slot>
			</div>

			<template #quote v-if="quote">
				{{ quote }}
			</template>
			<template #footerRight>
				<SoftButton v-tooltip:bottom="$t('reply')" icon="reply" />
				<SoftButton v-tooltip:bottom="$t('more')" icon="more_vert" @click="e => menu = [e, 'bottom']" />
				<!-- TODO: 制作富文本后展开需要**带格式**。 -->
				<SoftButton icon="chevron_down" />
				<Menu v-model="menu">
					<MenuItem icon="delete">{{ $t("delete") }}</MenuItem>
					<MenuItem icon="pin">{{ $t("pin") }}</MenuItem>
					<MenuItem icon="flag">{{ $t("report") }}</MenuItem>
				</Menu>
			</template>
		</UserContent>
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

	.user-content {
		flex-grow: 1;

		&:deep(.user-avatar) {
			@include square(42px);
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
</style>
