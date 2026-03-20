<script setup lang="ts">
	const props = defineProps<{
		status: number | string;
		type?: undefined | "video" | "user";
	}>();

	const { t } = useI18n();

	const status = computed(() =>
		props.type === "user" ? t("error.not_found.user") :
		props.type === "video" ? t("error.not_found.video") :
		t("error.not_found.page"),
	);

	const icon = computed(() =>
		props.type === "user" ? "person" :
		props.type === "video" ? "movie" :
		"file",
	);

	useHead({
		title: status.value,
		titleTemplate: "%s - KIRAKIRA☆DOUGA",
	});

	const [DefinePluses, Pluses] = createReusableTemplate();
</script>

<template>
	<!-- TODO: 缺少入场动画。 -->
	<div class="container">
		<DefinePluses>
			<svg
				class="pluses"
				width="123"
				height="23"
				viewBox="0 0 123 23"
				stroke="currentColor"
				stroke-width="3"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M1.06055 1.06055L21.0605 21.0605M21.0605 1.06055L1.06055 21.0605" />
				<path d="M51.0605 1.06055L71.0605 21.0605M71.0605 1.06055L51.0605 21.0605" />
				<path d="M101.061 1.06055L121.061 21.0605M121.061 1.06055L101.061 21.0605" />
			</svg>
		</DefinePluses>
		<div class="card">
			<div class="decoration">
				<div>
					<div class="error">
						<Icon name="error" />
						<span>404 Not Found</span>
					</div>
					<Pluses />
				</div>
				<LogoText />
				<div class="shading-icon">
					<Icon :name="icon" class="main-icon" />
					<Icon name="question_mark" class="question-mark-icon" :class="type" />
				</div>
			</div>
			<div class="main-content">
				<div class="title">
					<p class="message-decoration">ERROR -</p>
					<p class="message-main">{{ status }}</p>
				</div>
				<Button href="/">{{ $t("navigation.back_to_home") }}</Button>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.container {
		height: 100dvh;

		@include computer {
			padding: 3.5rem 2.5rem;
			background-color: c(inset-bg);
		}
	}

	.card {
		position: relative;
		display: flex;
		align-items: center;
		height: 100%;
		overflow: clip;
		color: c(accent);
		animation: intro 600ms $ease-out-smooth backwards;

		@include computer {
			@include page-padding-x;
			@include round-large;
			@include card-shadow;
			background-color: c(main-bg, 50%);
		}

		@include tablet {
			padding: 32px;
		}
	}

	.decoration {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 32px;
		animation: intro 600ms $ease-out-smooth backwards;

		> div {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.pluses {
				@include mobile {
					display: none;
				}
			}
		}

		.logo-text {
			--form: full;
			font-size: 24px;
		}

		.shading-icon {
			display: contents;
			color: c(accent-20);

			.main-icon {
				position: absolute;
				right: -72px;
				bottom: -140px;
				font-size: 550px;
				rotate: -15deg;
				animation: main-icon 1s $ease-out-expo backwards;
			}

			.question-mark-icon {
				position: absolute;
				right: 32px;
				bottom: 300px;
				font-size: 128px;
				rotate: 15deg;
				transition: $fallback-transitions, rotate 5s $ease-out-spring;
				animation: question-mark 1s $ease-out-expo backwards;

				&:hover {
					rotate: calc(2.5turn + 15deg);
				}

				&.user {
					bottom: 255px;
				}

				&.video {
					bottom: 370px;
				}
			}
		}
	}

	.error {
		@include flex-center;
		gap: 4px;

		.icon {
			font-size: 32px;
		}

		span {
			font-family: $english-logo-fonts;
			font-size: 20px;
			font-weight: bold;
		}
	}

	.main-content {
		display: flex;
		flex-direction: column;
		gap: 32px;
		align-items: start;

		> *,
		> .title > * {
			animation: float-up 500ms calc(var(--i) * 100ms) $ease-out-expo backwards;
		}

		> button {
			--i: 2;
		}
	}

	.title {
		display: flex;
		flex-direction: column;

		.message-decoration {
			--i: 0;
			font-family: $english-logo-fonts;
			font-weight: 600;
		}

		.message-main {
			--i: 1;
			font-size: 64px;
			font-weight: bold;
			line-height: 1;

			@include mobile {
				font-size: 32px;
			}

			&:lang-latin {
				font-family: $english-logo-fonts;
			}
		}
	}

	@keyframes float-up {
		from {
			translate: 0 50px;
			opacity: 0;
		}
	}

	@keyframes main-icon {
		from {
			translate: 50px 100px;
			rotate: 5deg;
			opacity: 0;
		}
	}

	@keyframes question-mark {
		from {
			translate: -50px 100px;
			rotate: -20deg;
			opacity: 0;
		}
	}
</style>
