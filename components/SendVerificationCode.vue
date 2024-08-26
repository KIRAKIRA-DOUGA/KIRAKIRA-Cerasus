<script setup lang="ts">
	const props = defineProps<{
		/** 邀请码的用途 */
		verificationCodeFor: "registration" | "change-email" | "change-password";
		/** 邮箱 */ // WARN 当 verificationCodeFor 为 change-password 时无需传递该参数。
		email?: string;
		/** 是否是禁用状态 */
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
			useToast("邮箱不能为空", "warning", 5000); // TODO: 使用多语言
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
			useToast("操作太快啦~ 请稍后再试", "warning", 5000); // TODO: 使用多语言
	}

	/**
	 * 请求发送修改邮箱的验证码
	 */
	async function requestSendChangeEmailVerificationCodeEmail() {
		if (!props.email) {
			useToast("邮箱不能为空", "warning", 5000); // TODO: 使用多语言
			return;
		}
		const locale = getCurrentLocaleLangCode();
		const requestSendChangeEmailVerificationCodeRequest: RequestSendChangeEmailVerificationCodeRequestDto = {
			newEmail: props.email,
			clientLanguage: locale,
		};
		const requestSendChangeEmailVerificationCodeResult = await api.user.requestSendChangeEmailVerificationCode(requestSendChangeEmailVerificationCodeRequest);
		if (requestSendChangeEmailVerificationCodeResult.success && requestSendChangeEmailVerificationCodeResult.isCoolingDown)
			useToast("邮件发送冷却中，请稍后再试", "error", 5000);
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
			useToast("邮件发送冷却中，请稍后再试", "error", 5000);
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
				default:
					console.error("ERROR", "必须指定发送邀请码的目的。");
					throw new Error("必须指定发送邀请码的目的。");
			}
			startTimeout();
		} catch (error) {
			useToast("发送验证码时出错，请重试~", "error", 5000);
			console.error("ERROR", "发送验证码时出错：", error);
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
	<TextBox v-model="value" required icon="verified" :placeholder="t.verification_code" :pattern autoComplete="one-time-code">
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
