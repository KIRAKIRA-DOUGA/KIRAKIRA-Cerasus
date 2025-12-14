<script setup lang="ts">
	const props = defineProps<{
		/** 邀请码的用途。 */
		verificationCodeFor: "registration" | "change-email-verify-new-email" | "change-email-verify-old-email" | "change-password" | "delete-email-2fa";
		/** 邮箱。// WARN 在某些 verificationCodeFor 类型中必须提供，否则无法发送验证码。 */
		email?: string;
		/** 禁用？ */
		disabled?: boolean;
	}>();

	const { t } = useI18n();

	const emits = defineEmits<{
		send: [];
	}>();

	const value = defineModel<string>({ required: true });

	const timeoutsStore = useSendVerificationCodeTimeoutStoreObject();
	const isTimeouted = computed(() => {
		if (props.verificationCodeFor in timeoutsStore.timeouts)
			return timeoutsStore.timeouts[props.verificationCodeFor].isTimeouted;
		else
			return true;
	});
	const timeoutCountdown = computed(() => {
		if (props.verificationCodeFor in timeoutsStore.timeouts)
			return timeoutsStore.timeouts[props.verificationCodeFor].timeout;
		else
			return 0;
	});
	const isResent = computed(() => {
		if (props.verificationCodeFor in timeoutsStore.timeouts)
			return timeoutsStore.timeouts[props.verificationCodeFor].isResent;
		else
			return false;
	});

	const pattern = /^\d{6}$/;
	const isSendingEmail = ref(false); // 是否正在发送邮件

	/**
	 * 发送注册验证码
	 */
	async function requestSendRegisterVerificationCodeEmail() {
		if (!props.email) {
			useToast(t("validation.required.email"), "warning", 5000);
			return;
		}
		const locale = getCurrentLocaleLangCode();
		const sendGeneralEmailVerificationCodeRequest: SendGeneralEmailVerificationCodeRequestDto = {
			email: props.email,
			clientLanguage: locale,
			mailTemplate: "SendRegistrationVerificationCode",
			exclusiveBusinessName: "registration",
		};
		const requestSendRegisterVerificationCodeEmailResult = await api.user.sendGeneralEmailVerificationCode(sendGeneralEmailVerificationCodeRequest);
		if (!requestSendRegisterVerificationCodeEmailResult) {
			useToast(t("toast.verification_code_send_failed"), "error", 5000);
			return;
		}
		if (requestSendRegisterVerificationCodeEmailResult.isCoolingDown) {
			useToast(t("toast.cooling_down"), "warning", 5000);
			return;
		}
		if (requestSendRegisterVerificationCodeEmailResult.isMaxDailyCreateAttempts || requestSendRegisterVerificationCodeEmailResult.isMaxDailyVerifierAttempts) {
			useToast(t("toast.too_many_requests"), "warning", 5000);
			return;
		}
		if (!requestSendRegisterVerificationCodeEmailResult.success) {
			useToast(t("toast.verification_code_send_failed"), "error", 5000);
			return;
		}
	}

	/**
	 * 请求发送修改邮箱的验证码到新邮箱
	 */
	async function requestSendChangeEmailVerificationCodeToNewEmail() {
		if (!props.email) {
			useToast(t("validation.required.email"), "warning", 5000);
			return;
		}
		const locale = getCurrentLocaleLangCode();
		const sendGeneralEmailVerificationCodeRequest: SendGeneralEmailVerificationCodeRequestDto = {
			email: props.email,
			clientLanguage: locale,
			mailTemplate: "SendChangeEmailVerificationCode",
			exclusiveBusinessName: "update-email",
		};
		const requestSendChangeEmailVerificationCodeToNewEmailResult = await api.user.sendGeneralEmailVerificationCode(sendGeneralEmailVerificationCodeRequest);
		if (!requestSendChangeEmailVerificationCodeToNewEmailResult) {
			useToast(t("toast.verification_code_send_failed"), "error", 5000);
			return;
		}
		if (requestSendChangeEmailVerificationCodeToNewEmailResult.isCoolingDown) {
			useToast(t("toast.cooling_down"), "warning", 5000);
			return;
		}
		if (requestSendChangeEmailVerificationCodeToNewEmailResult.isMaxDailyCreateAttempts || requestSendChangeEmailVerificationCodeToNewEmailResult.isMaxDailyVerifierAttempts) {
			useToast(t("toast.too_many_requests"), "warning", 5000);
			return;
		}
		if (!requestSendChangeEmailVerificationCodeToNewEmailResult.success) {
			useToast(t("toast.verification_code_send_failed"), "error", 5000);
			return;
		}
	}

	/**
	 * 请求发送修改邮箱的验证码到旧邮箱
	 */
	async function requestSendChangeEmailVerificationCodeToOldEmail() {
		const locale = getCurrentLocaleLangCode();
		const sendGeneral2FAEmailVerificationCodeRequest: SendGeneral2FAEmailVerificationCodeRequestDto = {
			clientLanguage: locale,
			mailTemplate: "SendChangeEmailVerificationCode",
			exclusiveBusinessName: "update-email",
		};
		const requestSendChangeEmailVerificationCodeToOldEmailResult = await api.user.sendGeneral2FAEmailVerificationCode(sendGeneral2FAEmailVerificationCodeRequest);
		if (!requestSendChangeEmailVerificationCodeToOldEmailResult) {
			useToast(t("toast.verification_code_send_failed"), "error", 5000);
			return;
		}
		if (requestSendChangeEmailVerificationCodeToOldEmailResult.isCoolingDown) {
			useToast(t("toast.cooling_down"), "warning", 5000);
			return;
		}
		if (requestSendChangeEmailVerificationCodeToOldEmailResult.isMaxDailyCreateAttempts || requestSendChangeEmailVerificationCodeToOldEmailResult.isMaxDailyVerifierAttempts) {
			useToast(t("toast.too_many_requests"), "warning", 5000);
			return;
		}
		if (requestSendChangeEmailVerificationCodeToOldEmailResult.isUsingOtherVerificationMethodOtherThanEmail) { // 使用了非邮箱的其他验证方式
			useToast(t("toast.email_2fa_disabled"), "warning", 5000);
			return;
		}
		if (!requestSendChangeEmailVerificationCodeToOldEmailResult.success) {
			useToast(t("toast.verification_code_send_failed"), "error", 5000);
			return;
		}
	}

	/**
	 * 请求发送修改密码的验证码
	 */
	async function requestSendChangePasswordVerificationCodeEmail() {
		const locale = getCurrentLocaleLangCode();
		const sendGeneral2FAEmailVerificationCodeRequest: SendGeneral2FAEmailVerificationCodeRequestDto = {
			clientLanguage: locale,
			mailTemplate: "SendChangePasswordVerificationCode",
			exclusiveBusinessName: "update-password",
		};
		const requestSendChangeEmailVerificationCodeToOldEmailResult = await api.user.sendGeneral2FAEmailVerificationCode(sendGeneral2FAEmailVerificationCodeRequest);
		if (!requestSendChangeEmailVerificationCodeToOldEmailResult) {
			useToast(t("toast.verification_code_send_failed"), "error", 5000);
			return;
		}
		if (requestSendChangeEmailVerificationCodeToOldEmailResult.isCoolingDown) {
			useToast(t("toast.cooling_down"), "warning", 5000);
			return;
		}
		if (requestSendChangeEmailVerificationCodeToOldEmailResult.isMaxDailyCreateAttempts || requestSendChangeEmailVerificationCodeToOldEmailResult.isMaxDailyVerifierAttempts) {
			useToast(t("toast.too_many_requests"), "warning", 5000);
			return;
		}
		if (requestSendChangeEmailVerificationCodeToOldEmailResult.isUsingOtherVerificationMethodOtherThanEmail) { // 使用了非邮箱的其他验证方式
			useToast(t("toast.email_2fa_disabled"), "warning", 5000);
			return;
		}
		if (!requestSendChangeEmailVerificationCodeToOldEmailResult.success) {
			useToast(t("toast.verification_code_send_failed"), "error", 5000);
			return;
		}
	}

	/**
	 * 请求发送删除 Email 身份验证器验证码
	 */
	async function requestSendDeleteEmail2FAVerificationCodeEmail() {
		const locale = getCurrentLocaleLangCode();
		const sendGeneral2FAEmailVerificationCodeRequest: SendGeneral2FAEmailVerificationCodeRequestDto = {
			clientLanguage: locale,
			mailTemplate: "SendDisableUserEmail2FAVerificationCode",
			exclusiveBusinessName: "delete-email-2fa",
		};
		const requestSendChangeEmailVerificationCodeToOldEmailResult = await api.user.sendGeneral2FAEmailVerificationCode(sendGeneral2FAEmailVerificationCodeRequest);
		if (!requestSendChangeEmailVerificationCodeToOldEmailResult) {
			useToast(t("toast.verification_code_send_failed"), "error", 5000);
			return;
		}
		if (requestSendChangeEmailVerificationCodeToOldEmailResult.isCoolingDown) {
			useToast(t("toast.cooling_down"), "warning", 5000);
			return;
		}
		if (requestSendChangeEmailVerificationCodeToOldEmailResult.isMaxDailyCreateAttempts || requestSendChangeEmailVerificationCodeToOldEmailResult.isMaxDailyVerifierAttempts) {
			useToast(t("toast.too_many_requests"), "warning", 5000);
			return;
		}
		if (requestSendChangeEmailVerificationCodeToOldEmailResult.isUsingOtherVerificationMethodOtherThanEmail) { // 使用了非邮箱的其他验证方式
			useToast(t("toast.email_2fa_disabled"), "warning", 5000);
			return;
		}
		if (!requestSendChangeEmailVerificationCodeToOldEmailResult.success) {
			useToast(t("toast.verification_code_send_failed"), "error", 5000);
			return;
		}
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
				case "change-email-verify-new-email":
					await requestSendChangeEmailVerificationCodeToNewEmail();
					break;
				case "change-email-verify-old-email":
					await requestSendChangeEmailVerificationCodeToOldEmail();
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
			useToast(t("toast.verification_code_send_failed"), "error", 5000);
			console.error("ERROR", "Failed to send verification code:", error);
		}
		isSendingEmail.value = false;
	}

	/**
	 * 开始倒计时
	 */
	function startTimeout() {
		timeoutsStore.startTimeoutByKey(props.verificationCodeFor);
	}
</script>

<template>
	<TextBox
		v-model="value"
		required
		icon="verified"
		:placeholder="$t('verification_code')"
		:pattern
		autoComplete="one-time-code"
	>
		<template #actions>
			<Button :disabled="!isTimeouted || props.disabled === true || isSendingEmail" @click="startTimeout(); sendVerificationCode();">
				{{ (isResent ? $t("resend") : $t("send")) + (isTimeouted ? "" : ` (${timeoutCountdown})`) }}
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
