<docs>
	# 角落里的底纹图标
</docs>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 图标。 */
		icon: string;
		/** 是否使用大图标。 */
		large?: boolean;
		/** 位置。 */
		position?: "left top" | "left bottom" | "right top" | "right bottom";
		/** 是否让图标保持旋转。 */
		rotating?: boolean;
		/** 是否在旋转的情况下让图标保持弹性旋转。 */
		elastic?: boolean;
	}>(), {
		position: "right top",
	});
</script>

<template>
	<Comp :class="[position, { large }]">
		<Icon :name="icon" :class="{ rotating, elastic }" />
	</Comp>
</template>

<style scoped lang="scss">
	$size: 128px;
	$large-size: 256px;

	:comp {
		@include square($size);
		position: fixed;
		z-index: 10;
		color: c(accent, 15%);
		font-size: $size;
		pointer-events: none;

		&.large {
			@include square($large-size);
			font-size: $large-size;
		}

		@each $direction in top, right, bottom, left {
			&.#{$direction} {
				#{$direction}: 0;

				> .icon {
					#{$direction}: -25%;
				}
			}
		}
	}

	.icon {
		position: absolute;

		&.rotating {
			animation: rotating linear 30s infinite;

			&.elastic {
				animation: elastic-rotation $ease-out-expo 16s infinite;
			}
		}
	}

	@keyframes rotating {
		from {
			rotate: 0turn;
		}

		to {
			rotate: 1turn;
		}
	}

	@keyframes elastic-rotation {
		$length: 16;

		@for $i from 0 to $length {
			$progress: calc($i / $length);

			#{$progress * 100%} {
				rotate: $progress * 1turn;
			}
		}
	}
</style>
