<script setup lang="ts">
	// 把该文件移动到根目录即可自定义错误（如 404）页面样式。

	interface ErrorInfo {
		message: string;
		stack: string;
		statusCode: string;
		statusMessage: string;
		url: string;
	}

	const props = defineProps<{
		error?: ErrorInfo; // BUG: TypeScript WCNM，你把多少人的生活，都 TM 给毁了。
	}>();
</script>

<template>
	<main>
		<div class="spotlight"></div>
		<div class="content">
			<template v-if="error">
				<h1>{{ error.statusCode }}</h1>
				<p>{{ error.message }}</p>
			</template>
			<template v-else>
				<h1>233</h1>
				<p>乐</p>
			</template>
			<nuxt-link to="/" class="home-link">返回首页</nuxt-link>
		</div>
	</main>
</template>

<style scoped lang="scss">
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
		flex-direction: column;
		width: 100%;
		height: 100%;

		h1 {
			margin: 0;
			margin-bottom: 2rem;
			font-weight: 500;
			font-size: 6rem;
			line-height: 1;
		}

		p {
			margin: 0;
			margin-bottom: 4rem;
			font-weight: 300;
			font-size: 1.25rem;
			line-height: 1.25;
		}
	}

	.home-link {
		position: relative;
		padding: 0.75rem 1.5rem;
		color: initial;
		text-decoration: none;
		background: none;
		background-color: #ffffff4d;
		border-radius: 0.5rem;
		backdrop-filter: blur(10px);

		:root.dark & {
			background-color: #1414144d;
		}

		&::before {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			width: 100%;
			padding: 2px;
			background: linear-gradient(90deg, #e2e2e2 0%, #e2e2e2 25%, #00dc82 50%, #36e4da 75%, #0047e1 100%);
			background-size: 400% auto !important;
			border-radius: 0.5rem;
			opacity: 0.5;
			transition: background-position 0.3s ease-in-out, opacity 0.2s ease-in-out;
			content: "";
			mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
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
</style>
