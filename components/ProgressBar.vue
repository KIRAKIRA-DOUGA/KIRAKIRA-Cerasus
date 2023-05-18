<docs>
	横向进度条
	目前只可用于不确定的进度 (indeterminate)
</docs>

<script setup lang="ts">

</script>

<template>
	<Comp>
		<div class="line-wrapper line-wrapper-1">
			<div class="line line-1"></div>
		</div>
		<div class="line-wrapper line-wrapper-2">
			<div class="line line-2"></div>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
:comp {
	@include oval;
	position: relative;
	width: 100%;
	height: 4px;
	overflow: hidden;
	// background: c(gray-30);
	transform: translateZ(0);
}

@keyframes indeterminate-move-1 {
	0% {
		transform: translateX(0);
	}

	20% {
		transform: translateX(0);
		animation-timing-function: cubic-bezier(0.5, 0, 0.7017, 0.4958);
	}

	59.15% {
		transform: translateX(83.6714%);
		animation-timing-function: cubic-bezier(0.3024, 0.3814, 0.55, 0.9563);
	}

	100% {
		transform: translateX(200.6111%);
	}
}

@keyframes indeterminate-move-2 {
	0% {
		transform: translateX(0);
		animation-timing-function: cubic-bezier(0.15, 0, 0.5151, 0.4097);
	}

	25% {
		transform: translateX(37.6519%);
		animation-timing-function: cubic-bezier(0.3103, 0.2841, 0.8, 0.7337);
	}

	48.35% {
		transform: translateX(84.3862%);
		animation-timing-function: cubic-bezier(0.4, 0.627, 0.6, 0.902);
	}

	100% {
		transform: translateX(160.2778%);
	}
}

@keyframes indeterminate-scale-1 {
	0% {
		transform: scaleX(0.08);
	}

	36.65% {
		transform: scaleX(0.08);
		animation-timing-function: cubic-bezier(0.3347, 0.1248, 0.7858, 1);
	}

	69.15% {
		transform: scaleX(0.6615);
		animation-timing-function: cubic-bezier(0.06, 0.11, 0.6, 1);
	}

	100% {
		transform: scaleX(0.08);
	}
}

@keyframes indeterminate-scale-2 {
	0% {
		transform: scaleX(0.08);
		animation-timing-function: cubic-bezier(0.205, 0.0571, 0.5766, 0.454);
	}

	19.15% {
		transform: scaleX(0.4571);
		animation-timing-function: cubic-bezier(0.1523, 0.1964, 0.6484, 1.0043);
	}

	44.15% {
		transform: scaleX(0.728);
		animation-timing-function: cubic-bezier(0.2578, -0.0032, 0.2118, 1.3818);
	}

	100% {
		transform: scaleX(0.08);
	}
}

.line-wrapper {
	position: absolute;
	width: 100%;
	height: 100%;
	transform-origin: top left;
}

.line-wrapper-1 {
	left: -145.1666%;
	animation: indeterminate-move-1 2s infinite linear;
}

.line-wrapper-2 {
	left: -54.8889%;
	animation: indeterminate-move-2 2s infinite linear;
}

.line {
	@include oval;
	position: absolute;
	display: inline-block;
	width: 100%;
	height: 100%;
	background-color: c(accent);
}

.line-1 {
	transform: scaleX(0);
	animation: indeterminate-scale-1 2s infinite linear;
}

.line-2 {
	animation: indeterminate-scale-2 2s infinite linear;
}
</style>
