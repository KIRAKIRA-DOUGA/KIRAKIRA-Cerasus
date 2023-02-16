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
			<kira-component v-if="open" class="login-window" :class="[currentPage]">
				<div class="main">
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
				<div class="main">
					<div class="register">
						<div class="title">
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
						<div class="title">
							<TitleMain>注册</TitleMain>
							<TitleSmall>Register</TitleSmall>
						</div>
						<div class="form">
							<div>我们已向您的邮箱中发送了验证码，请在此输入验证码。<br />如未收到，您可以重新发送。</div>
							<TextBox v-model="email" type="email" placeholder="邮箱" size="large" icon="email" />
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
							<TextBox v-model="verificationCode" type="text" placeholder="验证码" size="large" icon="verified" />
							<Button icon="send" class="button">发送</Button>
						</div>
						<div class="action margin-left-inset">
							<Button secondary @click="currentPage = 'login'">想起来密码了</Button>
						</div>
					</div>
				</div>
				<div class="cover-wrapper" :class="{ 'move-left': coverMoveLeft }">
					<LogoCover :welcome="isWelcome" />
				</div>
			</kira-component>
		</Transition>
	</Mask>
</template>

<style scoped lang="scss">
	$width: 800px;
	$height: 400px;

	.login-window {
		@include dropdown-flyouts;
		@include radius-large;
		display: flex;
		justify-content: space-between;
		width: $width;
		height: $height;
		overflow: hidden;
		background-color: c(inner-color-85, 75%);
		transition-duration: 500ms;

		&.dialog-leave-active {
			transition-duration: 250ms;
		}

		&.dialog-enter-from,
		&.dialog-leave-to {
			opacity: 0;
			translate: 0 2rem;
		}
	}

	@mixin page($current-page, $specified-page, $direction) {
		$is-not: string.slice($current-page, 1, 1) == "!";

		@if $is-not {
			$current-page: string.slice($current-page, 2);
		}

		$parent-selector: ".login-window" + if($is-not, ":not(#{$current-page})", $current-page);

		#{$parent-selector} &#{$specified-page} {
			$move-distance: 2rem;
			translate: if($direction == left, -$move-distance, $move-distance);
			opacity: 0;
			pointer-events: none;
		}
	}

	.main {
		position: relative;
		width: 50%;
		height: 100%;

		> * {
			@include flex-block;
			@include square(100%);
			position: absolute;
			top: 0;
			left: 0;
			justify-content: space-between;
			width: 100%;
			height: 100%;
			padding: 35px 45px;

			@if true {
				@include page("!.login", ".login", left);
				@include page("!.register", ".register", right);
				@include page("!.register2", ".register2", right);
				@include page("!.forget", ".forget", right);
				@include page(".register2", ".register", left);
			}
		}
	}

	.form {
		@include flex-block;
		gap: 24px;

		.button {
			height: 44px;
			font-weight: 600;
			font-family: $english-logo-fonts;
			text-transform: uppercase;
		}
	}

	.title {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		align-items: flex-end;
	}

	.cover-wrapper {
		@include card-in-card-shadow;
		position: absolute;
		left: calc($width / 2);
		background-color: c(main-bg);

		&.move-left {
			left: 0;
		}
	}

	.action {
		@include flex-center;
		$margin-inset: 16px;
		justify-content: space-between;

		&.margin-left-inset {
			margin-left: -$margin-inset;
		}

		&.margin-right-inset {
			margin-right: -$margin-inset;
		}
	}
</style>
