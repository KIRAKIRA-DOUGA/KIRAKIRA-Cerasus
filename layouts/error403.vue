<script setup lang="ts">
	const props = defineProps<{
		statusCode: number | string;
		message: string;
	}>();

	const iconWrapper = ref<HTMLDivElement>();
	const resizeObserver = ref<ResizeObserver>(); // 改用纯 CSS 来实现可能会更好，但不知道怎样做。
	const narrow = ref(false);

	onMounted(() => {
		resizeObserver.value = new ResizeObserver(([e]) => {
			const wrapperWidth = e.contentRect.width;
			const iconWidth = e.target.firstElementChild?.clientWidth;
			if (iconWidth === undefined) return;
			narrow.value = wrapperWidth < iconWidth;
		});
		if (!iconWrapper.value) return;
		resizeObserver.value.observe(iconWrapper.value);
	});

	onUnmounted(() => {
		resizeObserver.value?.disconnect();
	});
</script>

<template>
	<div class="card">
		<div ref="iconWrapper" class="icon-wrapper" :class="{ narrow }">
			<div class="icon">☝️</div>
		</div>
		<div class="content">
			<h2>{{ message }}</h2>
			<h1>{{ statusCode }}</h1>
			<h3>{{ t.http_status_code.code_403 }}</h3>
			<Button href="/">{{ t.navigation.return_to_home }}</Button>
		</div>
	</div>
</template>

<style scoped lang="scss">
	$title-animation-options: $ease-out-expo 1s backwards calc(100ms * var(--i));

	.card {
		@include round-large;
		@include card-shadow;
		$margin-y: 3.5rem;
		container: card / size;
		position: relative;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		height: calc(100dvh - 2 * $margin-y);
		margin: $margin-y 2.5rem 0;
		overflow: clip;
		animation: intro 600ms $ease-out-smooth;

		.content {
			@include square(100%);
			position: relative;
			z-index: 20;
			display: flex;
			flex-direction: column;
			gap: 12px;
			justify-content: center;
			align-items: flex-start;
			min-width: 450px;
			color: c(accent);

			h1 {
				--i: 1;
				margin: 0;
				margin-top: -1.75rem;
				font-family: $english-logo-fonts;
				font-size: 112px;
				font-weight: bold;
				font-variant-numeric: oldstyle-nums;
				line-height: 1;
				animation: float-left $title-animation-options;
			}

			h2 {
				--i: 2;
				margin: 0.5rem;
				font-family: $english-logo-fonts;
				font-size: 30px;
				animation: float-left $title-animation-options;
			}

			h3 {
				--i: 3;
				margin: 0.5rem;
				margin-top: -0.1rem;
				font-family: $english-logo-fonts;
				font-size: 36px;
				animation: float-left $title-animation-options;
			}

			h1,
			h2,
			h3 {
				-webkit-text-stroke: c(main-bg) 1px;
			}

			button {
				--i: 4;
				margin-top: 6px;
				margin-left: calc(0.5rem + 3px);
				animation: float-left $title-animation-options;
			}
		}

		.icon-wrapper {
			@include grid-center;
			position: relative;
			animation: show-hand 1s;

			.icon {
				position: absolute;
				font-size: 50cqmin;
				transform-origin: bottom center;
				animation: hand-shake 500ms 250ms;
			}

			&.narrow .icon {
				left: 0;
			}
		}
	}

	@keyframes float-left {
		from {
			translate: 50px;
			opacity: 0;
		}
	}

	@keyframes show-hand {
		0% {
			scale: 0;
		}

		25%,
		75% {
			scale: 1.25;
		}

		100% {
			scale: 1;
		}
	}

	@keyframes hand-shake {
		0% { rotate: 0deg; }
		5% { rotate: -10deg; }
		20% { rotate: 8deg; }
		40% { rotate: -6deg; }
		60% { rotate: 4deg; }
		80% { rotate: -2deg; }
		100% { rotate: 0deg; }
	}
</style>
