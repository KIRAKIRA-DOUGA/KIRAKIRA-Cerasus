<script setup lang="ts">
	const props = defineProps<{
		statusCode: number | string;
		message: string;
	}>();
</script>

<template>
	<main>
		<div class="mountains">
			<div v-for="i in 11" :key="i">
				<div></div>
			</div>
		</div>
		<div class="spotlight"></div>
		<div class="content">
			<h1>{{ statusCode }}</h1>
			<p>{{ message }}</p>
			<nuxt-link to="/" class="home-link">返回首页</nuxt-link>
		</div>
	</main>
</template>

<style scoped lang="scss">
	$title-animation-options: $ease-out-expo 600ms backwards calc(100ms * var(--i));
	$mountain-animation-options: $ease-out-expo 1500ms backwards;

	.spotlight {
		position: fixed;
		bottom: -30vh;
		left: 0;
		z-index: 10;
		width: 100%;
		height: 40vh;
		background: linear-gradient(45deg, #00dc82 0%, #36e4da 50%, #0047e1 100%);
		filter: blur(20vh);
		pointer-events: none;
	}

	.content {
		@include flex-center;
		@include square(100%);
		position: relative;
		z-index: 20;
		flex-direction: column;
		justify-content: flex-start;
		padding-top: 5rem;

		h1 {
			--i: 2;
			margin: 0;
			margin-bottom: 2rem;
			font-weight: bold;
			font-size: 6rem;
			font-family: $english-logo-fonts;
			line-height: 1;
			animation: move-down $title-animation-options;
		}

		p {
			--i: 1;
			margin: 0;
			margin-bottom: 4rem;
			font-weight: 300;
			font-size: 1.25rem;
			line-height: 1.25;
			animation: move-down $title-animation-options;
		}
	}

	.home-link {
		@include radius-large;
		--i: 0;
		position: relative;
		padding: 0.75rem 1.5rem;
		color: initial;
		text-decoration: none;
		background: none;
		background-color: #ffffff4d;
		backdrop-filter: blur(10px);
		animation: move-down $title-animation-options;

		:root.dark & {
			background-color: #1414144d;
		}

		&::before {
			@include radius-large;
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			width: 100%;
			padding: 2px;
			background: linear-gradient(90deg, #e2e2e2 0%, #e2e2e2 25%, #00dc82 50%, #36e4da 75%, #0047e1 100%);
			background-size: 400% auto !important;
			opacity: 0.5;
			transition: background-position 0.3s ease-in-out, opacity 0.2s ease-in-out;
			content: "";
			mask: linear-gradient(white 0 0) content-box, linear-gradient(white 0 0);
			// stylelint-disable-next-line property-no-vendor-prefix
			-webkit-mask-composite: xor;
			mask-composite: exclude;

			:root.dark & {
				background: linear-gradient(90deg, #303030 0%, #303030 25%, #00dc82 50%, #36e4da 75%, #0047e1 100%);
			}
		}

		&:hover::before {
			background-position: -50% 0 !important;
			opacity: 1;
		}
	}

	main {
		height: 100vh;
	}

	@media (min-width: 640px) {
		.content {
			h1 {
				font-size: 10rem;
				line-height: 1;
			}

			p {
				font-size: 2.25rem;
				line-height: 2.5rem;
			}
		}

		.home-link {
			font-size: 1.25rem;
			line-height: 1.75rem;
		}
	}

	.mountains {
		@include square(100%);
		$height: 80vh;
		$sqrt3: math.sqrt(3);
		position: fixed;
		left: calc((100vw / 11 - $height * 2 / $sqrt3) / 2);
		display: flex;

		> * {
			@include square(100%);

			> * {
				position: absolute;
				bottom: 0;
				width: 0;
				height: 0;
				border-color: transparent;
				border-style: solid;
				border-width: 0 calc($height / $sqrt3) $height;
				animation: move-up $mountain-animation-options;
			}

			@for $i from 1 through 11 {
				$colors: #f06e8e, #f1587e, #f58ca6, #ec7f9a, #dd91a3, #ecd2d8;

				&:nth-of-type(#{$i}) > * {
					$j: $i - 1;
					$layer: 5 - math.abs($j - 5);
					--from: calc(175px * (5 - #{$layer}) / 5 + 20px);
					bottom: calc(40% * $layer / -5);
					z-index: 6 - $layer;
					border-bottom-color: list.nth($colors, $layer + 1);
				}
			}
		}
	}

	@keyframes move-down {
		from {
			opacity: 0;
			translate: 0 -50px;
		}
	}

	@keyframes move-up {
		from {
			translate: 0 var(--from);
		}
	}
</style>
