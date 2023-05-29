<script setup lang="ts">
	const props = defineProps<{
		/** 图片。 */
		image?: string;
		/** 图标。如果图片和图标同时指定，则图片会替换掉图标。 */
		icon?: string;
		/** 详细信息。 */
		details?: string;
		/** 之后的操作图标。 */
		afterIcon?: string;
	}>();
</script>

<template>
	<Comp v-ripple :class="{ pictorial: image || icon }">
		<div v-if="image" class="image">
			<img :src="image" alt="image" draggable="false" />
		</div>
		<Icon v-else-if="icon" :name="icon" />
		<div class="text">
			<div class="title">
				<slot></slot>
			</div>
			<div v-if="details" class="details">{{ details }}</div>
		</div>
		<Icon v-if="afterIcon" class="after-icon" :name="afterIcon" />
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		display: flex;
		gap: 16px;
		align-items: center;
		padding: 14px 16px;
		cursor: pointer;

		&:hover {
			background-color: c(hover-color);
		}

		&.pictorial {
			padding: 14px 24px;
		}

		> :not(.text) {
			flex-shrink: 0;
		}

		.image {
			@include square(42px);
			@include circle;
			overflow: hidden;

			> img {
				z-index: 1;
				width: 100%;
				object-fit: cover;
				aspect-ratio: 1 / 1;
			}
		}

		.icon {
			color: c(icon-color);
			font-size: 42px;
		}

		.text {
			width: 100%;

			.title {
				color: c(text-color);
			}

			.details {
				margin-top: 4px;
				color: c(icon-color);
				font-size: 12px;
			}
		}

		.after-icon {
			color: c(icon-color);
			font-size: 24px;
		}
	}
</style>
