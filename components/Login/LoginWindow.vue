<script setup lang="ts">
	const props = defineProps<{
		/** 已打开，单向绑定使用。 */
		open?: boolean;
	}>();

	const model = defineModel<boolean>();
	const avatar = "/static/images/avatars/aira.webp";
	type PageType = "login" | "register" | "register2" | "forgot" | "reset";
	const currentPage = ref<PageType>("login");
	const isWelcome = computed(() => ["register", "register2"].includes(currentPage.value));
	const coverMoveLeft = computed(() => currentPage.value !== "login");
	const email = ref("");
	const password = ref("");
	const confirmPassword = ref("");
	const verificationCode = ref("");
	const passwordHint = ref("");
	const _isLogining = ref(false);
	const isLogining = computed({
		get: () => _isLogining.value,
		set: value => {
			_isLogining.value = value;
			if (value) closeLater();
		},
	});
	const isTryingLogin = ref(false);

	const open = computed({
		get: () => !!(model.value ?? props.open),
		set: value => {
			model.value = value;
			if (isLogining.value) useEvent("user:login", true);
			isLogining.value = false;
		},
	});
	const loginWindow = refComp();
	const isInvalidEmail = computed(() => !!email.value && !email.value.match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/));

	/**
	 * 登录账户。
	 */
	async function loginUser() {
		isTryingLogin.value = true;
		const oapiClient = useApi();
		try {
			await oapiClient.login(email.value, password.value);
		} catch (error) {
			useToast("登录失败", "error");
			console.error(error);
			return;
		} finally {
			isTryingLogin.value = false;
		}
		isLogining.value = true;
	}

	// DELETE: [Aira] Change passwords should be in settings, not login window.

	/**
	 * 注册账户。
	 */
	async function registerUser() {
		if (password.value === confirmPassword.value) {
			const oapiClient = useApi();
			await oapiClient.register("", password.value, email.value);
			isLogining.value = true;
			open.value = false;
		} else
			// TODO: localize
			useToast("Passwords don't match", "error");
	}

	/**
	 * 重置密码。
	 */
	async function resetPassword() {
		const oapiClient = useApi();
		const oldPassword = ""; // Should we get this?
		await oapiClient.resetPassword(oldPassword, password.value);
		open.value = false;
	}

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
					<!-- 登录 Login -->
					<div class="login">
						<HeadingGroup :name="t.login" englishName="Login" />
						<div class="form">
							<TextBox
								v-model="email"
								type="email"
								:placeholder="t.email_address"
								icon="email"
								:invalid="isInvalidEmail"
							/>
							<TextBox
								v-model="password"
								type="password"
								:placeholder="t.password"
								icon="lock"
							/>
							<div class="button login-button-placeholder">
								<Button class="button login-button button-block" :loading="isTryingLogin" :disabled="isTryingLogin" @click="loginUser">Link Start!</Button>
							</div>
						</div>
						<div class="action margin-left-inset margin-right-inset">
							<Button @click="currentPage = 'forgot'">{{ t.loginwindow.login_to_forgot }}</Button>
							<Button @click="currentPage = 'register'">{{ t.loginwindow.login_to_register }}</Button>
						</div>
					</div>
				</div>

				<div class="main right">
					<!-- 注册 其一 Register #1 -->
					<div class="register">
						<HeadingGroup :name="t.register" englishName="Register" class="collapse" />
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
								v-model="passwordHint"
								type="text"
								:placeholder="t.password.hint"
								icon="visibility"
							/>
						</div>
						<div class="action margin-left-inset">
							<Button @click="currentPage = 'login'">{{ t.loginwindow.register_to_login }}</Button>
							<Button icon="arrow_right" class="button icon-behind" @click="currentPage = 'register2'">{{ t.step.next }}</Button>
						</div>
					</div>

					<!-- 注册 其二 Register #2 -->
					<div class="register2">
						<HeadingGroup :name="t.register" englishName="Register" class="collapse" />
						<div class="form">
							<div><Preserves>{{ t.loginwindow.register_email_sent_info }}</Preserves></div>
							<TextBox
								v-model="verificationCode"
								type="text"
								:placeholder="t.verification_code"
								icon="verified"
							/>
							<!-- TODO: [Aira] There should be a resend button on the right of the verification code textbox -->
							<TextBox
								v-model="confirmPassword"
								type="password"
								:placeholder="t.password.retype"
								icon="lock"
							/>
						</div>
						<div class="action margin-left-inset">
							<Button icon="arrow_left" class="button" @click="currentPage = 'register'">{{ t.step.previous }}</Button>
							<Button icon="check" class="button" @click="registerUser">{{ t.step.ok }}</Button>
						</div>
					</div>

					<!-- 忘记密码 Forgot Password -->
					<div class="forgot">
						<HeadingGroup :name="t.forgot_password" englishName="forgot" />
						<div class="form">
							<div><Preserves>{{ t.loginwindow.forgot_info }}</Preserves></div>
							<TextBox
								v-model="email"
								type="email"
								:placeholder="t.email_address"
								icon="email"
							/>
							<Button icon="send" class="button button-block">{{ t.send }}</Button>
						</div>
						<div class="action margin-left-inset">
							<Button @click="currentPage = 'login'">{{ t.loginwindow.forgot_to_login }}</Button>
						</div>
					</div>

					<!-- 重设密码 Reset Password -->
					<div class="reset">
						<HeadingGroup :name="t.reset_password" englishName="Reset" />
						<div class="form">
							<div><Preserves>{{ t.loginwindow.reset_successful_info }}</Preserves></div>
							<TextBox
								v-model="password"
								type="password"
								:placeholder="t.password"
								icon="lock"
							/>
							<TextBox
								v-model="confirmPassword"
								type="password"
								:placeholder="t.password.retype"
								icon="lock"
							/>
						</div>
						<div class="action margin-left-inset">
							<div></div>
							<Button icon="check" class="button" @click="resetPassword">{{ t.step.ok }}</Button>
						</div>
					</div>

					<div class="register-title">
						<HeadingGroup :name="t.register" englishName="Register" />
					</div>
				</div>

				<div class="cover-wrapper">
					<LogoCover :welcome="isWelcome" />
				</div>

				<!-- 登录动画 Login Animation -->
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
					<div class="welcome">{{ t.loginwindow.login_welcome }}</div>
					<div class="name">艾了个拉</div> <!-- TODO: user name here -->
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
	$narrow-screen: "(width < #{$width})";
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
				@include page("!.register", ".register", right);
				@include page("!.register2", ".register2", right);
				@include page("!.forgot", ".forgot", right);
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

	header {
		--i: 3;
		display: flex;
		flex-direction: row;
		gap: 1rem;
		align-items: flex-end;

		:deep(.sub) {
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
			text-transform: uppercase;
		}

		.button.login-button-placeholder {
			position: relative;

			.login-button {
				@include square(100%);
				--i: 0;
				position: absolute;
				font-family: $english-logo-fonts;
				font-feature-settings: normal;
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

	.heading-group :deep(> *),
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

	.name {
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

		.name {
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
