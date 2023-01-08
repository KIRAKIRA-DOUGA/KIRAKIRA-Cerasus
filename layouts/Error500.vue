<script setup lang="ts">
	import { httpResponseStatusCodes } from "helpers/http-status";

	const props = defineProps<{
		statusCode: number | string;
		message: string;
		stack: string;
	}>();

	const title = computed(() => httpResponseStatusCodes[props.statusCode]);
</script>

<template>
	<div class="card">
		<div class="stack">
			<h2>{{ message }}</h2>
			<!-- eslint-disable-next-line vue/no-v-html -->
			<pre v-html="stack"></pre>
		</div>
		<div class="card-bottom">
			<LogoLuXun />
			<div class="title">
				<h1>{{ statusCode }}</h1>
				<p>{{ title }}</p>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.card {
		@include radius-large;
		@include card-shadow;
		$margin-y: 3.5rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: calc(100vh - 2 * $margin-y);
		margin: $margin-y 2.5rem 0;
		overflow: hidden;

		.card-bottom {
			@include radius-large;
			@include card-shadow;
			display: flex;
			gap: 35px;
			padding: 50px 60px;

			.title {
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;

				* {
					margin: 0;
					font-family: $english-logo-fonts;
				}

				h1 {
					font-size: 80px;
				}

				p {
					font-size: 20px;
				}
			}
		}

		.stack {
			display: flex;
			flex-direction: column;
			gap: 20px;
			padding: 40px 60px;
			overflow: auto;

			:deep(*) {
				margin: 0;
				font-family: $monospace-fonts !important;
			}

			pre {
				color: c(icon-color);
			}
		}
	}
</style>
