<docs>
	# 边角底纹图标
</docs>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 图标。 */
		icon: DeclaredIcons;
		/** 图标尺寸。 */
		size?: "small" | "middle" | "large";
		/** 位置。 */
		position?: "left top" | "left bottom" | "right top" | "right bottom";
		/** 是否让图标保持旋转。 */
		rotating?: boolean;
		/** 是否在旋转的情况下让图标保持弹性旋转。 */
		elastic?: boolean;
		/** 是否淡入图标？ */
		fadeIn?: boolean;
	}>(), {
		position: "right top",
		size: "middle",
	});
</script>

<template>
	<Comp :class="[position, { large: size === 'large', small: size === 'small' }]" role="img">
		<Icon :name="icon" :class="{ rotating, elastic, 'fade-in': fadeIn }" />
	</Comp>
</template>

<style scoped lang="scss">
	$small-size: 72px;
	$middle-size: 128px;
	$large-size: 256px;

	:comp {
		@include square(1em);
		--icon-offset: -25%;
		position: fixed;
		z-index: $z-shading-icon;
		color: c(accent, 15%);
		font-size: $middle-size;
		pointer-events: none;

		&.large {
			font-size: $large-size;
		}

		&.small {
			--icon-offset: 0%;
			font-size: $small-size;
		}

		@each $direction in top, right, bottom, left {
			&.#{$direction} {
				#{$direction}: 0;

				> .icon {
					#{$direction}: var(--icon-offset);
				}
			}
		}
	}

	.icon {
		position: absolute;

		&.rotating {
			animation: rotation linear 30s infinite;

			&.elastic {
				animation: elastic-rotation $ease-out-expo 16s infinite;
			}
		}

		&.fade-in {
			animation: fade-in linear 2s;
		}
	}

	@keyframes elastic-rotation {
		$length: 16;

		@for $i from 0 through $length {
			$progress: calc($i / $length);

			#{$progress * 100%} {
				rotate: $progress * 1turn;
			}
		}
	}
</style>
