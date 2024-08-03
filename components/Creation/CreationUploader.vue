<script setup lang="ts">
	const props = defineProps<{
		/** 头像网址。 */
		avatar?: string;
		/** 昵称。 */
		nickname: string;
		/** 用户名。 */
		username: string;
		/** 粉丝数。 */
		fans: number;
		/** 是否已关注？ */
		isFollowed?: boolean;
		/** 用户 UID。 */
		uid?: number;
	}>();
</script>

<template>
	<Comp>
		<UserAvatar :avatar :uid />
		<div class="text">
			<div class="name">
				<span class="nickname">{{ nickname }}</span>
				<!-- TODO: 显示管理组用户组图标。 -->
			</div>
			<div class="more">
				<span class="username">@{{ username }}</span>
				<span class="fans">{{ fans }} {{ t(fans).fans }}</span>
			</div>
		</div>
		<Button v-if="!isFollowed" icon="add">{{ t.follow_verb }}</Button>
		<Button v-else disabled icon="check">{{ t.following }}</Button>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		display: flex;
		gap: 12px;
		align-items: center;

		> :not(.text) {
			flex-shrink: 0;
		}

		.text {
			width: 100%;
			min-width: 0;

			.name {
				display: flex;
				gap: 4px;
				margin-bottom: 4px;
				font-size: 18px;
				user-select: text;

				.nickname {
					font-weight: bold;
				}
			}

			.more {
				display: flex;
				gap: 8px;
				align-items: center;
				color: c(icon-color);
				font-size: 12px;
			}

			span {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}
</style>
