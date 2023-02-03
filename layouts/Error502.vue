<script setup lang="ts">
	const props = defineProps<{
		statusCode: number | string;
		message: string;
	}>();
</script>

<template>
	<div class="card">
		<LogoElementPyro class="fire" />
		<div class="content">
			<h1>{{ statusCode }}</h1>
			<h2>{{ message }}</h2>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.card {
		@include radius-large;
		@include card-shadow;
		$margin-y: 3.5rem;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: calc(100vh - 2 * $margin-y);
		margin: $margin-y 2.5rem 0;
		overflow: hidden;

		.content {
			@include flex-center;
			@include square(100%);
			position: relative;
			z-index: 20;
			flex-direction: column;
			justify-content: flex-start;
			padding-top: 5rem;
			color: c(accent);

			h1 {
				--i: 2;
				margin: 0;
				font-weight: bold;
				font-size: 6rem;
				font-family: $english-logo-fonts;
				line-height: 1;
			}

			p {
				--i: 1;
				margin: 0;
				margin-bottom: 4rem;
				font-weight: 300;
				font-size: 1.25rem;
				line-height: 1.25;
			}
		}

		.fire {
			@include square(100%);
			position: absolute;
		}
	}
</style>
