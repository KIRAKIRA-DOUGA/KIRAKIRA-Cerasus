<script setup lang="ts">
	const props = defineProps<{
		/** 头像。 */
		avatar: string;
		/** 用户名。 */
		username: string;
		/** 粉丝数。 */
		fans: number;
		/** 是否已关注？ */
		isFollowed?: boolean;
	}>();
</script>

<template>
	<Comp>
		<div v-ripple class="avatar">
			<img :src="avatar" alt="avatar" draggable="false" />
		</div>
		<div class="text">
			<div class="username">{{ username }}</div>
			<div class="fans">{{ fans }} 粉丝</div>
		</div>
		<Button v-if="!isFollowed">关注</Button>
		<Button v-else disabled>已关注</Button>
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

		.avatar {
			@include square(58px);
			@include circle;
			overflow: hidden;
			background-color: c(gray-20);

			> img {
				z-index: 1;
				width: 100%;
				object-fit: cover;
				aspect-ratio: 1 / 1;

				&:any-hover {
					scale: 125%;
				}

				&:not(:any-hover) {
					transition-duration: 1s;
				}
			}
		}

		.text {
			width: 100%;

			.username {
				margin-bottom: 4px;
				font-weight: bold;
				font-size: 18px;
			}
		}
	}
</style>
