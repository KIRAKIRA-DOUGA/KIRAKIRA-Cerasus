<script setup lang="ts">
	const props = withDefaults(defineProps<{
		statusCode: number | string;
		message: string;
	}>(), {
		// TODO: 后续的视频删除原因可能需要在数据库进行记录（官方删除可能性？）
		message: "该视频被万恶的UP主给削除了",
	});
</script>

<template>
	<!-- TODO: Figma里面做的那个背景设计图我还没整 -->
	<div class="card">
		<div class="content">
			<h1>啊？不见了‽</h1>
			<h2>{{ message }}</h2>
			<Button href="/">{{ t.navigation.return_to_home }}</Button>
		</div>
	</div>
</template>

<style scoped lang="scss">
	// TODO: 文本尺寸及绝对定位需要可能根据设计稿进行调整。
	$title-animation-options: $ease-out-expo 600ms backwards calc(100ms * var(--i));

	.background {
		@include square(100%);
		position: absolute;
		animation: fade-in 1s $ease-out-sine;
	}

	.card {
		@include round-large;
		@include card-shadow;
		$margin-y: 3.5rem;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: calc(100dvh - 2 * $margin-y);
		margin: $margin-y 2.5rem 0;
		overflow: clip;
		animation: intro 600ms $ease-out-smooth;

		.content {
			@include flex-center;
			@include square(100%);
			position: relative;
			z-index: 20;
			flex-direction: column;
			justify-content: flex-start;
			align-items: flex-start;
			padding-left: 112px;

			h1 {
				--i: 1;
				margin: 0;
				padding-top: 65px;
				color: c(accent);
				font-size: 108px;
				font-weight: 400;
				line-height: 1;
				animation: float-down $title-animation-options;
			}

			h2 {
				--i: 0;
				margin: 0.5rem;
				padding-top: 40px;
				color: c(neutral-50);
				font-family: $simplified-chinese-fonts;
				font-size: 40px;
				font-weight: 400;
				animation: float-down $title-animation-options;
			}

			button {
				--i: 0;
				position: absolute;
				bottom: 80px;
				animation: float-down $title-animation-options;
			}
		}
	}

	@keyframes float-down {
		from {
			translate: 0 -50px;
			opacity: 0;
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}
</style>
