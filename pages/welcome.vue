<docs>
	首次登录且没有昵称时、或昵称违规后显示的页面。
</docs>

<script setup lang="ts">
	useHead({ title: "欢迎加入KIRAKIRA☆DOUGA大家庭" });
	const next = useRoute().query.next || "/";
	const container = ref<HTMLDivElement>();

	const profile = reactive({
		name: "",
		nameValid: false,
		bio: "",
		gender: "",
		birthday: new Date(),
		tags: [] as string[],
	});
	const isRead = ref(false);
	const validData = computed(() => isRead.value && profile.nameValid && profile.gender);
	const showWelcome = ref(false);
	const avatarBlob = ref<string>();
	const avatarInput = ref<HTMLInputElement>();

	/**
	 * 完成注册。
	 */
	async function finish() {
		const main = container.value?.parentElement;
		if (main) {
			main.scrollTo({ top: 0, left: 0, behavior: "smooth" });
			await main.animate([{}, { translate: "0 100%", opacity: 0 }], { duration: 600, easing: eases.easeInMax, fill: "forwards" }).finished;
			showWelcome.value = true;
			await delay(1200);
		}
		navigate(next);
	}

	/**
	 * 更换头像。
	 * @param e - 普通事件。
	 */
	function onChangeAvatar(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		avatarBlob.value = fileToBlob(file);
	}
</script>

<template>
	<div class="banner">
		<LogoCover noAnimation noTitle />
		<h1>欢迎加入<LogoText />大家庭</h1>
	</div>
	<div ref="container" class="container">
		<div class="card">
			<div class="card-rectangle"></div>
			<h2>完善个人信息</h2>
			<div class="items">
				<div class="avatar">
					<UserAvatar :avatar="avatarBlob" @click="avatarInput?.click()" />
					<span>上传头像</span>
					<input
						ref="avatarInput"
						hidden
						type="file"
						accept="image/*"
						@change="onChangeAvatar"
					/>
				</div>

				<SettingsUserProfile v-model="profile" />

				<Checkbox v-model:single="isRead">我已阅读并同意<a href="https://otomad.github.io/cssc/license.htm" target="_blank" @click.stop>《KIRAKIRA☆DOUGA用户协议》</a></Checkbox>

				<Button icon="check" :disabled="!validData" @click="finish">开始畅游KIRAKIRA☆DOUGA</Button>
			</div>
		</div>
	</div>
	<ClientOnlyTeleport to="body">
		<div v-if="showWelcome" class="welcome">
			<div class="avatar">
				<UserAvatar :avatar="avatarBlob" />
				<ProgressRing />
			</div>
			<div class="content-wrapper">
				<div v-for="i in 2" :key="i" class="content" :class="{ 'content-visible': i === 2 }">
					<p class="welcome-text">欢迎加入</p>
					<p class="name">{{ profile.name }}</p>
				</div>
			</div>
		</div>
	</ClientOnlyTeleport>
</template>

<style scoped lang="scss">
	.banner {
		--i: 0;
		position: relative;

		.logo-cover {
			--width: 100%;
			--height: 280px;
			--full-logo: true;
			position: absolute;
			top: 0;
			mask-image: linear-gradient(white, transparent);
			pointer-events: none;
		}

		h1 {
			@include flex-center;
			flex-wrap: wrap;
			gap: 16px;
			width: 100%;
			padding: 30px 0;
			font-size: 48px;

			@include tablet {
				zoom: 0.6;
			}

			@include mobile {
				zoom: 0.4;
			}
		}

		.logo-text {
			--form: full;
			zoom: 2.5;
		}
	}

	h1,
	h2 {
		color: c(accent);
	}

	.container {
		--i: 1;
		padding-top: 0;
		padding-bottom: 0;

		h2 {
			font-size: 24px;
		}

		.card {
			position: relative;
			padding: 24px 32px;

			.card-rectangle {
				@include round-large(top);
				@include card-shadow-with-blur;
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100lvh;
				background-color: c(main-bg, 80%);

				~ * {
					position: relative;
				}
			}

			.items {
				display: flex;
				flex-direction: column;
				gap: 20px;
				align-items: stretch;
				margin-top: 24px;

				.avatar {
					display: flex;
					gap: 16px;
					align-items: center;

					span {
						color: c(icon-color);
						font-size: 16px;
					}
				}

				button {
					margin-left: auto;
				}

				.checkbox:deep {
					padding: 0 14px;

					label {
						margin-left: 13px;
					}
				}
			}
		}
	}
	
	.banner,
	.container {
		animation: float-up 600ms calc(150ms * var(--i)) $ease-out-smooth backwards;
	}

	.welcome {
		@include flex-center;
		position: fixed;
		gap: 30px;
		inset: 0;
		cursor: progress;

		.avatar {
			position: relative;
			animation: scale-in 600ms $ease-out-back forwards;

			.user-avatar {
				@include square(128px);
				pointer-events: none;
			}

			.progress-ring {
				--size: 128px;
				--thickness: 5px;
				position: absolute;
				top: 0;
				z-index: 2;
				animation: fade-in 500ms 400ms $ease-out-sine backwards;
			}
		}

		.content-wrapper {
			$ease-scaler-or-mover: cubic-bezier(0.3, 0, 0, 1);
			position: relative;
			display: grid;
			grid-template-rows: 1fr;
			grid-template-columns: 0fr;
			animation: avatar-mover 600ms 400ms $ease-scaler-or-mover forwards;

			.content {
				$ease-text-move: cubic-bezier(0.1, 0.5, 0, 1);
				overflow: hidden;
				white-space: nowrap;

				&:not(.content-visible) {
					visibility: hidden;
				}

				&.content-visible {
					position: absolute;
					overflow: visible;
				}

				.welcome-text {
					margin-bottom: 10px;
					font-size: 24px;
					animation: name-move 700ms 450ms $ease-text-move both;
				}

				.name {
					font-weight: bold;
					font-size: 38px;
					animation: name-move 700ms 500ms $ease-text-move both;
				}
			}
		}
	}

	@keyframes avatar-mover {
		to {
			grid-template-columns: 1fr;
		}
	}

	@keyframes name-move {
		0% {
			opacity: 0;
			translate: 200px;
		}

		1% {
			opacity: 1;
			translate: 200px;
		}

		100% {
			opacity: 1;
			translate: 0;
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes float-up {
		from {
			opacity: 0;
			translate: 0 2rem;
		}
	}
</style>
