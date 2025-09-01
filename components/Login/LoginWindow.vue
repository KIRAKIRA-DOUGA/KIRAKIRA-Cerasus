<docs>
	TODO 建议重构该组件中的动画。
</docs>

<script setup lang="ts">
	import makeUsername from "pomsky/username.pom";
	const props = defineProps<{
		/** 已打开，单向绑定使用。 */
		open?: boolean;
	}>();

	const { avatarSize, avatarGap, avatarMinLeft } = useScssVariables().numbers;
	const selfUserInfoStore = useSelfUserInfoStore();
	const model = defineModel<boolean>();
	type PageType = "login1" | "login2-2fa" | "login2-email" | "register1" | "register2" | "register3" | "forgot1" | "forgot2-email" | "forgot2-totp";
	const currentPage = ref<PageType>("login1");
	const isWelcome = computed(() => ["register1", "register2", "register3"].includes(currentPage.value));
	const coverMoveLeft = computed(() => !["login1", "login2-2fa", "login2-email"].includes(currentPage.value));
	const email = ref("");
	const password = ref("");
	const clientOtp = ref(""); // TOTP 2FA 登录时的一次性密码
	const loginVerificationCode = ref(""); // Email 2FA 登录时的验证码
	const confirmPassword = ref(""); // 二次确认的密码
	const registrationVerificationCode = ref(""); // 注册时的验证码
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
	const isChecking2FA = ref(false); // 正在检查用户是否开启 2FA
	const isTryingLogin = ref(false); // 正在尝试登录
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
			currentPage.value = "login1";
		},
	});
	const loginWindow = refComp();
	const isInvalidEmail = computed(() => !!email.value && !email.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]{2,}$/));

	const isCheckingUsername = ref(false);
	const validChar = makeUsername();
	const username = ref("");
	const nickname = ref("");

	const resetPasswordVerificationCode = ref(""); // 重置密码时的验证码
	const newPassword = ref(""); // 新密码
	const confirmNewPassword = ref(""); // 确认新密码
	const isSendingForgotPasswordVerificationCode = ref(false); // 正在发送忘记密码的验证码
	const isResetPasssword = ref(false); // 正在重置密码

	const timeout = useSendVerificationCodeTimeout(); // 全局的验证码倒计时

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
	 * 发送登录验证码
	 * @returns 是否成功发送登录验证码
	 */
	async function sentLoginVerificationCode(): Promise<boolean> {
		try {
			const passwordStr = password.value;
			const passwordHash = await generateHash(password.value);
			const emailStr = email.value;
			const locale = getCurrentLocaleLangCode();

			if (!passwordStr || !emailStr || !passwordHash) {
				useToast(t.validation.required.email_and_password, "error", 5000);
				return false;
			}

			const sendUserEmailAuthenticatorVerificationCodeRequest: SendUserEmailAuthenticatorVerificationCodeRequestDto = {
				passwordHash,
				email: emailStr,
				clientLanguage: locale,
			};
			const sendUserEmailAuthenticatorVerificationCodeResult = await api.user.sendUserEmailAuthenticatorVerificationCode(sendUserEmailAuthenticatorVerificationCodeRequest);
			timeout.startTimeout(); // 开始倒计时

			if (!sendUserEmailAuthenticatorVerificationCodeResult.success) {
				useToast(t.toast.verification_code_send_failed, "error", 5000);
				currentPage.value = "login1";
				return false;
			}

			if (sendUserEmailAuthenticatorVerificationCodeResult.isCoolingDown) {
				useToast(t.toast.cooling_down, "warning", 5000);
				currentPage.value = "login1";
				return false;
			}

			return true;
		} catch (error) {
			useToast(t.toast.something_went_wrong, "error", 5000);
			currentPage.value = "login1";
			return false;
		}
	}

	/**
	 * 登录账户，其一。
	 */
	async function check2FA() {
		isChecking2FA.value = true;
		try {
			const passwordStr = password.value;
			const emailStr = email.value;
			if (!passwordStr || !emailStr) {
				useToast(t.validation.required.email_and_password, "error", 5000);
				isChecking2FA.value = false;
				return;
			}

			if (isInvalidEmail.value) {
				useToast(t.validation.invalid_format.email, "error", 5000);
				isChecking2FA.value = false;
				return;
			}

			const checkUserHave2FARequest: CheckUserHave2FARequestDto = {
				email: emailStr,
			};
			const check2FAByEmailResult = await api.user.checkUserHave2FAByEmail(checkUserHave2FARequest);

			if (!check2FAByEmailResult.success) { // 查询用户是否开启 2FA 失败，通常是因为用户不存在
				useToast(t.validation.failed.user_info, "error", 5000);
				isChecking2FA.value = false;
				return;
			}

			// 如果有 2FA，则跳转到对应的 2FA 登录页面，如果没有 2FA 则直接登录
			if (check2FAByEmailResult.have2FA)
				if (check2FAByEmailResult.type === "email") {
					const sendResult = await sentLoginVerificationCode();
					if (sendResult) // 如果成功发送则进入下一页，否则在原地等待。
						currentPage.value = "login2-email";
				} else
					currentPage.value = "login2-2fa";

			else
				await loginUser();
		} catch (error) {
			useToast(t.toast.login_failed, "error");
		}
		isChecking2FA.value = false;
	}

	/**
	 * 登录账户，其二。
	 */
	async function loginUser() {
		if (password.value && email.value) {
			const passwordHash = await generateHash(password.value);
			const userLoginRequest: UserLoginRequestDto = {
				email: email.value,
				passwordHash,
				clientOtp: clientOtp.value,
				verificationCode: loginVerificationCode.value,
			};
			try {
				isTryingLogin.value = true;
				const loginResponse = await api.user.login(userLoginRequest);
				isTryingLogin.value = false;

				if (loginResponse.success && loginResponse.uid && loginResponse.token) {
					selfUserInfoStore.tempHideAvatarFromSidebar = true;

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
			useToast(t.validation.required.email_and_password, "error");
		isTryingLogin.value = false;
	}

	/**
	 * 用户注册，其一。
	 */
	async function checkUsernameAndJumpNextPage() {
		if (!username.value && username.value.length <= 0) {
			useToast(t.validation.required.username, "error");
			return;
		}

		if (username.value.length > 200) {
			useToast(t.validation.too_long.username, "error");
			return;
		}

		if (nickname.value?.length > 200) {
			useToast(t.validation.too_long.nickname, "error");
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
			useToast(t.validation.username_invalid_or_taken, "warning", 5000);
		isCheckingUsername.value = false;
	}

	const PASSWORD_HINT_DO_NOT_ALLOW_INCLUDES_PASSWORD = "密码提示中不允许包含密码本身"; // TODO: 使用多语言
	const INVITATION_CODE_INVALID_TEXT = t.validation.invalid_format.invitation_code;
	/**
	 * 用户注册，其二。
	 */
	async function checkAndJumpNextPage() {
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
			const userExistsCheckRequest: UserEmailExistsCheckRequestDto = { email: email.value };
			const checkInvitationCodeRequestDto: CheckInvitationCodeRequestDto = {
				invitationCode: invitationCode.value,
			};
			try {
				const userExistsCheckResult = await api.user.userExistsCheck(userExistsCheckRequest);
				if (userExistsCheckResult.success && !userExistsCheckResult.exists) {
					const checkInvitationCodeResponse = await api.user.checkInvitationCode(checkInvitationCodeRequestDto);
					if (checkInvitationCodeResponse.success && checkInvitationCodeResponse.isAvailableInvitationCode) {
						isCheckingEmail.value = false;
						currentPage.value = "register3";
					} else
						useToast(t.validation.invitation_code_invalid_or_used, "error", 5000);
				} else
					useToast(t.validation.email_registered, "error", 5000);
			} catch (error) {
				useToast(t.toast.something_went_wrong, "error");
				console.error("ERROR", "Registration failed:", error);
			}
		} else
			useToast(t.validation.required.email_and_password, "error");
		isCheckingEmail.value = false;
	}

	/**
	 * 用户注册，其三。
	 */
	async function registerUser() {
		if (!registrationVerificationCode.value) {
			useToast(t.validation.required.verification_code, "error");
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
			verificationCode: registrationVerificationCode.value,
			invitationCode: invitationCode.value,
			username: username.value,
			userNickname: nickname.value,
		};
		try {
			const registrationResponse = await api.user.registration(userRegistrationRequest);

			if (registrationResponse.success) { // 如果注册成功
				await api.user.getSelfUserInfo({ getSelfUserInfoRequest: undefined, appSettingsStore: useAppSettingsStore(), selfUserInfoStore: useSelfUserInfoStore(), headerCookie: undefined }); // 根据获取到的用户 UID 和 Token 获取用户数据，相当于自动登录
				isTryingRegistration.value = false; // 停止注册按钮加载动画
				open.value = false; // 关闭登录页
				currentPage.value = "login1"; // 将登录页设为登录窗口默认页
			} else
				useToast(t.toast.something_went_wrong, "error");
		} catch (error) {
			useToast(t.toast.something_went_wrong, "error");
			console.error("ERROR", "Registration failed:", error);
		}
		isTryingRegistration.value = false; // 停止注册按钮加载动画
	}

	/**
	 * 跳转到重置密码页面。
	 */
	async function jump2ResetPasswordPage() {
		isChecking2FA.value = true;
		try {
			const emailStr = email.value;

			if (isInvalidEmail.value) {
				useToast(t.validation.invalid_format.email, "error", 5000);
				isChecking2FA.value = false;
				return;
			}

			const checkUserHave2FARequest: CheckUserHave2FARequestDto = {
				email: emailStr,
			};
			const check2FAByEmailResult = await api.user.checkUserHave2FAByEmail(checkUserHave2FARequest);
			if (!check2FAByEmailResult.success) { // 查询用户是否开启 2FA 失败，通常是因为用户不存在
				useToast(t.validation.failed.user_info, "error", 5000);
				isChecking2FA.value = false;
				return;
			}
			if (!check2FAByEmailResult.have2FA || check2FAByEmailResult.have2FA && check2FAByEmailResult.type === "email") {
				const locale = getCurrentLocaleLangCode();
				const requestSendForgotPasswordVerificationCodeRequest: RequestSendForgotPasswordVerificationCodeRequestDto = {
					email: emailStr,
					clientLanguage: locale,
				};

				isSendingForgotPasswordVerificationCode.value = true;
				const sendResult = await api.user.requestSendForgotPasswordVerificationCode(requestSendForgotPasswordVerificationCodeRequest);
				timeout.startTimeout(); // 开始倒计时
				isSendingForgotPasswordVerificationCode.value = false;
				
				if (sendResult.isCoolingDown)
					useToast(t.toast.cooling_down, "error", 5000);
				else if (!sendResult.success)
					useToast(t.toast.verification_code_send_failed, "error", 5000);
				else
					currentPage.value = "forgot2-email";
			} else
				currentPage.value = "forgot2-totp";

			isChecking2FA.value = false;
		} catch (error) {
			isSendingForgotPasswordVerificationCode.value = false;
			isChecking2FA.value = false;
			useToast(t.toast.reset_password_failed, "error");
			console.error("ERROR", "Reset password failed:", error);
		}
	}

	/**
	 * 重置密码。
	 */
	async function resetPassword() {
		isResetPasssword.value = true;
		try {
			const emailStr = email.value;
			const password = newPassword.value;
			const confirmPassword = confirmNewPassword.value;
			const resetPasswordVerificationCodeStr = resetPasswordVerificationCode.value;
			if (password !== confirmPassword) {
				useToast(t.toast.password_mismatch, "error");
				return;
			}

			const passwordHash = await generateHash(password);

			const forgotPasswordRequest: ForgotPasswordRequestDto = {
				email: emailStr,
				newPasswordHash: passwordHash,
				verificationCode: resetPasswordVerificationCodeStr,
			};

			const forgotAndResetPasswordResult = await api.user.forgotAndResetPassword(forgotPasswordRequest);
			if (forgotAndResetPasswordResult.success) {
				useToast(t.toast.password_changed, "success");
				currentPage.value = "login1";
			} else
				useToast(t.toast.reset_password_failed, "error");
		} catch (error) {
			useToast(t.toast.reset_password_failed, "error");
			console.error("ERROR", "Reset password failed:", error);
		}
		isResetPasssword.value = false;
	}

	/**
	 * // TODO: 对于使用 TOTP 的用户，无法找回密码。只能跳转到 GitHub 联系管理员手动找回。
	 */
	function jump2GitHub() {
		window.open("https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-Cerasus/issues", "_blank");
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
	 * 校验密码提示中是否包含密码自身。
	 * @param e - 用户输入事件。
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
					<!-- 登录 其一 Login #1 -->
					<div class="login1">
						<HeadingGroup :name="t.login" englishName="Login" />
						<form class="form">
							<TextBox
								v-model="email"
								type="email"
								:placeholder="t.email_address"
								icon="email"
								:invalid="isInvalidEmail"
								autoComplete="username"
								@keyup.enter="check2FA"
							/>
							<TextBox
								v-model="password"
								type="password"
								:placeholder="t.password"
								icon="lock"
								autoComplete="current-password"
								@keyup.enter="check2FA"
							/>
							<div class="button login-button-placeholder">
								<Button
									class="button login-button button-block"
									:loading="isChecking2FA"
									:disabled="isChecking2FA || selfUserInfoStore.isLogined || !timeout.isTimeouted"
									@click="check2FA"
								>
									{{ timeout.isTimeouted ? "Link Start!" : `Link Start! (${timeout.timeout})` }}
								</Button>
							</div>
						</form>
						<div class="action margin-left-inset margin-right-inset">
							<Button @click="currentPage = 'forgot1'">{{ t.loginwindow.login_to_forgot }}</Button>
							<Button @click="currentPage = 'register1'">{{ t.loginwindow.login_to_register }}</Button>
						</div>
					</div>

					<!-- 登录 其二点一 Login #2.1 -->
					<div class="login2-2fa">
						<HeadingGroup :name="t.login" englishName="Login" />
						<span><Preserves>{{ t.loginwindow.login_totp_info }}</Preserves></span>
						<form class="form">
							<TextBox
								v-model="clientOtp"
								type="text"
								:placeholder="t.totp_verification_code"
								icon="lock"
								:invalid="isInvalidEmail"
								autoComplete="off"
								@keyup.enter="loginUser"
							/>
							<div class="button login-button-placeholder">
								<Button class="button login-button button-block" :loading="isTryingLogin" :disabled="isTryingLogin || selfUserInfoStore.isLogined" @click="loginUser">Link Start!</Button>
							</div>
						</form>
						<div class="action margin-left-inset margin-right-inset">
							<Button @click="currentPage = 'login1'">{{ t.navigation.back }}</Button>
							<Button>{{ t.need_help }}</Button>
						</div>
					</div>
					<!-- 登录 其二点二 Login #2.2 -->
					<div class="login2-email">
						<HeadingGroup :name="t.login" englishName="Login" />
						<span>{{ t.loginwindow.login_email_info }}</span>
						<form class="form">
							<TextBox
								v-model="loginVerificationCode"
								type="text"
								:placeholder="t.verification_code"
								icon="lock"
								:invalid="isInvalidEmail"
								autoComplete="off"
								@keyup.enter="loginUser"
							/>
							<div class="button login-button-placeholder">
								<Button class="button login-button button-block" :loading="isTryingLogin" :disabled="isTryingLogin || selfUserInfoStore.isLogined" @click="loginUser">Link Start!</Button>
							</div>
						</form>
						<div class="action margin-left-inset margin-right-inset">
							<Button @click="currentPage = 'login1'">{{ t.navigation.back }}</Button>
							<Button>{{ t.need_help }}</Button>
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
							<Button @click="currentPage = 'login1'">{{ t.loginwindow.register_to_login }}</Button>
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
							<SendVerificationCode v-model="registrationVerificationCode" :email="email" verificationCodeFor="registration" />
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

					<!-- 忘记密码 其一 Forgot Password #1 -->
					<div class="forgot1">
						<HeadingGroup :name="t.loginwindow.forgot_title" englishName="forgot" class="collapse" />
						<div class="form">
							<div><Preserves>{{ t.loginwindow.forgot_info }}</Preserves></div>
							<TextBox
								v-model="email"
								type="email"
								:placeholder="t.email_address"
								icon="email"
								:invalid="isInvalidEmail"
								@keyup.enter="jump2ResetPasswordPage"
							/>
						</div>
						<div class="action margin-left-inset">
							<Button icon="arrow_left" @click="currentPage = 'login1'">{{ t.loginwindow.forgot_to_login }}</Button>
							<Button
								icon="arrow_right"
								class="icon-behind"
								@click="jump2ResetPasswordPage"
								:loading="isChecking2FA || isSendingForgotPasswordVerificationCode"
								:disabled="isChecking2FA || isSendingForgotPasswordVerificationCode || !timeout.isTimeouted"
							>{{ timeout.isTimeouted ? t.step.next : `${t.step.next} (${timeout.timeout})` }}</Button>
						</div>
					</div>

					<!-- 重设密码 其二点一 Forgot Passsword (Email) #2.1 -->
					<div class="forgot2-email">
						<HeadingGroup :name="t.loginwindow.forgot_title" englishName="forgot" class="collapse" />
						<div class="form">
							<div><Preserves>{{ t.loginwindow.reset_password_info }}</Preserves></div>
							<TextBox
								v-model="resetPasswordVerificationCode"
								type="text"
								:placeholder="t.verification_code"
								:required="true"
								icon="verified"
							/>
							<TextBox
								v-model="newPassword"
								type="password"
								:placeholder="t.password"
								:required="true"
								icon="lock"
							/>
							<TextBox
								v-model="confirmNewPassword"
								type="password"
								:placeholder="t.password.retype"
								:required="true"
								icon="lock"
							/>
						</div>
						<div class="action margin-left-inset">
							<Button icon="arrow_left" class="secondary" @click="currentPage = 'forgot1'">{{ t.loginwindow.resent_verification_code }}</Button>
							<Button icon="check" class="button icon-behind" @click="resetPassword" :loading="isResetPasssword" :disabled="isResetPasssword">{{ t.step.finish }}</Button>
						</div>
					</div>

					<!-- 重设密码 其二点二 Forgot Passsword (Totp) #2.2 -->
					<div class="forgot2-totp">
						<HeadingGroup :name="t.loginwindow.forgot_title" englishName="forgot" class="collapse" />
						<div class="form">
							<div><Preserves>{{ t.loginwindow.reset_password_totp_warning }}</Preserves></div>
						</div>
						<div class="action margin-left-inset">
							<Button icon="arrow_left" class="secondary" @click="currentPage = 'login1'">{{ t.loginwindow.back_to_login }}</Button>
							<Button icon="link" class="button" @click="jump2GitHub">{{ t.platform.github }}</Button>
						</div>
					</div>

					<div class="register-title">
						<HeadingGroup :name="t.register" englishName="Register" />
					</div>
					<div class="forgot-title">
						<HeadingGroup :name="currentPage === 'forgot1' ? t.loginwindow.forgot_title : t.loginwindow.reset_title" :englishName="currentPage === 'forgot1' ? 'forgot' : 'reset'" />
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
						<NuxtImg v-if="selfUserInfoStore.userInfo.avatar" :provider="environment.cloudflareImageProvider" :src="selfUserInfoStore.userInfo.avatar" alt="avatar" />
						<Icon v-else name="person" />
					</div>
					<div ref="loginAnimationText" class="texts">
						<div class="welcome">{{ t.loginwindow.login_welcome }}</div>
						<div class="name">{{ selfUserInfoStore.userInfo.userNickname }}</div>
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

	:comp:not(.move-left) .main.right > * {
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
				@include page("!.login1", ".login1", left);

				@include page("!.login2-2fa", ".login2-2fa", left);
				@include page(".login2-2fa", ".login1", left);
				@include page(".login1", ".login2-2fa", right);

				@include page("!.login2-email", ".login2-email", left);
				@include page(".login2-email", ".login1", left);
				@include page(".login1", ".login2-email", right);

				@include page("!.register1", ".register1", right);
				@include page("!.register2", ".register2", right);
				@include page("!.register3", ".register3", right);

				@include page("!.forgot1", ".forgot1", right);
				@include page("!.forgot2-email", ".forgot2-email", right);
				@include page("!.forgot2-totp", ".forgot2-totp", right);

				@include page(".register2", ".register1", left);
				@include page(".register3", ".register2", left);
				
				@include page(".forgot2-email", ".forgot1", left);
				@include page(".forgot2-totp", ".forgot1", left);

				@include page("!.register1, .register2, .register3", ".register-title", right);
				@include page("!.forgot1, .forgot2-email, .forgot2-totp", ".forgot-title", right);
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
			translate: calc(var(--avatar-movement) + 100px);
			opacity: 0;
		}

		1% {
			translate: calc(var(--avatar-movement) + 100px);
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
