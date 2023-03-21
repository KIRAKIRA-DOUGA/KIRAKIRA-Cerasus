<script setup lang="ts">
	import { httpResponseStatusCodes } from "helpers/http-status";
	const props = defineProps<{
		statusCode: number | string;
		message: string;
		stack: string;
	}>();

	const title = computed(() => httpResponseStatusCodes[props.statusCode]);
	const is500 = computed(() => +props.statusCode === 500);
</script>

<template>
	<div class="container">
		<div class="card">
			<div class="stack">
				<h2>{{ message }}</h2>
				<!-- eslint-disable-next-line vue/no-v-html -->
				<pre v-html="stack"></pre>
			</div>
			<div class="card-bottom">
				<div class="bottom-left">
					<LogoLuXun class="qrcode" />
					<div class="title">
						<h1>{{ statusCode }}</h1>
						<p>{{ title }}</p>
					</div>
				</div>
				<div class="bottom-right">
					<LogoText form="full" class="logo" />
					<div v-if="is500" class="fix-bug">又有bug了，快修哇！(っ °Д °;)っ</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.container {
		height: var(--inner-height);
		padding: 3.5rem 2.5rem;
		background-color: c(inset-bg);
	}

	.card {
		@include radius-large;
		@include card-shadow;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
		overflow: hidden;
		animation: intro 600ms $ease-out-smooth;

		> * {
			animation: float-up 500ms calc(var(--i) * 100ms) $ease-out-expo backwards;
		}

		.card-bottom {
			@include radius-large;
			@include card-shadow;
			--i: 2;
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
			padding: 50px 60px;
			background-color: c(main-bg, 50%);

			.bottom-left {
				display: flex;
				gap: 35px;
			}

			.bottom-right {
				@include flex-block;
				align-items: flex-end;
				justify-content: space-between;
				height: 100%;

				.fix-bug {
					flex-shrink: 100;
					margin-bottom: 6px;
					font-weight: 200;
					font-size: 32px;
				}

				.logo {
					margin-top: 8px;
				}
			}

			.title {
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;
				color: c(accent);

				* {
					margin: 0;
					font-family: $english-logo-fonts;
				}

				h1 {
					font-size: 112px;
					line-height: 1em;
				}

				p {
					font-weight: bold;
					font-size: 20px;
					line-height: 1.5em;
				}
			}

			.qrcode {
				@include square(156px);
			}
		}

		.stack {
			--i: 1;
			display: flex;
			flex-direction: column;
			gap: 20px;
			padding: 40px 60px;
			overflow: auto;

			:deep(*) {
				margin: 0;
				font-family: $monospace-fonts !important;
				user-select: text;
			}

			pre {
				color: c(icon-color);
			}
		}
	}

	@keyframes intro {
		from {
			scale: 1.1;
			opacity: 0;
		}
	}

	@keyframes float-up {
		from {
			opacity: 0;
			translate: 0 50px;
		}
	}
</style>
