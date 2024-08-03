<script setup lang="ts">
	import makeUsername from "pomsky/username.pom";
	const props = defineProps<{
		/** 已打开，单向绑定使用。 */
		open?: boolean;
	}>();

	const { avatarSize, avatarGap, avatarMinLeft } = useScssVariables().numbers;
	const selfUserInfoStore = useSelfUserInfoStore();
	const model = defineModel<boolean>();
	type PageType = "login" | "register1" | "register2" | "register3" | "forgot" | "reset";
	const currentPage = ref<PageType>("login");
	const isWelcome = computed(() => ["register1", "register2", "register3"].includes(currentPage.value));
	const coverMoveLeft = computed(() => currentPage.value !== "login");
	const email = ref("");
	const password = ref("");
	const confirmPassword = ref("");
	const verificationCode = ref("");
	const passwordHint = ref("");
	const loginAnimationText = ref<HTMLDivElement>();
	const avatarMovement = ref(0);
	const textPaddingLeft = ref(0);
	const _isLogining = ref(false);
	const isLogining = computed({
		get: () => _isLogining.value,
		set: async value => {
			if (value) updateAvatarMovement();
			await nextTick();
			_isLogining.value = value;
			if (value) closeLater();
		},
	});
	const isTryingLogin = ref(false);
	const isTryingRegistration = ref(false);
	const isCheckingEmail = ref(false);
	const invitationCode = ref("");
	const invitationCodeInvalidText = computed(() => {
		const invitationCodeRegex = /^KIRA-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
		if (invitationCode.value && !invitationCodeRegex.test(invitationCode.value))
			return t.invitation_code.invalid;
		else
			return false;
	});
	const open = computed({
		get: () => !!(model.value ?? props.open),
		set: value => {
			model.value = value;
			avatarMovement.value = 0;
			textPaddingLeft.value = 0;
			if (isLogining.value) useEvent("user:login", true);
			if (isLogining.value) selfUserInfoStore.isLogined = true;
			if (!value) selfUserInfoStore.tempHideAvatarFromSidebar = false;
			isLogining.value = false;
		},
	});
	const loginWindow = refComp();
	const isInvalidEmail = computed(() => !!email.value && !email.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]{2,}$/));

	const isCheckingUsername = ref(false);
	const validChar = makeUsername();
	const username = ref("");
	const nickname = ref("");

	/**
	 * 更新登录动画中头像向左滑动的距离。
	 */
	function updateAvatarMovement() {
		const windowWidth = loginWindow.value!.offsetWidth;
		const texts = loginAnimationText.value!;
		texts.classList.add("rendered");
		const textWidth = texts.offsetWidth;
		texts.classList.remove("rendered");
		const left = Math.max(avatarMinLeft, (windowWidth - textWidth - avatarGap - avatarSize) / 2);
		avatarMovement.value = windowWidth / 2 - left - avatarSize / 2;
		textPaddingLeft.value = left + avatarSize + avatarGap;
	}

	/**
	 * 登录账户。
	 */
	async function loginUser() {
		if (password.value && email.value) {
			const passwordHash = await generateHash(password.value);
			const userLoginRequest: UserLoginRequestDto = { email: email.value, passwordHash };
			try {
				isTryingLogin.value = true;
				const loginResponse = await api.user.login(userLoginRequest);
				isTryingLogin.value = false;

				if (loginResponse.success && loginResponse.uid && loginResponse.token) {
					selfUserInfoStore.tempHideAvatarFromSidebar = true;
					selfUserInfoStore.isLogined = true;

					// 登录后，将用户设置存储到 cookie，然后调用 cookieBinding 从 cookie 中获取样式设置并追加到 dom 根节点
					const userSettings = await api.user.getUserSettings();
					saveUserSetting2BrowserCookieStore(userSettings);
					cookieBinding();

					// NOTE: 触发用户登录事件，应当放在最后，等待上方的一系列业务逻辑执行完成之后在发送事件
					useEvent("user:login", true);
					isLogining.value = true;
				} else {
					useToast(t.toast.login_failed, "error", 5000);
					if (loginResponse.passwordHint) useToast(`${t.password.hint}: ${loginResponse.passwordHint}`, "info", 10000);
				}
			} catch (error) {
				useToast(t.toast.login_failed, "error");
			}
		} else
			useToast("用户名和密码不能为空", "error"); // TODO: 使用多语言
		isTryingLogin.value = false;
	}

	/**
	 * 用户注册，其一。
	 */
	const checkUsernameAndJumpNextPage = async () => {
		if (!username.value && username.value.length <= 0) {
			useToast("用户名不能为空！", "error"); // TODO: 使用多语言
			return;
		}

		if (username.value.length > 200) {
			useToast("用户名过长！", "error"); // TODO: 使用多语言
			return;
		}

		if (nickname.value?.length > 200) {
			useToast("用户昵称过长！", "error"); // TODO: 使用多语言
			return;
		}
		isCheckingUsername.value = true;
		const checkUsernameRequest: CheckUsernameRequestDto = {
			username: username.value,
		};
		const checkUsernameResult = await api.user.checkUsername(checkUsernameRequest);
		if (checkUsernameResult.success && checkUsernameResult.isAvailableUsername)
			currentPage.value = "register2";
		else
			useToast("用户名无效，请更换一个", "warning", 5000); // TODO: 使用多语言
		isCheckingUsername.value = false;
	};

	const PASSWORD_HINT_DO_NOT_ALLOW_INCLUDES_PASSWORD = "密码提示中不允许包含密码本身"; // TODO: 使用多语言
	const INVITATION_CODE_INVALID_TEXT = "邀请码不能为空或格式有误。"; // TODO: 使用多语言
	/**
	 * 用户注册，其二。
	 */
	const checkAndJumpNextPage = async () => {
		if (!invitationCode.value || !invitationCodeInvalidText) { // 判断邀请码为空或者格式错误
			useToast(INVITATION_CODE_INVALID_TEXT, "error");
			return;
		}

		if (password.value && passwordHint.value && passwordHint.value.includes(password.value)) { // 判断密码提示中是否包含密码自身
			useToast(PASSWORD_HINT_DO_NOT_ALLOW_INCLUDES_PASSWORD, "error");
			return;
		}
		isCheckingEmail.value = true;
		if (email.value && password.value) {
			const userExistsCheckRequest: UserExistsCheckRequestDto = { email: email.value };
			const locale = getCurrentLocaleLangCode();
			const requestSendVerificationCodeRequest: RequestSendVerificationCodeRequestDto = {
				email: email.value,
				clientLanguage: locale,
			};
			const checkInvitationCodeRequestDto: CheckInvitationCodeRequestDto = {
				invitationCode: invitationCode.value,
			};
			try {
				const userExistsCheckResult = await api.user.userExistsCheck(userExistsCheckRequest);
				if (userExistsCheckResult.success && !userExistsCheckResult.exists) {
					const requestSendVerificationCodePromise = api.user.requestSendVerificationCode(requestSendVerificationCodeRequest);
					const checkInvitationCodePromise = api.user.checkInvitationCode(checkInvitationCodeRequestDto);
					const [requestSendVerificationCodeResponse, checkInvitationCodeResponse] = await Promise.all([requestSendVerificationCodePromise, checkInvitationCodePromise]);

					if (!requestSendVerificationCodeResponse.isTimeout)
						if (checkInvitationCodeResponse.success && checkInvitationCodeResponse.isAvailableInvitationCode) {
							isCheckingEmail.value = false;
							currentPage.value = "register3";
						} else
							useToast("邀请码不合规或者已被使用", "error", 5000); // TODO: 使用多语言
					else
						useToast("操作太快啦~ 请稍后再试", "warning", 5000); // TODO: 使用多语言
				} else
					useToast("该邮箱已注册，请更换", "error", 5000); // TODO: 使用多语言
			} catch (error) {
				useToast("注册失败", "error"); // TODO: 使用多语言
			}
		} else
			useToast("请输入用户名和密码", "error"); // TODO: 使用多语言
		isCheckingEmail.value = false;
	};

	/**
	 * 用户注册，其三。
	 */
	async function registerUser() {
		if (!verificationCode.value) {
			useToast("验证码不能为空", "error"); // TODO: 使用多语言
			return;
		}
		if (password.value !== confirmPassword.value) {
			useToast(t.toast.password_mismatch, "error");
			return;
		}

		isTryingRegistration.value = true;

		const passwordHash = await generateHash(password.value);
		const userRegistrationRequest: UserRegistrationRequestDto = {
			email: email.value,
			passwordHash,
			passwordHint: passwordHint.value,
			verificationCode: verificationCode.value,
			invitationCode: invitationCode.value,
			username: username.value,
			userNickname: nickname.value,
		};
		try {
			const registrationResponse = await api.user.registration(userRegistrationRequest);

			if (registrationResponse.success) { // 如果注册成功
				await api.user.getSelfUserInfo(); // 根据获取到的用户 UID 和 Token 获取用户数据，相当于自动登录
				isTryingRegistration.value = false; // 停止注册按钮加载动画
				open.value = false; // 关闭登录页
				currentPage.value = "login"; // 将登录页设为登录窗口默认页
			} else
				useToast("注册失败，请稍后再试", "error"); // TODO: 使用多语言
		} catch (error) {
			useToast("注册失败，请稍后再试", "error"); // TODO: 使用多语言
		}
		isTryingRegistration.value = false; // 停止注册按钮加载动画
	}

	// DELETE: [Aira] Change passwords should be in settings, not login window.
	/**
	 * 重置密码。
	 */
	async function resetPassword() {
		// const oapiClient = useMap();
		// const oldPassword = ""; // Should we get this?
		// await oapiClient.resetPassword(oldPassword, password.value);
		// open.value = false;
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

	const passwordHintInvalidText = ref<string | boolean>();

	/**
	 * 校验密码提示中是否包含密码自身
	 * @param e 用户输入事件
	 */
	function checkPasswordHintIncludesPassword(e: InputEvent) {
		const targe = e.target as HTMLInputElement;
		const inputValue = targe.value;
		if (password.value && inputValue?.includes(password.value))
			passwordHintInvalidText.value = PASSWORD_HINT_DO_NOT_ALLOW_INCLUDES_PASSWORD;
		else
			passwordHintInvalidText.value = false;
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
				:style="{
					'--avatar-movement': avatarMovement + 'px',
					'--text-padding-left': textPaddingLeft + 'px',
				}"
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
								autoComplete="username"
								@keyup.enter="loginUser"
							/>
							<TextBox
								v-model="password"
								type="password"
								:placeholder="t.password"
								icon="lock"
								autoComplete="current-password"
								@keyup.enter="loginUser"
							/>
							<div class="button login-button-placeholder">
								<Button class="button login-button button-block" :loading="isTryingLogin" :disabled="isTryingLogin || selfUserInfoStore.isLogined" @click="loginUser">Link Start!</Button>
							</div>
						</div>
						<div class="action margin-left-inset margin-right-inset">
							<Button @click="currentPage = 'forgot'">{{ t.loginwindow.login_to_forgot }}</Button>
							<Button @click="currentPage = 'register1'">{{ t.loginwindow.login_to_register }}</Button>
						</div>
					</div>
				</div>

				<div class="main right">
					<!-- 注册 其一 Register #1 -->
					<div class="register1">
						<HeadingGroup :name="t.register" englishName="Register" class="collapse" />
						<div class="form textbox-with-span">
							<span>{{ t.user.username_nickname_requirements }}</span>
							<div>
								<TextBox
									ref="nameTextBox"
									v-model="username"
									:placeholder="t.user.username"
									size="large"
									icon="person"
									required
									:pattern="validChar"
									:maxLength="20"
								/>
								<span>{{ t.user.username_requirements_unique }}</span>
							</div>
							<div>
								<TextBox
									ref="nameTextBox"
									v-model="nickname"
									:placeholder="t.user.nickname"
									size="large"
									icon="person"
									:pattern="validChar"
									:maxLength="20"
								/>
							</div>
						</div>
						<div class="action margin-left-inset">
							<Button @click="currentPage = 'login'">{{ t.loginwindow.register_to_login }}</Button>
							<Button icon="arrow_right" class="button icon-behind" :loading="isCheckingUsername" :disabled="isCheckingUsername" @click="checkUsernameAndJumpNextPage">{{ t.step.next }}</Button>
						</div>
					</div>

					<!-- 注册 其二 Register #2 -->
					<div class="register2">
						<HeadingGroup :name="t.register" englishName="Register" class="collapse" />
						<div class="form">
							<TextBox
								v-model="email"
								type="email"
								:placeholder="t.email_address"
								icon="email"
								:invalid="isInvalidEmail"
								:required="true"
								autoComplete="email"
							/>
							<TextBox
								v-model="password"
								type="password"
								:placeholder="t.password"
								icon="lock"
								:required="true"
								autoComplete="new-password"
							/>
							<!-- <TextBox
								v-model="passwordHint"
								type="text"
								:placeholder="t.password.hint"
								icon="visibility"
								:invalid="passwordHintInvalidText"
								@input="checkPasswordHintIncludesPassword"
							/> -->
							<TextBox
								v-model="invitationCode"
								type="text"
								:placeholder="t.invitation_code"
								icon="gift"
								:required="true"
								:invalid="invitationCodeInvalidText"
							/>
						</div>
						<div class="action margin-left-inset">
							<Button icon="arrow_left" class="button" @click="currentPage = 'register1'">{{ t.step.previous }}</Button>
							<Button icon="arrow_right" class="button icon-behind" :loading="isCheckingEmail" :disabled="isCheckingEmail" @click="checkAndJumpNextPage">{{ t.step.next }}</Button>
						</div>
					</div>

					<!-- 注册 其三 Register #3 -->
					<div class="register3">
						<HeadingGroup :name="t.register" englishName="Register" class="collapse" />
						<div class="form">
							<div><Preserves>{{ t.loginwindow.register_email_sent_info }}</Preserves></div>
							<TextBox
								v-model="verificationCode"
								type="text"
								:placeholder="t.verification_code"
								icon="verified"
								:required="true"
								autoComplete="one-time-code"
							/>
							<!-- TODO: [Aira] There should be a resend button on the right of the verification code textbox -->
							<TextBox
								v-model="confirmPassword"
								type="password"
								:placeholder="t.password.retype"
								icon="lock"
								:required="true"
								autoComplete="current-password"
							/>
						</div>
						<div class="action margin-left-inset">
							<Button icon="arrow_left" class="button" @click="currentPage = 'register2'">{{ t.step.previous }}</Button>
							<Button icon="arrow_right" class="button icon-behind" :loading="isTryingRegistration" :disabled="isTryingRegistration" @click="registerUser">{{ t.step.next }}</Button>
						</div>
					</div>

					<!-- 忘记密码 Forgot Password -->
					<div class="forgot">
						<HeadingGroup :name="t.loginwindow.forgot_title" englishName="forgot" />
						<div class="form">
							<div><Preserves>{{ t.loginwindow.forgot_info }}</Preserves></div>
							<TextBox
								v-model="email"
								type="email"
								:placeholder="t.email_address"
								icon="email"
							/>
							<Button icon="send" class="button logo-font button-block">{{ t.send }}</Button>
						</div>
						<div class="action margin-left-inset">
							<Button @click="currentPage = 'login'">{{ t.loginwindow.forgot_to_login }}</Button>
						</div>
					</div>

					<!-- 重设密码 Reset Password -->
					<div class="reset">
						<HeadingGroup :name="t.loginwindow.reset_title" englishName="Reset" />
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
							<Button icon="check" class="button" @click="resetPassword">{{ t.step.finish }}</Button>
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
						<NuxtImg v-if="selfUserInfoStore.userAvatar" provider="kirakira" :src="selfUserInfoStore.userAvatar" alt="avatar" />
						<Icon v-else name="person" />
					</div>
					<div ref="loginAnimationText" class="texts">
						<div class="welcome">{{ t.loginwindow.login_welcome }}</div>
						<div class="name">{{ selfUserInfoStore.userNickname }}</div>
					</div>
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
	$avatar-gap: 25px;
	$avatar-min-left: 25px;

	:comp {
		@include dropdown-flyouts;
		@include round-large;
		@include set-max-size;
		@include acrylic-background;
		--avatar-center: calc(#{$narrow-width} - var(--avatar-movement)) 50%;
		display: flex;
		justify-content: space-between;
		width: $width;
		height: $height;
		overflow: clip;
		clip-path: circle(125% at var(--avatar-center));
		transition: all $transition-ease $enter-duration;

		&.v-leave-active {
			transition: all $ease-in-smooth $leave-duration !important;

			&,
			* {
				transition-duration: 250ms;
			}
		}

		&.v-enter-from,
		&.v-leave-to {
			translate: 0 6rem;
			opacity: 0;
		}

		@media #{$narrow-screen} {
			--avatar-center: calc(#{calc($narrow-width / 2)} - var(--avatar-movement)) 50%;
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
			translate: if($direction == left, -$move-distance, $move-distance);
			opacity: 0;
			pointer-events: none;
			transition: all $transition-ease $enter-duration;
			animation: none !important;
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
		overflow: clip;

		.logining > & {
			overflow: visible;
		}

		> * {
			@include square(100%);
			@include set-max-size;
			position: absolute;
			top: 0;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: $width * 0.5;
			height: 100%;
			padding: 35px 45px;

			@if true {
				// HACK: 为了故意不应用排序规则而将下面这部分页面声明单独提炼在下方。
				@include page("!.register1", ".register1", right);
				@include page("!.register2", ".register2", right);
				@include page("!.register3", ".register3", right);
				@include page("!.forgot", ".forgot", right);
				@include page("!.reset", ".reset", right);
				@include page(".register2", ".register1", left);
				@include page(".register3", ".register2", left);
				@include page("!.register1, .register2, .register3", ".register-title", right);
			}
		}

		&.left {
			width: 50%;

			@media #{$narrow-screen} {
				width: 100%;
			}

			> * {
				transition: all $transition-ease $enter-duration;
			}

			.move-left & {
				width: 0;

				> * {
					left: 0;
					translate: $width * -0.25 0;
					opacity: 0;
					pointer-events: none;

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
				transition: all $transition-ease $enter-duration;

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
				@extend .logo-font;
				--i: 0;
				position: absolute;
			}
		}

		&.textbox-with-span {
			gap: 8px;

			> span {
				margin-bottom: 16px;
			}

			> * {
				display: flex;
				flex-direction: column;
				gap: 8px;

				> span {
					color: c(icon-color);
					font-size: 12px;
					text-align: right;
				}
			}
		}
	}

	.logo-font {
		font-family: $english-logo-fonts;
		font-feature-settings: normal;
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
		overflow: clip;
		transition: all $transition-ease $enter-duration;

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
		scale: 0;
		clip-path:
			polygon(calc(50% - $thickness) 0,
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
			calc(50% + $thickness) 0);
	}

	.avatar {
		@include square($avatar-size);
		@include circle;
		@include absolute-center-sized;
		position: absolute;
		overflow: clip;
		background-color: c(accent-20);
		scale: 0;

		> .icon {
			color: c(accent-90);
			font-size: $avatar-size;
			scale: 0.6;
		}

		> img {
			width: 100%;
			aspect-ratio: 1 / 1;
			object-fit: cover;
		}
	}

	.texts {
		display: none;
		flex-direction: column;
		gap: 8px;
		justify-content: center;
		width: fit-content;
		height: 100%;
		padding-right: $avatar-min-left;
		padding-left: var(--text-padding-left);

		&.rendered {
			display: flex;
			visibility: hidden;
		}
	}

	.welcome {
		font-size: 24px;
	}

	.name {
		font-size: 38px;
		font-weight: bold;
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
		translate: 0 180px;
		rotate: -33deg;

		.line {
			@include oval;
			position: absolute;
			width: 872px;
			height: 40px;
			background-color: c(accent-20);
			translate: 913px;
			opacity: 0;

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
			pointer-events: none;
			animation: login-animation-button 600ms $ease-login-button forwards;

			&,
			:deep(span) {
				color: transparent;
				transition: $fallback-transitions, color 100ms;
			}

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
				login-animation-avatar 600ms 540ms $ease-out-back forwards,
				login-animation-avatar-mover 600ms 1s $ease-scaler-or-mover forwards;
		}

		.texts {
			display: flex;
		}

		.welcome {
			animation: name-move 700ms 1.05s $ease-text-move both;
		}

		.name {
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

			@media (height <= 432px) and (width > #{$mobile-max-width}) {
				--corner-y: calc(50dvh - #{40px * 3 - 12px});
			}

			@include mobile {
				--corner-y: calc(-50dvh + 28px);

				animation:
					circle-mask-become-smaller 500ms 2s $ease-out-max forwards,
					move-avatar-to-corner-mobile 500ms 2.5s $ease-out-max forwards;
			}
		}
	}

	@keyframes login-animation-button {
		to {
			@include square(800px);
			border-radius: 50%;
			translate: -40px -450px;
			scale: 1.15;
		}
	}

	@keyframes login-animation-button-narrow {
		to {
			@include square(400px);
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

	@keyframes login-animation-avatar {
		from {
			scale: 0;
		}

		to {
			scale: 1;
		}
	}

	@keyframes login-animation-avatar-mover {
		from {
			translate: 0;
		}

		to {
			translate: calc(0px - var(--avatar-movement));
		}
	}

	@keyframes name-move {
		0% {
			translate: 200px;
			opacity: 0;
		}

		1% {
			translate: 200px;
			opacity: 1;
		}

		100% {
			translate: 0;
			opacity: 1;
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
			translate: 913px;
			opacity: 1;
		}

		to {
			translate: -670px;
			opacity: 1;
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
			$scale: calc(40px / $avatar-size);
			translate: calc(-50dvw + 4px + (#{$avatar-size} / 2 + var(--avatar-movement)) * #{$scale}) var(--corner-y);
			scale: $scale;
		}
	}

	@keyframes move-avatar-to-corner-mobile {
		to {
			$scale: calc(40px / $avatar-size);
			translate: calc(-50dvw + 20px + (#{$avatar-size} / 2 + var(--avatar-movement)) * #{$scale}) var(--corner-y);
			scale: $scale;
		}
	}
</style>
