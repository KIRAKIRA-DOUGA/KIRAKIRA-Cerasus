<script setup lang="ts">
	const props = defineProps<{
		/** 邀请码的用途。 */
		verificationCodeFor: "registration" | "change-email" | "change-password" | "delete-email-2fa";
		/** 邮箱。 */ // WARN 当 verificationCodeFor 为 change-password 时无需传递该参数。
		email?: string;
		/** 禁用？ */
		disabled?: boolean;
	}>();

	const emits = defineEmits<{
		send: [];
	}>();

	const value = defineModel<string>({ required: true });
	// const { timeout, isTimeouted, isResent, startTimeout } = useSendVerificationCodeTimeout(); // 垃圾 Pinia 不支持展开。
	const timeout = useSendVerificationCodeTimeout();
	const pattern = /^\d{6}$/;
	const isSendingEmail = ref(false); // 是否正在发送邮件

	/**
	 * 发送注册验证码
	 */
	async function requestSendRegisterVerificationCodeEmail() {
		if (!props.email) {
			useToast(t.validation.required.email, "warning", 5000);
			return;
		}
		const locale = getCurrentLocaleLangCode();
		const requestSendVerificationCodeRequest: RequestSendVerificationCodeRequestDto = {
			email: props.email,
			clientLanguage: locale,
		};
		const requestSendVerificationCodeResponse = await api.user.requestSendVerificationCode(requestSendVerificationCodeRequest);
		if (!requestSendVerificationCodeResponse.isTimeout)
			console.log(requestSendVerificationCodeResponse);
		else
			useToast(t.toast.too_many_requests, "warning", 5000);
	}

	/**
	 * 请求发送修改邮箱的验证码
	 */
	async function requestSendChangeEmailVerificationCodeEmail() {
		if (!props.email) {
			useToast(t.validation.required.email, "warning", 5000);
			return;
		}
		const locale = getCurrentLocaleLangCode();
		const requestSendChangeEmailVerificationCodeRequest: RequestSendChangeEmailVerificationCodeRequestDto = {
			newEmail: props.email,
			clientLanguage: locale,
		};
		const requestSendChangeEmailVerificationCodeResult = await api.user.requestSendChangeEmailVerificationCode(requestSendChangeEmailVerificationCodeRequest);
		if (requestSendChangeEmailVerificationCodeResult.success && requestSendChangeEmailVerificationCodeResult.isCoolingDown)
			useToast(t.toast.cooling_down, "error", 5000);
	}

	/**
	 * 请求发送修改密码的验证码
	 */
	async function requestSendChangePasswordVerificationCodeEmail() {
		const locale = getCurrentLocaleLangCode();
		const requestSendChangePasswordVerificationCodeRequest: RequestSendChangePasswordVerificationCodeRequestDto = {
			clientLanguage: locale,
		};
		const requestSendChangePasswordVerificationCodeResult = await api.user.requestSendChangePasswordVerificationCode(requestSendChangePasswordVerificationCodeRequest);
		if (requestSendChangePasswordVerificationCodeResult.success && requestSendChangePasswordVerificationCodeResult.isCoolingDown)
			useToast(t.toast.cooling_down, "error", 5000);
	}

	/**
	 * 请求发送删除 Email 身份验证器验证码
	 */
	async function requestSendDeleteEmail2FAVerificationCodeEmail() {
		const locale = getCurrentLocaleLangCode();
		const sendUserDeleteEmailAuthenticatorVerificationCodeRequest: SendUserDeleteEmailAuthenticatorVerificationCodeRequestDto = {
			clientLanguage: locale,
		};
		const sendUserEmailAuthenticatorVerificationCodeResult = await api.user.sendDeleteUserEmailAuthenticatorVerificationCode(sendUserDeleteEmailAuthenticatorVerificationCodeRequest);
		if (sendUserEmailAuthenticatorVerificationCodeResult.success && sendUserEmailAuthenticatorVerificationCodeResult.isCoolingDown)
			useToast(t.toast.cooling_down, "error", 5000);
	}

	/**
	 * 发送验证码。
	 */
	async function sendVerificationCode() {
		isSendingEmail.value = true;
		try {
			switch (props.verificationCodeFor) {
				case "registration":
					await requestSendRegisterVerificationCodeEmail();
					break;
				case "change-email":
					await requestSendChangeEmailVerificationCodeEmail();
					break;
				case "change-password":
					await requestSendChangePasswordVerificationCodeEmail();
					break;
				case "delete-email-2fa":
					await requestSendDeleteEmail2FAVerificationCodeEmail();
					break;
				default:
					console.error("ERROR", "verificationCodeFor is not defined.");
					throw new Error("verificationCodeFor is not defined.");
			}
			startTimeout();
		} catch (error) {
			useToast(t.toast.verification_code_send_failed, "error", 5000);
			console.error("ERROR", "Failed to send verification code:", error);
		}
		isSendingEmail.value = false;
	}

	/**
	 * 开始倒计时
	 */
	function startTimeout() {
		timeout.startTimeout();
	}
</script>

<template>
	<TextBox
		v-model="value"
		required
		icon="verified"
		:placeholder="t.verification_code"
		:pattern
		autoComplete="one-time-code"
	>
		<template #actions>
			<Button :disabled="!timeout.isTimeouted || props.disabled === true || isSendingEmail" @click="startTimeout(); sendVerificationCode();">
				{{ (timeout.isResent ? t.resend : t.send) + (timeout.isTimeouted ? "" : ` (${timeout.timeout})`) }}
			</Button>
		</template>
	</TextBox>
</template>

<style scoped lang="scss">
	@layer components {
		.text-box {
			--size: large;
		}
	}

	button {
		--appearance: secondary;
		font-variant-numeric: tabular-nums;
	}
</style>
