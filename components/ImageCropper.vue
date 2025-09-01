<!-- 基于 vue-cropper 的图片切割组件 -->
<script setup lang="ts">
	import cropTestImage from "assets/images/av820864307.jpg";
	import { VueCropper } from "vue-cropper";

	const props = withDefaults(defineProps<{
		/** 裁剪图片的地址 */
		image?: string;
		/** 裁剪生成图片的质量, 0.1 ~ 1 */
		outputSize?: number;
		/** 裁剪生成图片的格式 */
		outputType?: "jpeg" | "png" | "webp";
		/** 是否显示裁剪框的尺寸信息 */
		info?: boolean;
		/** 图片是否允许滚轮缩放 */
		canScale?: boolean;
		/** 是否默认生成截图框 */
		autoCrop?: boolean;
		/** 默认生成截图框宽度 */
		autoCropWidth?: number;
		/** 默认生成截图框高度 */
		autoCropHeight?: number;
		/** 是否开启截图框宽高固定比例 */
		fixed?: boolean;
		/** 截图框的宽高比例, 开启 fixed 才能生效 */
		fixedNumber?: [number, number];
		/** 是否输出原图比例的截图 */
		full?: boolean;
		/** 固定截图框大小，true 时截图框无法改变尺寸，false 时可以改变尺寸 */
		fixedBox?: boolean;
		/** 上传图片是否可以移动 */
		canMove?: boolean;
		/** 截图框能否拖动 */
		canMoveBox?: boolean;
		/** 上传图片按照原始比例渲染 */
		original?: boolean;
		/** 截图框是否被限制在图片里面 */
		centerBox?: boolean;
		/** 是否按照设备的 dpr 输出等比例图片 */
		high?: boolean;
		/** true 为展示真实输出图片宽高 false 展示看到的截图框宽高 */
		infoTrue?: boolean;
		/** 限制图片最大宽度和高度, 0 ~ max */
		maxImgSize?: number;
		/** 图片根据截图框输出比例倍数, 0 ~ max (建议不要太大不然会卡死的呢) */
		enlarge?: number;
		/** 图片默认渲染方式 */
		mode?: "contain" | "cover" | string;
		/** 裁剪框限制最小区域 */
		limitMinSize?: number | [] | string;
		/** 导出时背景颜色填充 */
		fillColor?: string | void;
	}>(), {
		image: cropTestImage,
		outputSize: 1,
		outputType: "png",
		info: true,
		canScale: true,
		autoCrop: true,
		autoCropWidth: Infinity,
		autoCropHeight: Infinity,
		fixed: false,
		fixedNumber: () => [1, 1],
		full: false,
		fixedBox: false,
		canMove: true,
		canMoveBox: true,
		original: false,
		centerBox: false,
		high: true,
		infoTrue: false,
		maxImgSize: 99999,
		enlarge: 1,
		mode: "contain",
		limitMinSize: 10,
		fillColor: undefined,
	});

	const cropper = ref();
	/**
	 * 获取被裁减的图片结果
	 * @returns Blob 格式存储的被裁剪后的图片
	 */
	const getCropBlobData = (): Promise<Blob> => {
		return new Promise((resolve, reject) => {
			if (!cropper.value) {
				reject(new Error("Cropper is not initialized"));
				return;
			}

			cropper.value.getCropBlob((data: unknown) => {
				const imageBlobData = data as Blob;
				if (imageBlobData)
					resolve(imageBlobData);
				else
					reject(new Error("No image data found"));
			});
		});
	};

	defineExpose({
		getCropBlobData,
	});
</script>

<template>
	<ClientOnly>
		<VueCropper
			ref="cropper"
			:img="image"
			:outputSize
			:outputType
			:info
			:canScale
			:autoCrop
			:autoCropWidth
			:autoCropHeight
			:fixed
			:fixedNumber
			:full
			:fixedBox
			:canMove
			:canMoveBox
			:original
			:centerBox
			:high
			:infoTrue
			:maxImgSize
			:enlarge
			:mode
			:limitMinSize
			:fillColor
		>
			<template #loading>
				<ProgressRing />
			</template>
		</VueCropper>
	</ClientOnly>
</template>

<style scoped lang="scss">
	.vue-cropper:deep(*) {
		// 防止拖动出现延迟
		transition: none;

		.cropper-view-box {
			outline-color: c(accent);

			// 网格线
			&::before,
			&::after {
				content: "";
				position: absolute;
				z-index: 1;
				border: dotted c(accent);
				pointer-events: none;
			}

			// 网格线 - 横向
			&::before {
				top: 50%;
				left: 0;
				width: 100%;
				height: calc(100% / 3);
				border-width: 1px 0;
				translate: 0 -50%;
			}

			// 网格线 - 纵向
			&::after {
				top: 0;
				left: 50%;
				width: calc(100% / 3);
				height: 100%;
				border-width: 0 1px;
				translate: -50%;
			}
		}

		.cropper-face {
			@include flex-center;
			background-color: transparent;
			opacity: 1;

			// 准星
			&::before,
			&::after {
				@include oval;
				content: "";
				position: absolute;
				display: block;
				background-color: c(accent);
				pointer-events: none;
			}

			// 准星 - 横向
			&::before {
				width: 12px;
				height: 1px;
			}

			// 准星 - 纵向
			&::after {
				width: 1px;
				height: 12px;
			}
		}

		// 控制球
		.crop-point {
			$size: 16px;
			// stylelint-disable-next-line order/order
			@include square($size);
			@include circle;
			@include flex-center;
			@include control-ball-shadow;
			background-color: c(main-bg);
			opacity: 1;
			transition: $fallback-transitions;

			&::before {
				@include circle;
				content: "";
				display: block;
				width: 100%;
				height: 100%;
				background-color: c(accent);
				scale: 0.5;
			}

			&:hover::before {
				scale: 0.7;
			}

			&:active::before {
				scale: 0.4;
			}

			&:focus,
			&:active {
				@include large-shadow-focus;
			}

			@for $i from 1 through 8 {
				$offset: calc($size / -2);
				$offset-center: calc(50% - $size / 4);

				&.point#{$i} {
					@if $i <= 3 {
						top: $offset;
					}

					@if $i >= 6 {
						bottom: $offset;
					}

					@if list.index(1 4 6, $i) {
						left: $offset;
					}

					@if list.index(3 5 8, $i) {
						right: $offset;
					}

					@if list.index(2 7, $i) {
						left: $offset-center;
					}

					@if list.index(4 5, $i) {
						top: $offset-center;
					}
				}
			}
		}

		// 分辨率信息
		.crop-info {
			@include round-small;
			@include dropdown-flyouts;
			@include acrylic-background;
			top: unset !important;
			bottom: 16px;
			left: 50%;
			padding: 8px 10px;
			color: c(text-color);
			font-size: 14px;
			font-variant-numeric: tabular-nums;
			white-space: nowrap;
			translate: -50% 0;
			opacity: 0;
			visibility: hidden;
			transition: $fallback-transitions;
		}

		&:has(.crop-point:active) .crop-info {
			opacity: 1;
			visibility: visible;
		}
	}
</style>
