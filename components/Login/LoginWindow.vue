<script setup lang="ts">
	const props = defineProps<{
		modelValue?: boolean;
		open?: boolean;
	}>();

	const emits = defineEmits<{
		(event: "update:modelValue", open: boolean): void;
	}>();

	const open = computed({
		get: () => !!(props.modelValue ?? props.open),
		set: value => emits("update:modelValue", value),
	});

	type PageType = "login" | "forget" | "reset" | "register" | "register2";

	const currentPage = ref<PageType>("login");
	const isWelcome = computed(() => ["register", "register2"].includes(currentPage.value));
	const coverMoveLeft = computed(() => currentPage.value !== "login");
	const email = ref("");
	const password = ref("");
	const confirmPassword = ref("");
	const inviteCode = ref("");
	const verificationCode = ref("");
</script>

<template>
	<Mask v-model="open" position="center" :zIndex="40">
		<Transition name="dialog">
			<kira-component v-if="open" class="login-window" :class="[currentPage, { 'move-left': coverMoveLeft }]">
				<div class="main left">
					<div class="login">
						<div class="title">
							<TitleMain>登录</TitleMain>
							<TitleSmall>Login</TitleSmall>
						</div>
						<div class="form">
							<TextBox v-model="email" type="email" placeholder="邮箱" size="large" icon="email" />
							<TextBox v-model="password" type="password" placeholder="密码" size="large" icon="lock" />
							<Button class="button">Link Start!</Button>
						</div>
						<div class="action margin-left-inset margin-right-inset">
							<Button secondary @click="currentPage = 'forget'">忘记了密码</Button>
							<Button secondary @click="currentPage = 'register'">没有账号？注册</Button>
						</div>
					</div>
				</div>
				<div class="main right">
					<div class="register">
						<div class="title collapse">
							<TitleMain>注册</TitleMain>
							<TitleSmall>Register</TitleSmall>
						</div>
						<div class="form">
							<TextBox v-model="email" type="email" placeholder="邮箱" size="large" icon="email" />
							<TextBox v-model="password" type="password" placeholder="密码" size="large" icon="lock" />
							<TextBox v-model="inviteCode" type="text" placeholder="邀请码" size="large" icon="link" />
						</div>
						<div class="action margin-left-inset">
							<Button secondary @click="currentPage = 'login'">已有账号？登录</Button>
							<Button icon="arrow_right" iconBehind class="button" @click="currentPage = 'register2'">下一步</Button>
						</div>
					</div>
					<div class="register2">
						<div class="title collapse">
							<TitleMain>注册</TitleMain>
							<TitleSmall>Register</TitleSmall>
						</div>
						<div class="form">
							<div>我们已向您的邮箱中发送了验证码，请在此输入验证码。<br />如未收到，您可以重新发送。</div>
							<TextBox v-model="verificationCode" type="text" placeholder="验证码" size="large" icon="verified" />
							<TextBox v-model="confirmPassword" type="password" placeholder="确认密码" size="large" icon="lock" />
						</div>
						<div class="action">
							<Button icon="arrow_left" class="button" @click="currentPage = 'register'">上一步</Button>
							<Button icon="check" class="button" @click="open = false">完成</Button>
						</div>
					</div>
					<div class="forget">
						<div class="title">
							<TitleMain>忘记密码</TitleMain>
							<TitleSmall>Forget</TitleSmall>
						</div>
						<div class="form">
							<div>请在此输入您的邮箱。<br />我们将会给您的邮箱发送一封邮件，请点击邮件中的链接重置密码。</div>
							<TextBox v-model="email" type="email" placeholder="邮箱" size="large" icon="email" />
							<Button icon="send" class="button">发送</Button>
						</div>
						<div class="action margin-left-inset">
							<Button secondary @click="currentPage = 'login'">想起来密码了</Button>
						</div>
					</div>
					<div class="reset">
						<div class="title">
							<TitleMain>重置密码</TitleMain>
							<TitleSmall>Reset</TitleSmall>
						</div>
						<div class="form">
							<div>您已成功重置密码。(/≧▽≦)/<br />请务必牢记您的新密码。</div>
							<TextBox v-model="password" type="password" placeholder="新密码" size="large" icon="lock" />
							<TextBox v-model="confirmPassword" type="password" placeholder="确认新密码" size="large" icon="lock" />
						</div>
						<div class="action margin-left-inset">
							<div></div>
							<Button icon="check" class="button" @click="open = false">完成</Button>
						</div>
					</div>
					<div class="register-title">
						<div class="title">
							<TitleMain>注册</TitleMain>
							<TitleSmall>Register</TitleSmall>
						</div>
					</div>
				</div>
				<div class="cover-wrapper">
					<LogoCover :welcome="isWelcome" />
				</div>
			</kira-component>
		</Transition>
	</Mask>
</template>

<style scoped lang="scss">
	$width: 800px;
	$height: 400px;
	$narrow-width: calc($width / 2);
	$enter-duration: 700ms;
	$leave-duration: 150ms;
	$transition-ease: $ease-out-smooth;
	$narrow-screen: "(max-width: #{$width - 1})";

	.login-window {
		@include dropdown-flyouts;
		@include radius-large;
		display: flex;
		justify-content: space-between;
		width: $width;
		max-width: 100vw;
		height: $height;
		overflow: hidden;
		background-color: c(acrylic-bg, 75%);
		transition: all $transition-ease $enter-duration;

		* {
			transition: all $transition-ease $enter-duration;
		}

		&.dialog-leave-active {
			transition: all $ease-in-smooth $leave-duration !important;

			&,
			* {
				transition-duration: 250ms;
			}
		}

		&.dialog-enter-from,
		&.dialog-leave-to {
			opacity: 0;
			translate: 0 6rem;
		}

		@media #{$narrow-screen} {
			width: $narrow-width;
		}
	}

	@mixin page($current-page, $specified-page, $direction) {
		$is-not: string.slice($current-page, 1, 1) == "!";

		@if $is-not {
			$current-page: string.slice($current-page, 2);
		}

		$parent-selector: ".login-window" + if($is-not, ":not(#{$current-page})", $current-page);

		#{$parent-selector} &#{$specified-page} {
			$move-distance: $width * 0.5;
			opacity: 0;
			transition: all $transition-ease $enter-duration;
			animation: none !important;
			pointer-events: none;
			translate: if($direction == left, -$move-distance, $move-distance);
		}
	}

	.login-window:not(.move-left) .main > * {
		translate: 0 !important;
	}

	.main {
		position: relative;
		height: 100%;
		overflow: hidden;

		> * {
			@include flex-block;
			@include square(100%);
			position: absolute;
			top: 0;
			justify-content: space-between;
			width: $width * 0.5;
			max-width: 100vw;
			height: 100%;
			padding: 35px 45px;

			@if true {
				// @include page("!.login", ".login", left);
				@include page("!.register", ".register", right);
				@include page("!.register2", ".register2", right);
				@include page("!.forget", ".forget", right);
				@include page("!.reset", ".reset", right);
				@include page(".register2", ".register", left);
				@include page("!.register, .register2", ".register-title", right);
			}
		}

		&.left {
			width: 50%;

			@media #{$narrow-screen} {
				width: 100%;
			}

			.move-left & {
				width: 0;

				> * {
					left: 0;
					opacity: 0;
					pointer-events: none;
					translate: $width * -0.25 0;

					@media #{$narrow-screen} {
						translate: $width * -0.5 0;
					}
				}
			}
		}

		&.right {
			width: 0;

			> * {
				position: absolute;
				right: 0;
				transform: translateX($width * 0.25);

				@media #{$narrow-screen} {
					transform: translateX($width * 0.5);
				}
			}

			.move-left & {
				width: 50%;

				@media #{$narrow-screen} {
					width: 100%;
				}

				> * {
					transform: translateX(0);
				}
			}
		}
	}

	.title {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		align-items: flex-end;

		.big {
			--i: 2;
		}

		.sub {
			--i: 2.5;
		}
	}

	.form {
		@include flex-block;
		gap: 24px;

		@for $i from 1 through 3 {
			*:nth-child(#{$i}) {
				--i: #{1 + ($i - 1) * 0.25};
			}
		}

		.button {
			height: 44px;
			font-weight: 600;
			font-family: $english-logo-fonts;
			text-transform: uppercase;
		}
	}

	.action {
		@include flex-center;
		$margin-inset: 16px;
		--i: 1.75;
		justify-content: space-between;

		&.margin-left-inset {
			margin-left: -$margin-inset;
		}

		&.margin-right-inset {
			margin-right: -$margin-inset;
		}
	}

	.cover-wrapper {
		@include card-in-card-shadow;
		position: absolute;
		left: $narrow-width;
		width: 400px;
		overflow: hidden;

		@media #{$narrow-screen} {
			width: 0;
		}

		.move-left & {
			left: 0;
		}

		.dialog-enter-active & {
			transition: all $ease-out-max 700ms;
		}

		.dialog-leave-active & {
			transition: all $ease-in-smooth $leave-duration;
		}

		.dialog-enter-from &,
		.dialog-leave-to & {
			translate: 6rem 0;
		}
	}

	.collapse {
		visibility: collapse !important;
	}

	.register-title {
		pointer-events: none;
	}

	.title *,
	.form *,
	.action {
		animation: float-left 500ms calc(var(--i) * 100ms) $ease-out-max backwards;
	}

	@keyframes float-left {
		from {
			translate: 3rem;
			opacity: 0;
		}
	}
</style>
