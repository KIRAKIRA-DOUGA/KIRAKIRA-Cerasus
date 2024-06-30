<script setup lang="ts">
	const props = defineProps<{
		/** 指定主题。 */
		theme?: ThemeSetType;
	}>();

	const classes = computed(() =>
		props.theme === "system" ? ["dark", "light"] :
		!props.theme ? [undefined! as string] : [props.theme]);
</script>

<template>
	<!-- eslint-disable vue/max-attributes-per-line -->
	<div class="container">
		<div class="wrapper" v-for="(klass, index) in classes" :key="index">
			<svg :class="[klass]" width="208" height="117" viewBox="0 0 208 117" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g>
					<g class="sidebar-filter">
						<rect width="14" height="117" class="main-bg" />
					</g>
					<g clip-path="url(#sidebar-clip)">
						<circle cx="7.5" cy="7.5" r="2.5" class="icon-color" />
						<circle cx="7.5" cy="17.5" r="2.5" class="icon-color" />
						<circle cx="7.5" cy="99.5" r="2.5" class="icon-color" />
						<circle cx="7.5" cy="27.5" r="2.5" class="icon-color" />
						<circle cx="7.5" cy="109.5" r="2.5" class="icon-color" />
						<rect width="22.631" height="2.39989" transform="matrix(0.838672 -0.544636 0.544642 0.838669 -5 61.3262)" class="accent" />
						<rect width="22.631" height="2.39989" transform="matrix(0.838672 -0.544636 0.544642 0.838669 -1.73145 66.3579)" class="accent" />
					</g>
					<g class="toolbox-filter">
						<g clip-path="url(#toolbox-clip)">
							<rect x="140" y="5" width="63" height="55" rx="2" class="surface-color" shape-rendering="crispEdges" />
							<rect x="145" y="25" width="20" height="8" rx="4" class="accent" />
							<rect x="168" y="25" width="20" height="8" rx="4" class="accent" />
							<rect x="191" y="25" width="20" height="8" rx="4" class="accent" />
							<rect x="145" y="36" width="20" height="8" rx="4" class="accent" />
							<rect x="145" y="47" width="20" height="8" rx="4" class="accent" />
							<rect x="168" y="47" width="20" height="8" rx="4" class="text-color" fill-opacity="0.05" />
							<rect x="168" y="36" width="20" height="8" rx="4" class="accent" />
							<rect x="191" y="36" width="20" height="8" rx="4" class="text-color" fill-opacity="0.05" />
							<g filter="url(#textbox-filter)">
								<rect x="145" y="10" width="53" height="10" rx="2" class="inset-bg" />
							</g>
						</g>
					</g>
					<g class="player-filter">
						<g clip-path="url(#player-clip)">
							<rect x="22" y="5" width="114" height="55" class="surface-color" />
							<rect x="25" y="55" width="108" height="2" rx="1" class="gray-20" />
							<rect x="25" y="55" width="70" height="2" rx="1" class="accent-20" />
							<rect x="25" y="55" width="64" height="2" rx="1" class="accent" />
							<rect x="22" y="5" width="114" height="47" class="gray-30" />
						</g>
					</g>
					<rect x="22" y="77" width="36" height="21" rx="2" class="gray-40" />
					<rect x="22" y="101" width="36" height="21" rx="2" class="gray-40" />
					<rect x="61" y="77" width="36" height="21" rx="2" class="gray-40" />
					<rect x="61" y="101" width="36" height="21" rx="2" class="gray-40" />
					<rect x="100" y="77" width="36" height="21" rx="2" class="gray-40" />
					<rect x="143" y="87" width="31" height="18" rx="2" class="gray-40" />
					<rect x="100" y="101" width="36" height="21" rx="2" class="gray-40" />
					<rect x="22" y="66" width="30" height="5" rx="2.5" class="accent" />
					<rect x="159" y="68" width="22" height="5" rx="2.5" class="text-color" />
					<rect x="177" y="87" width="22" height="5" rx="2.5" class="text-color" />
					<rect x="159" y="76" width="42" height="3" rx="1.5" class="gray-30" />
					<rect x="177" y="95" width="28" height="3" rx="1.5" class="gray-30" />
					<rect x="177" y="101" width="28" height="3" rx="1.5" class="gray-30" />
					<circle cx="149.5" cy="73.5" r="6.5" class="gray-40" />
				</g>
				<defs>
					<filter id="textbox-filter" x="145" y="10" width="53" height="14" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
						<feFlood flood-opacity="0" result="BackgroundImageFix" />
						<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
						<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
						<feOffset dy="4" />
						<feGaussianBlur stdDeviation="2" />
						<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
						<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
						<feBlend mode="normal" in2="shape" result="effect1_innerShadow_3332_20877" />
					</filter>
					<clipPath id="sidebar-clip">
						<rect width="14" height="117" fill="white" />
					</clipPath>
					<clipPath id="toolbox-clip">
						<rect x="140" y="5" width="63" height="55" rx="2" fill="white" />
					</clipPath>
					<clipPath id="player-clip">
						<rect x="22" y="5" width="114" height="55" rx="2" fill="white" />
					</clipPath>
				</defs>
			</svg>
		</div>
	</div>
</template>

<style scoped lang="scss">
	$colors: icon-color, text-color, surface-color, main-bg, inset-bg, accent, accent-20, gray-20, gray-30, gray-40;

	.container {
		@include square(100%);
		position: relative;
	}

	.wrapper {
		@include square(100%);
		position: absolute;
		top: 0;
		left: 0;

		&:not(:first-child) {
			clip-path: polygon(0 0, 0 100%, 25% 100%, 75% 0);
		}
	}

	svg {
		@include square(100%);
		background-color: c(main-bg);
	}

	@each $color in $colors {
		.#{$color} {
			fill: c($color);
		}
	}

	.sidebar-filter {
		filter: drop-shadow(0 0 4px c(accent, 30%));
	}

	.toolbox-filter {
		filter: drop-shadow(0 1px 3px c(accent-shadow, 30%));
	}

	.player-filter {
		filter: drop-shadow(0 1px 2px c(accent-shadow, 20%));
	}
</style>
