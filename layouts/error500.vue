<script setup lang="ts">
	const qrcode = "/static/images/qrcodes/kirakira_cerasus_issues.png";
	import { httpResponseStatusCodes } from "helpers/http-status";
	const props = defineProps<{
		statusCode: number | string;
		message: string;
		stack: string;
	}>();

	const title = computed(() => httpResponseStatusCodes[props.statusCode]);
	const is500 = computed(() => +props.statusCode === 500);

	const selfUserInfoStore = useSelfUserInfoStore();
	const isAdmin = computed(() => selfUserInfoStore.role === "admin");
</script>

<template>
	<div class="container">
		<div class="card">
			<div class="stack">
				<h2>{{ message }}</h2>
				<!-- eslint-disable-next-line vue/no-v-html -->
				<div v-html="stack"></div>
			</div>
			<div class="card-bottom">
				<div class="bottom-left">
					<!-- <LogoLuXun class="qrcode" /> -->
					<NuxtImg :src="qrcode" class="qrcode" />
					<div class="title">
						<h1>{{ statusCode }}</h1>
						<p>{{ title }}</p>
					</div>
				</div>
				<div class="bottom-right">
					<LogoText />
					<div v-if="is500 && (environment.development || isAdmin)" class="fix-bug">又有bug了，快修哇！</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.container {
		height: 100dvh;
		padding: 3.5rem 2.5rem;
		background-color: c(inset-bg);
	}

	.card {
		@include round-large;
		@include card-shadow;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
		overflow: clip;
		animation: intro 600ms $ease-out-smooth;

		> * {
			animation: float-up 500ms calc(var(--i) * 100ms) $ease-out-expo backwards;
		}

		.card-bottom {
			@include round-large;
			@include card-shadow;
			--i: 2;
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			padding: 50px 60px;
			background-color: c(main-bg, 50%);

			.bottom-left {
				display: flex;
				gap: 35px;
			}

			.bottom-right {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: flex-end;
				height: 100%;

				.logo-text {
					--form: full;
					margin-top: 8px;
				}

				.fix-bug {
					flex-shrink: 100;
					margin-bottom: 6px;
					font-size: 32px;
					font-weight: 100;
				}
			}

			.title {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				color: c(accent);

				* {
					margin: 0;
					font-family: $english-logo-fonts;
				}

				h1 {
					font-size: 112px;
					font-variant-numeric: oldstyle-nums;
					line-height: 1em;
				}

				p {
					font-size: 26px;
					font-weight: bold;
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
			height: 100%;
			padding: 40px 60px;
			overflow: auto;

			:deep(*) {
				margin: 0;
				font-family: $monospace-fonts !important;
				user-select: text;
			}

			div:deep {
				color: c(icon-color);

				> pre > span.stack {
					display: block;
				}
			}
		}
	}

	@keyframes float-up {
		from {
			translate: 0 50px;
			opacity: 0;
		}
	}
</style>
