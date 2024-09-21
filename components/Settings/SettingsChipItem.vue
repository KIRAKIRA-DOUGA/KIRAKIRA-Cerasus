<script setup lang="ts">
	const props = defineProps<{
		/** 图片。 */
		image?: string;
		/** 图标。如果图片和图标同时指定，则图片会替换掉图标。 */
		icon?: DeclaredIcons;
		/** 是否保持图标本身的颜色。 */
		filled?: boolean;
		/** 详细信息。 */
		details?: Readable;
		/** 尾随操作图标。 */
		trailingIcon?: DeclaredIcons;
		/** 尾随操作图标单击事件。 */
		onTrailingIconClick?: () => void;
		/** 点击链接。支持外链和内链。 */
		href?: string;
	}>();

	const isExtenalLink = computed(() => props.href?.includes(":/"));
</script>

<template>
	<Comp v-ripple role="listitem">
		<div :class="{ pictorial: image || icon }">
			<div v-if="image" class="image">
				<NuxtImg
					:src="image"
					provider="kirakira"
					alt="image"
					draggable="false"
					format="avif"
					width="64"
					height="64"
					placeholder
				/>
			</div>
			<Icon v-else-if="icon" :name="icon" :filled class="item-icon" />
			<div class="text">
				<label class="title"><slot></slot></label>
				<label class="details"><slot name="details">{{ details }}</slot></label>
			</div>
			<template v-if="trailingIcon">
				<Icon v-if="!onTrailingIconClick" class="trailing-icon" :name="trailingIcon" />
				<SoftButton v-else :icon="trailingIcon" class="trailing-icon" @click.stop="onTrailingIconClick" />
			</template>
			<template v-if="href">
				<a v-if="isExtenalLink" draggable="false" :href target="_blank" class="link lite"></a>
				<LocaleLink v-else draggable="false" :to="href" :blank="useAppSettingsStore().isOpenVideoInNewTab" class="link lite" />
			</template>
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

		> :not(.text) {
			flex-shrink: 0;
		}

		.image {
			@include square(42px);
			@include circle;
			overflow: clip;

			> img {
				@include square(100%);
				z-index: 1;
				object-fit: cover;
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
				--wrapper-size: 48px;
				--ripple-size: var(--wrapper-size);
				margin-right: -12px;
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
