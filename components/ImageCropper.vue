<script setup lang="ts">
	import { VueCropper } from "vue-cropper";
	import cropTestImage from "assets/images/av820864307.jpg";

	const vueCropperOption = reactive({
		img: cropTestImage,
		size: 1,
		full: false,
		outputType: "png",
		canMove: true,
		fixedBox: false,
		original: false,
		canMoveBox: true,
		autoCrop: true,
		// 只有自动截图开启 宽度高度才生效
		autoCropWidth: 750,
		autoCropHeight: 340,
		centerBox: true,
		high: true,
		max: 99999,
	});
</script>

<template>
	<ClientOnly>
		<VueCropper
			:img="vueCropperOption.img"
			:outputSize="vueCropperOption.size"
			:outputType="vueCropperOption.outputType"
			:info="true"
			:full="vueCropperOption.full"
			:fixed="false"
			:canMove="vueCropperOption.canMove"
			:canMoveBox="vueCropperOption.canMoveBox"
			:fixedBox="vueCropperOption.fixedBox"
			:original="vueCropperOption.original"
			:autoCrop="vueCropperOption.autoCrop"
			:autoCropWidth="vueCropperOption.autoCropWidth"
			:autoCropHeight="vueCropperOption.autoCropHeight"
			:centerBox="vueCropperOption.centerBox"
			:high="vueCropperOption.high"
			mode="contain"
			:maxImgSize="vueCropperOption.max"
		>
			<template #loading>
				<ProgressRing />
			</template>
		</VueCropper>
	</ClientOnly>
</template>

<style scoped lang="scss">
	.vue-cropper {
		&:deep(*) {
			// 防止拖动出现延迟
			transition: none;

			.cropper-view-box {
				outline-color: c(accent);

				// 网格线
				&::before,
				&::after {
					position: absolute;
					z-index: 1;
					content: "";
					pointer-events: none;
				}

				// 网格线 - 横向
				&::before {
					top: 50%;
					left: 0;
					width: 100%;
					height: 33%;
					border-top: 1px dashed c(accent);
					border-bottom: 1px dashed c(accent);
					transform: translateY(-50%);
				}

				// 网格线 - 纵向
				&::after {
					top: 0;
					left: 50%;
					width: 33%;
					height: 100%;
					border-right: 1px dashed c(accent);
					border-left: 1px dashed c(accent);
					transform: translateX(-50%);
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
					position: absolute;
					display: block;
					background-color: c(accent);
					content: "";
					pointer-events: none;
				}

				// 准星 - 横向
				&::before {
					width: 10px;
					height: 1px;
				}

				// 准星 - 纵向
				&::after {
					width: 1px;
					height: 10px;
				}
			}

			// 控制球
			.crop-point {
				@include circle;
				@include flex-center;
				@include control-ball-shadow;
				background-color: c(main-bg);
				opacity: 1;
				transition: $fallback-transitions;

				&::before {
					@include circle;
					display: block;
					width: 100%;
					height: 100%;
					background-color: c(accent);
					content: "";
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
			}

			// 分辨率信息
			.crop-info {
				@include round-small;
				@include dropdown-flyouts;
				top: unset !important;
				bottom: -8px;
				left: 50%;
				padding: 8px 10px;
				color: c(text);
				font-size: 14px;
				white-space: nowrap;
				background-color: c(acrylic-bg, 75%);
				transform: translateX(-50%);
				translate: 0 36px;
				font-variant-numeric: tabular-nums;
			}
		}
	}
</style>
