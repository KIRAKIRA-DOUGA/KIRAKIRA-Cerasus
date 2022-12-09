<script setup lang="ts">
	const props = withDefaults(defineProps<{
		size?: number;
	}>(), {
		size: 28,
	});
</script>

<template>
	<div class="spinner">
		<div class="spinner-layer ">
			<div class="spinner-circle-clipper spinner-left">
				<div class="spinner-circle"></div>
			</div>
			<div class="spinner-gap-patch">
				<div class="spinner-circle"></div>
			</div>
			<div class="spinner-circle-clipper spinner-right">
				<div class="spinner-circle"></div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.spinner {
			position: relative;
			display: inline-block;
			width: 28px;
			height: 28px;
			-webkit-animation: spinner 1568ms linear infinite;
			animation: spinner 1568ms linear infinite;
		}

		@-webkit-keyframes spinner {
			to {
				-webkit-transform: rotate(360deg);
				transform: rotate(360deg);
			}
		}

		@keyframes spinner {
			to {
				-webkit-transform: rotate(360deg);
				transform: rotate(360deg);
			}
		}

		.spinner-layer {
			position: absolute;
			width: 100%;
			height: 100%;
			border-color: c(accent);
			opacity: 0;
			opacity: 1;
			-webkit-animation: spinner-layer-fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
			animation: spinner-layer-fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
		}

		@-webkit-keyframes spinner-layer-fill-unfill-rotate {
			12.5% {
				-webkit-transform: rotate(135deg);
				transform: rotate(135deg);
			}

			25% {
				-webkit-transform: rotate(270deg);
				transform: rotate(270deg);
			}

			37.5% {
				-webkit-transform: rotate(405deg);
				transform: rotate(405deg);
			}

			50% {
				-webkit-transform: rotate(540deg);
				transform: rotate(540deg);
			}

			62.5% {
				-webkit-transform: rotate(675deg);
				transform: rotate(675deg);
			}

			75% {
				-webkit-transform: rotate(810deg);
				transform: rotate(810deg);
			}

			87.5% {
				-webkit-transform: rotate(945deg);
				transform: rotate(945deg);
			}

			to {
				-webkit-transform: rotate(1080deg);
				transform: rotate(1080deg);
			}
		}

		@keyframes spinner-layer-fill-unfill-rotate {
			12.5% {
				-webkit-transform: rotate(135deg);
				transform: rotate(135deg);
			}

			25% {
				-webkit-transform: rotate(270deg);
				transform: rotate(270deg);
			}

			37.5% {
				-webkit-transform: rotate(405deg);
				transform: rotate(405deg);
			}

			50% {
				-webkit-transform: rotate(540deg);
				transform: rotate(540deg);
			}

			62.5% {
				-webkit-transform: rotate(675deg);
				transform: rotate(675deg);
			}

			75% {
				-webkit-transform: rotate(810deg);
				transform: rotate(810deg);
			}

			87.5% {
				-webkit-transform: rotate(945deg);
				transform: rotate(945deg);
			}

			to {
				-webkit-transform: rotate(1080deg);
				transform: rotate(1080deg);
			}
		}

		@-webkit-keyframes spinner-layer-1-fade-in-out {
			from {
				opacity: 1;
			}

			25% {
				opacity: 1;
			}

			26% {
				opacity: 0;
			}

			89% {
				opacity: 0;
			}

			90% {
				opacity: 1;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes spinner-layer-1-fade-in-out {
			from {
				opacity: 1;
			}

			25% {
				opacity: 1;
			}

			26% {
				opacity: 0;
			}

			89% {
				opacity: 0;
			}

			90% {
				opacity: 1;
			}

			100% {
				opacity: 1;
			}
		}

		@-webkit-keyframes spinner-layer-2-fade-in-out {
			from {
				opacity: 0;
			}

			15% {
				opacity: 0;
			}

			25% {
				opacity: 1;
			}

			50% {
				opacity: 1;
			}

			51% {
				opacity: 0;
			}
		}

		@keyframes spinner-layer-2-fade-in-out {
			from {
				opacity: 0;
			}

			15% {
				opacity: 0;
			}

			25% {
				opacity: 1;
			}

			50% {
				opacity: 1;
			}

			51% {
				opacity: 0;
			}
		}

		@-webkit-keyframes spinner-layer-3-fade-in-out {
			from {
				opacity: 0;
			}

			40% {
				opacity: 0;
			}

			50% {
				opacity: 1;
			}

			75% {
				opacity: 1;
			}

			76% {
				opacity: 0;
			}
		}

		@keyframes spinner-layer-3-fade-in-out {
			from {
				opacity: 0;
			}

			40% {
				opacity: 0;
			}

			50% {
				opacity: 1;
			}

			75% {
				opacity: 1;
			}

			76% {
				opacity: 0;
			}
		}

		@-webkit-keyframes spinner-layer-4-fade-in-out {
			from {
				opacity: 0;
			}

			65% {
				opacity: 0;
			}

			75% {
				opacity: 1;
			}

			90% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes spinner-layer-4-fade-in-out {
			from {
				opacity: 0;
			}

			65% {
				opacity: 0;
			}

			75% {
				opacity: 1;
			}

			90% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		.spinner-gap-patch {
			position: absolute;
			top: 0;
			left: 45%;
			width: 10%;
			height: 100%;
			overflow: hidden;
			border-color: inherit;
		}

		.spinner-gap-patch .spinner-circle {
			left: -450%;
			-webkit-box-sizing: border-box;
			box-sizing: border-box;
			width: 1000%;
		}

		.spinner-circle-clipper {
			position: relative;
			display: inline-block;
			width: 50%;
			height: 100%;
			overflow: hidden;
			border-color: inherit;
		}

		.spinner-circle-clipper .spinner-circle {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			-webkit-box-sizing: border-box;
			box-sizing: border-box;
			width: 200%;
			height: 100%;
			border-color: inherit;
			border-style: solid;
			border-width: 3px;
			border-bottom-color: transparent !important;
			border-radius: 50%;
			-webkit-animation: none;
			animation: none;
		}

		.spinner-circle-clipper.spinner-left {
			float: left;
		}

		.spinner-circle-clipper.spinner-left .spinner-circle {
			left: 0;
			border-right-color: transparent !important;
			-webkit-transform: rotate(129deg);
			transform: rotate(129deg);
			-webkit-animation: spinner-left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
			animation: spinner-left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
		}

		.spinner-circle-clipper.spinner-right {
			float: right;
		}

		.spinner-circle-clipper.spinner-right .spinner-circle {
			left: -100%;
			border-left-color: transparent !important;
			-webkit-transform: rotate(-129deg);
			transform: rotate(-129deg);
			-webkit-animation: spinner-right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
			animation: spinner-right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
		}

		@-webkit-keyframes spinner-left-spin {
			from {
				-webkit-transform: rotate(130deg);
				transform: rotate(130deg);
			}

			50% {
				-webkit-transform: rotate(-5deg);
				transform: rotate(-5deg);
			}

			to {
				-webkit-transform: rotate(130deg);
				transform: rotate(130deg);
			}
		}

		@keyframes spinner-left-spin {
			from {
				-webkit-transform: rotate(130deg);
				transform: rotate(130deg);
			}

			50% {
				-webkit-transform: rotate(-5deg);
				transform: rotate(-5deg);
			}

			to {
				-webkit-transform: rotate(130deg);
				transform: rotate(130deg);
			}
		}

		@-webkit-keyframes spinner-right-spin {
			from {
				-webkit-transform: rotate(-130deg);
				transform: rotate(-130deg);
			}

			50% {
				-webkit-transform: rotate(5deg);
				transform: rotate(5deg);
			}

			to {
				-webkit-transform: rotate(-130deg);
				transform: rotate(-130deg);
			}
		}

		@keyframes spinner-right-spin {
			from {
				-webkit-transform: rotate(-130deg);
				transform: rotate(-130deg);
			}

			50% {
				-webkit-transform: rotate(5deg);
				transform: rotate(5deg);
			}

			to {
				-webkit-transform: rotate(-130deg);
				transform: rotate(-130deg);
			}
		}
		.spinner-layer {
			border-color: c(accent);
		}
</style>
