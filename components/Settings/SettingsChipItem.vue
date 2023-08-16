<script setup lang="ts">
	const props = defineProps<{
		/** 图片。 */
		image?: string;
		/** 图标。如果图片和图标同时指定，则图片会替换掉图标。 */
		icon?: string;
		/** 是否保持图标本身的颜色。 */
		filled?: boolean;
		/** 详细信息。 */
		details?: Readable;
		/** 尾随操作图标。 */
		trailingIcon?: string;
		/** 尾随操作图标单击事件。 */
		onTrailingIconClick?: () => void;
		/** 点击链接。在域名未完全确定前目前只能支持外链，如内链需要额外的自动检测。 */
		href?: string;
	}>();
</script>

<template>
	<Comp v-ripple role="listitem">
		<div :class="{ pictorial: image || icon }">
			<div v-if="image" class="image">
				<img :src="image" alt="image" draggable="false" />
			</div>
			<Icon v-else-if="icon" :name="icon" :filled="filled" class="item-icon" />
			<div class="text">
				<label class="title"><slot></slot></label>
				<label class="details"><slot name="details">{{ details }}</slot></label>
			</div>
			<template v-if="trailingIcon">
				<Icon v-if="!onTrailingIconClick" class="trailing-icon" :name="trailingIcon" />
				<SoftButton v-else :icon="trailingIcon" class="trailing-icon" @click.stop="onTrailingIconClick" />
			</template>
			<a v-if="href" draggable="false" :href="href" target="_blank" class="link lite"></a>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	@layer props {
		:comp {
			/// 指定组件的尺寸，可选的值为：large | small。
			--size: large;
		}
	}

	:comp:any-hover {
		background-color: c(hover-overlay);
	}

	:comp > div {
		display: flex;
		gap: 16px;
		align-items: center;
		cursor: pointer;

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

		.item-icon {
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
			}
		}

		.trailing-icon {
			color: c(icon-color);
			font-size: 24px;

			&.soft-button {
				margin-right: -8px;
			}
		}

		.link {
			@include square(100%);
			position: absolute;
			left: 0;
		}

		@container style(--size: large) {
			padding: 14px 16px;

			&.pictorial {
				padding: 14px 24px;
			}
		}

		@container style(--size: small) {
			gap: 8px;

			.icon {
				font-size: 20px !important;
			}

			.image {
				@include square(20px);
			}
		}
	}
</style>
