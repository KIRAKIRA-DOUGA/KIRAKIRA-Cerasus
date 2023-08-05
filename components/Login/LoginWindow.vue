<script setup lang="ts">
	const props = defineProps<{
		/** 已打开，单向绑定使用。 */
		open?: boolean;
	}>();

	const model = defineModel<boolean>();
	const avatar = "/static/images/avatars/aira.webp";
	type PageType = "login" | "forgot" | "forgot2" | "forgot3" | "register" | "register2";
	const currentPage = ref<PageType>("login");
	const isWelcome = computed(() => ["register", "register2"].includes(currentPage.value));
	const coverMoveLeft = computed(() => currentPage.value !== "login");
	const email = ref("");
	const password = ref("");
	const oldPassword = ref("");

	const username = ref("");

	const confirmPassword = ref("");
	const newPassword = ref("");
	const confirmNewPassword = ref("");

	const verificationCode = ref("");
	const _isLogining = ref(false);
	const isLogining = computed({
		get: () => _isLogining.value,
		set: value => {
			_isLogining.value = value;
			if (value) closeLater();
		},
	});

	/** logs the user in */
	async function loginUser() {
		const oapiClient = useApi();
		await oapiClient.login(email.value, password.value);
		isLogining.value = true;
	}

	// TODO: [Aira] Change passwords should be in settings, not login window.

	async function registerUser() {
		const oapiClient = useApi();
		await oapiClient.register(username.value, password.value, email.value);
		isLogining.value = true;
		open.value = false;
	}

	async function resetPassword() {
		const oapiClient = useApi();
		await oapiClient.resetPassword(oldPassword.value, newPassword.value);
		open.value = false;
	}

	const open = computed({
		get: () => !!(model.value ?? props.open),
		set: value => {
			model.value = value;
			if (isLogining.value) useEvent("user:login", true);
			isLogining.value = false;
		},
	});
	const loginWindow = refComp();
	// const isInvalidEmail = computed(() => !!email.value && !email.value.match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/));

	/**
	 * 稍后关闭。
	 */
	async function closeLater() {
		await nextTick();
		if (!loginWindow.value) return;
		const finishes = loginWindow.value.getAnimations().map(animation => animation.finished);
		try {
			await Promise.all(finishes);
		} catch { return; }
		open.value = false;
	}
</script>

<template>
	<Mask v-model="open" position="center" :zIndex="40">
		<Transition>
			<Comp
				v-if="open"
				ref="loginWindow"
				:class="[
					currentPage,
					{
						'move-left': coverMoveLeft,
						logining: isLogining,
					},
				]"
				role="dialog"
				aria-modal="true"
				:aria-label="currentPage"
			>

				<div class="main left">
					<!-- Login -->
					<div class="login">
						<div class="title">
							<Heading>登录</Heading>
							<Heading form="small">Login</Heading>
						</div>
						<div class="form">
							<TextBox
								v-model="email"
								type="email"
								:placeholder="t.email_address"
								icon="email"
							/>
							<TextBox
								v-model="password"
								type="password"
								:placeholder="t.password"
								icon="lock"
							/>
							<div class="button login-button-placeholder">
								<Button class="button login-button button-block" @click="loginUser()">Link Start!</Button>
							</div>
						</div>
						<div class="action margin-left-inset margin-right-inset">
							<Button @click="currentPage = 'forgot'">{{ t.password_forgot }}</Button>
							<Button @click="currentPage = 'register'">{{ t.register }}</Button>
						</div>
					</div>
				</div>

				<div class="main right">
					<!-- Register Page 1 -->
					<div class="register">
						<div class="title collapse">
							<Heading>注册</Heading>
							<Heading form="small">Register</Heading>
						</div>
						<div class="form">
							<TextBox
								v-model="email"
								type="text"
								:placeholder="t.email"
								icon="email"
							/>
							<TextBox
								v-model="password"
								type="password"
								:placeholder="t.password"
								icon="lock"
							/>
							<TextBox
								v-model="confirmPassword"
								type="password"
								:placeholder="t.password_retype"
								icon="lock"
							/>
						</div>
						<div class="action margin-left-inset">
							<Button @click="currentPage = 'login'">{{ t.loginwindow_register_back_to_login }}</Button>
							<Button icon="arrow_right" class="button icon-behind" @click="currentPage = 'register2'">{{ t.step_next }}</Button>
						</div>
					</div>

					<!-- Register Page 2 -->
					<div class="register2">
						<div class="title collapse">
							<Heading>注册</Heading>
							<Heading form="small">Register</Heading>
						</div>
						<div class="form">
							<div>{{ t.loginwindow_email_sent }}<br />{{ t.loginwindow_if_not_received }}</div>
							<TextBox
								v-model="verificationCode"
								type="text"
								:placeholder="t.verification_code"
								icon="verified"
							/>
							<!-- TODO: [Aira] There should be a resend button on the right of the verification code textbox -->
						</div>
						<div class="action margin-left-inset">
							<Button icon="arrow_left" class="button" @click="currentPage = 'register'">{{ t.step_previous }}</Button>
							<Button icon="check" class="button" @click="registerUser()">{{ t.step_ok }}</Button>
						</div>
					</div>

					<!-- Forgot Password -->
					<div class="forgot">
						<div class="title collapse">
							<Heading>重置密码</Heading>
							<Heading form="small">Reset</Heading>
						</div>
						<div class="form">
							<div>{{ t.loginwindow_forgot_email_enter_1 }}<br />{{ t.loginwindow_forgot_email_enter_2 }}</div>
							<TextBox
								v-model="email"
								type="email"
								:placeholder="t.email_address"
								icon="email"
							/>
							<Button icon="send" class="button button-block" @click="currentPage = 'forgot2'">{{ t.send }}</Button>
						</div>
						<div class="action margin-left-inset">
							<Button @click="currentPage = 'login'">{{ t.loginwindow_forgot_found_password }}</Button>
						</div>
					</div>

					<div class="forgot2">
						<div class="title collapse">
							<Heading>重置密码</Heading>
							<Heading form="small">Reset</Heading>
						</div>
						<div class="form">
							<div>{{ t.loginwindow_email_sent }}<br />{{ t.loginwindow_if_not_received }}</div>
							<TextBox
								v-model="verificationCode"
								type="text"
								:placeholder="t.verification_code"
								icon="verified"
							/>
							<!-- TODO: [Aira] There should be a resend button on the right of the verification code textbox -->
						</div>
						<div class="action margin-left-inset">
							<Button icon="arrow_left" class="button" @click="currentPage = 'forgot'">{{ t.step_previous }}</Button>
							<Button icon="arrow_right" class="button" @click="currentPage = 'forgot3'">{{ t.step_next }}</Button>
						</div>
					</div>

					<!-- Forgot Password - Reset Successful -->
					<div class="forgot3">
						<div class="title collapse">
							<Heading>重置密码</Heading>
							<Heading form="small">Reset</Heading>
						</div>
						<div class="form">
							<div>{{ t.verification_successful }} (/≧▽≦)/<br />{{ t.loginwindow_forgot_please_remember }}</div>
							<TextBox
								v-model="newPassword"
								type="password"
								:placeholder="t.password"
								icon="lock"
							/>
							<TextBox
								v-model="confirmNewPassword"
								type="password"
								:placeholder="t.password_retype"
								icon="lock"
							/>
						</div>
						<div class="action margin-left-inset">
							<Button icon="arrow_left" class="button" @click="currentPage = 'forgot2'">{{ t.step_previous }}</Button>
							<Button icon="check" class="button" @click="resetPassword()">{{ t.step_ok }}</Button>
						</div>
					</div>

					<div class="register-title">
						<div class="title">
							<Heading>注册</Heading>
							<Heading form="small">Register</Heading>
						</div>
					</div>

					<div class="forgot-title">
						<div class="title">
							<Heading>重置密码</Heading>
							<Heading form="small">Reset</Heading>
						</div>
					</div>

				</div>

				<div class="cover-wrapper">
					<LogoCover :welcome="isWelcome" />
				</div>

				<!-- Login Animation -->
				<div class="login-animation">
					<div class="add"></div>
					<div class="burst">
						<div v-for="i in 6" :key="i" v-i="i - 1" class="line"></div>
					</div>
					<div class="stripes">
						<div class="line"></div>
						<div class="line"></div>
					</div>
					<div class="avatar">
						<img :src="avatar" alt="avatar" />
					</div>
					<div class="welcome">欢迎回家</div>
					<div class="nickname">艾了个拉</div>
				</div>
			</Comp>
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
	$avatar-size: 128px;
	$avatar-movement: 110px;

	:comp {
		@include dropdown-flyouts;
		@include round-large;
		--avatar-center: #{calc($width / 2) - $avatar-movement} 50%;
		display: flex;
		justify-content: space-between;
		width: $width;
		max-width: 100dvw;
		height: $height;
		overflow: hidden;
		background-color: c(acrylic-bg, 75%);
		transition: all $transition-ease $enter-duration;
		clip-path: circle(100% at var(--avatar-center));

		* {
			transition: all $transition-ease $enter-duration;
		}

		&.v-leave-active {
			transition: all $ease-in-smooth $leave-duration !important;

			&,
			* {
				transition-duration: 250ms;
			}
		}

		&.v-enter-from,
		&.v-leave-to {
			opacity: 0;
			translate: 0 6rem;
		}

		@media #{$narrow-screen} {
			--avatar-center: #{calc($narrow-width / 2) - $avatar-movement} 50%;
			width: $narrow-width;
		}
	}

	@mixin page($current-page, $specified-page, $direction) {
		$is-not: string.slice($current-page, 1, 1) == "!";

		@if $is-not {
			$current-page: string.slice($current-page, 2);
		}

		$parent-selector: ":comp" + if($is-not, ":not(#{$current-page})", $current-page);

		#{$parent-selector} &#{$specified-page} {
			$move-distance: $width * 0.5;
			opacity: 0;
			transition: all $transition-ease $enter-duration;
			animation: none !important;
			pointer-events: none;
			translate: if($direction == left, -$move-distance, $move-distance);
		}
	}

	:comp:not(.move-left) .main > * {
		translate: 0 !important;
	}

	.text-box {
		--size: large;
	}

	.main {
		position: relative;
		height: 100%;
		overflow: hidden;

		.logining > & {
			overflow: visible;
		}

		> * {
			@include square(100%);
			position: absolute;
			top: 0;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: $width * 0.5;
			max-width: 100dvw;
			height: 100%;
			padding: 35px 45px;

			@if true { // HACK: 为了故意不应用排序规则而将下面这部分页面声明单独提炼在下方。
				// @include page("!.login", ".login", left);
				@include page("!.register", ".register", right);
				@include page("!.register2", ".register2", right);
				@include page("!.forgot", ".forgot", right);
				@include page("!.forgot2", ".forgot2", right);
				@include page("!.forgot3", ".forgot3", right);
				@include page(".register2", ".register", left);
				@include page(".forgot3", ".forgot2", left);
				@include page(".forgot2", ".forgot", left);
				@include page("!.register, .register2", ".register-title", right);
				@include page("!.forgot, .forgot2", ".forgot-title", right);
				// @include page("!.forgot2, .forgot3", ".forgot-title", right); // FIXME: [Aira] 页面数量大于2时出现了问题。There is a bug when the page amount is larger than 2.
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
		--i: 3;
		display: flex;
		flex-direction: row;
		gap: 1rem;
		align-items: flex-end;

		.sub {
			--i: 3.5;
		}
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 24px;

		@for $i from 1 through 3 {
			*:nth-child(#{$i}) {
				--i: #{1 + ($i - 1) * 0.5};
			}
		}

		.button {
			height: 44px;
			font-weight: 600;
			font-family: $english-logo-fonts;
			text-transform: uppercase;
		}

		.button.login-button-placeholder {
			position: relative;

			.login-button {
				@include square(100%);
				--i: 0;
				position: absolute;
			}
		}
	}

	.action {
		@include flex-center;
		$margin-inset: 16px;
		--i: 2.5;
		justify-content: space-between;

		&.margin-left-inset {
			margin-left: -$margin-inset;

			button:first-child {
				--appearance: secondary;
			}
		}

		&.margin-right-inset {
			margin-right: -$margin-inset;

			button:last-child {
				--appearance: secondary;
			}
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

		.v-enter-active & {
			transition: all $ease-out-max 700ms;
		}

		.v-leave-active & {
			transition: all $ease-in-smooth $leave-duration;
		}

		.v-enter-from &,
		.v-leave-to & {
			translate: 6rem 0;
		}
	}

	.collapse {
		visibility: collapse !important;
	}

	.register-title,
	.forgot-title {
		pointer-events: none;
	}

	.title > *,
	.form > *,
	.action {
		animation: float-left 500ms calc(var(--i) * 100ms) $ease-out-max backwards;
	}

	.button-block {
		width: 100%;
	}

	.login-animation {
		@include square(100%);
		position: absolute;
		z-index: 3;
		pointer-events: none;
	}

	.add {
		@include square(12px);
		@include absolute-center-sized;
		$thickness: 1px; // 加号符号粗细的一半。
		background-color: c(main-bg);
		clip-path:
			polygon(
				calc(50% - $thickness) 0,
				calc(50% - $thickness) calc(50% - $thickness),
				0 calc(50% - $thickness),
				0 calc(50% + $thickness),
				calc(50% - $thickness) calc(50% + $thickness),
				calc(50% - $thickness) 100%,
				calc(50% + $thickness) 100%,
				calc(50% + $thickness) calc(50% + $thickness),
				100% calc(50% + $thickness),
				100% calc(50% - $thickness),
				calc(50% + $thickness) calc(50% - $thickness),
				calc(50% + $thickness) 0
			);
		scale: 0;
	}

	.avatar {
		@include square($avatar-size);
		@include circle;
		@include absolute-center-sized;
		position: absolute;
		overflow: hidden;
		background-color: c(accent-20);
		scale: 0;

		> img {
			width: 100%;
			aspect-ratio: 1 / 1;
			object-fit: cover;
		}
	}

	.welcome {
		position: absolute;
		top: 40%;
		left: 48%;
		display: none;
		font-size: 24px;
	}

	.nickname {
		position: absolute;
		top: 50%;
		left: 48%;
		display: none;
		font-weight: bold;
		font-size: 38px;
	}

	.burst {
		@include square(300px);
		@include absolute-center-sized;

		.line {
			@include absolute-center;
			background-color: c(accent);
		}
	}

	.stripes {
		rotate: -33deg;
		translate: 0 180px;

		.line {
			@include oval;
			position: absolute;
			width: 872px;
			height: 40px;
			background-color: c(accent-20);
			opacity: 0;
			translate: 913px;

			&:nth-child(1) {
				margin-top: -110px;
				margin-left: -300px;
			}

			&:nth-child(2) {
				margin-top: 150px;
				margin-right: -300px;
			}
		}
	}

	.logining {
		$ease-login-button: cubic-bezier(0.4, 0, 0, 1);
		$ease-scaler-or-mover: cubic-bezier(0.3, 0, 0, 1);
		$ease-burst: cubic-bezier(0.1, 0, 0, 1);
		$ease-text-move: cubic-bezier(0.1, 0.5, 0, 1);

		.login-animation {
			pointer-events: auto;
		}

		.main.left,
		.login-button-placeholder {
			z-index: 2;
		}

		.login-button {
			animation: login-animation-button 600ms $ease-login-button forwards;
			pointer-events: none;

			@media #{$narrow-screen} {
				animation-name: login-animation-button-narrow;
			}

			:deep(.ripple-circle) {
				opacity: 0;
			}
		}

		.add {
			animation:
				login-animation-add 400ms 200ms $ease-burst forwards,
				login-animation-add-scale 900ms 500ms $ease-scaler-or-mover forwards;
		}

		.avatar {
			animation:
				login-animation-avator 600ms 540ms $ease-out-back forwards,
				login-animation-avator-mover 600ms 1s $ease-scaler-or-mover forwards;
		}

		.welcome {
			display: block;
			animation: name-move 700ms 1.05s $ease-text-move both;
		}

		.nickname {
			display: block;
			animation: name-move 700ms 1.1s $ease-text-move both;
		}

		.burst .line {
			animation: burst 800ms 580ms $ease-burst both;
		}

		.stripes .line {
			animation: stripes 400ms 980ms $ease-text-move;
		}

		&:comp {
			--corner-y: calc(50dvh - #{40px * 3 + 4px});

			animation:
				circle-mask-become-smaller 500ms 2s $ease-out-max forwards,
				move-avatar-to-corner 500ms 2.5s $ease-out-max forwards;

			@media (height <= 432px) {
				--corner-y: calc(50dvh - #{40px * 3 - 12px});
			}
		}
	}

	@keyframes login-animation-button {
		10% {
			color: transparent;
		}

		100% {
			@include square(800px);
			color: transparent;
			border-radius: 50%;
			translate: -40px -450px;
			scale: 1.15;
		}
	}

	@keyframes login-animation-button-narrow {
		10% {
			color: transparent;
		}

		100% {
			@include square(400px);
			color: transparent;
			border-radius: 50%;
			translate: -40px -260px;
			scale: 1.5;
		}
	}

	@keyframes login-animation-add {
		from {
			scale: 0;
			rotate: 0.5turn;
		}

		to {
			scale: 3;
			rotate: 0turn;
		}
	}

	@keyframes login-animation-add-scale {
		from {
			scale: 3;
		}

		to {
			scale: 210;
		}
	}

	@keyframes login-animation-avator {
		from {
			scale: 0;
		}

		to {
			scale: 1;
		}
	}

	@keyframes login-animation-avator-mover {
		from {
			translate: 0;
		}

		to {
			translate: -$avatar-movement;
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

	@keyframes burst {
		0% {
			transform: rotate(calc(var(--i) * 60deg)) translateY(0);
		}

		1% {
			width: 4px;
			height: 54px;
		}

		100% {
			width: 4px;
			height: 0;
			transform: rotate(calc(var(--i) * 60deg)) translateY(-180px);
		}
	}

	@keyframes stripes {
		from {
			opacity: 1;
			translate: 913px;
		}

		to {
			opacity: 1;
			translate: -670px;
		}
	}

	@keyframes float-left {
		from {
			translate: 3rem;
			opacity: 0;
		}
	}

	@keyframes circle-mask-become-smaller {
		to {
			clip-path: circle(calc($avatar-size / 2) at var(--avatar-center));
		}
	}

	@keyframes move-avatar-to-corner {
		to {
			scale: calc(40px / $avatar-size);
			translate: calc(59px - 50dvw) var(--corner-y);
		}
	}
</style>
