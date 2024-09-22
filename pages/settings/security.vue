<script setup lang="ts">
	const passwordChangeDate = ref(new Date());
	const authenticatorAddDate = ref(new Date());
	const passwordChangeDateDisplay = computed(() => formatDateWithLocale(passwordChangeDate.value));
	const authenticatorAddDateDisplay = computed(() => formatDateWithLocale(authenticatorAddDate.value));
	const selfUserInfoStore = useSelfUserInfoStore();

	const showChangeEmail = ref(false);
	const changeEmailVerificationCode = ref("");
	const newEmail = ref("");
	const isInvalidNewEmail = computed(() => !!newEmail.value && !newEmail.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]{2,}$/));
	const changeEmailPassword = ref("");
	const isChangingEmail = ref(false);

	const showChangePassword = ref(false);
	const changePasswordVerificationCode = ref("");
	const oldPassword = ref("");
	const newPassword = ref("");
	const confirmNewPassword = ref("");
	const isChangingPassword = ref(false);

	const isEmail2FAEnabled = ref(false);
	const isTotp2FAEnabled = ref(false);

	const typeOf2FA = ref<"none" | "email" | "totp">("none");
	const showCreateTotpModel = ref(false);
	const showEditTotpModel = ref(false);
	const checkUser2FAResult = ref<CheckUserHave2FAServiceResponseDto>();
	const hasBoundTotp = computed(() => checkUser2FAResult.value?.success && checkUser2FAResult.value.have2FA && checkUser2FAResult.value?.type === "totp"); // 当 2FA 存在且类型为 totp 时，开启编辑 TOTP 的模态框，否则开启创建 TOTP 的模态框

	/**
	 * 通过 Cookie 中的 UUID 检查用户是否已开启 2FA 身份验证器
	 */
	async function checkUserHave2FAByUUID() {
		const headerCookie = useRequestHeaders(["cookie"]);
		checkUser2FAResult.value = await api.user.checkUserHave2FAByUUID(headerCookie);
	}

	/**
	 * 开启 TOTP 模态框
	 */
	function openTotpModel() {
		if (hasBoundTotp.value)
			openEditTotpModel();
		else
			openCreateTotpModel();
	}

	/**
	 * 开启创建 TOTP 的模态框
	 */
	function openCreateTotpModel() {
		/**
		 * 0. 开启模态框
		 * 1. 请求创建 TOTP
		 * 2. 根据创建结果渲染二维码、显示备份码、恢复码
		 */

		showCreateTotpModel.value = true;
	}

	/**
	 * 开启编辑 TOTP 的模态框
	 */
	function openEditTotpModel() {
		showEditTotpModel.value = true;
	}

	/**
	 * 修改 Email
	 */
	async function updateUserEmail() {
		const oldEmail = selfUserInfoStore.userEmail ?? "";
		if (!newEmail.value || !changeEmailPassword.value || !changeEmailVerificationCode.value) {
			useToast("必填项不能为空！", "warning", 5000); // TODO: 使用多语言
			return;
		}
		if (oldEmail === newEmail.value) {
			useToast("新邮箱不能与旧邮箱相同！", "warning", 5000); // TODO: 使用多语言
			return;
		}
		isChangingEmail.value = true;
		const passwordHash = await generateHash(changeEmailPassword.value);
		const updateUserEmailRequest: UpdateUserEmailRequestDto = {
			uid: selfUserInfoStore.uid ?? 0,
			oldEmail,
			newEmail: newEmail.value,
			passwordHash,
			verificationCode: changeEmailVerificationCode.value,
		};
		const updateUserEmailResult = await api.user.updateUserEmail(updateUserEmailRequest);
		if (updateUserEmailResult.success) {
			await api.user.getSelfUserInfo();
			useToast("更换邮箱成功", "success"); // TODO: 使用多语言
			showChangeEmail.value = false;
		} else
			useToast("更换邮箱失败，请稍后再试", "error", 5000); // TODO: 使用多语言
		newEmail.value = "";
		changeEmailPassword.value = "";
		changeEmailVerificationCode.value = "";
		isChangingEmail.value = false;
	}

	/**
	 * 修改 Email
	 */
	async function updateUserPassword() {
		if (!oldPassword.value || !newPassword.value || !changePasswordVerificationCode.value) {
			useToast("必要的参数为空", "warning"); // TODO: 使用多语言
			return;
		}
		if (newPassword.value !== confirmNewPassword.value) {
			useToast("两次输入的密码不一致，请确认。", "warning"); // TODO: 使用多语言
			return;
		}
		isChangingPassword.value = true;
		const oldPasswordHash = await generateHash(oldPassword.value);
		const newPasswordHash = await generateHash(newPassword.value);
		const updateUserPasswordRequest: UpdateUserPasswordRequestDto = {
			oldPasswordHash,
			newPasswordHash,
			verificationCode: changePasswordVerificationCode.value,
		};
		const updateUserPasswordResult = await api.user.updateUserPassword(updateUserPasswordRequest);
		if (updateUserPasswordResult.success) {
			isChangingPassword.value = false;
			showChangePassword.value = false;
			useToast("更换密码成功", "success"); // TODO: 使用多语言
			await api.user.userLogout();
			useEvent("app:requestLogin");
		} else
			useToast("更换密码失败，请稍后再试", "error"); // TODO: 使用多语言
	}

	await checkUserHave2FAByUUID();
</script>

<template>
	<div>
		<InfoBar type="warning" title="警告">
			该页面中的某些功能正在开发中，无法按预期工作。
			<br />
			1）密码的修改日期未正确显示。
			<br />
			2）身份验证器无法正常使用。
		<!-- TODO: 使用多语言 -->
		</InfoBar>
		<section>
			<SettingsChipItem
				icon="email"
				trailingIcon="edit"
				:details="t.current_email + t.colon + selfUserInfoStore.userEmail"
				@trailingIconClick="showChangeEmail = true"
			>{{ t.email_address }}</SettingsChipItem>
		</section>
		<section>
			<SettingsChipItem
				icon="password"
				trailingIcon="edit"
				:details="t.modification_date + t.colon + passwordChangeDateDisplay"
				@trailingIconClick="showChangePassword = true"
			>{{ t.password }}</SettingsChipItem>
		</section>
		<!-- TODO: 使用多语言 -->
		<Subheader icon="lock">双重验证</Subheader>
		<section list>
			<RadioButton v-model="typeOf2FA" v-ripple value="none" details="关闭双重验证会降低账号安全性。">关闭</RadioButton>
			<RadioButton v-model="typeOf2FA" v-ripple value="email" details="验证码将会直接发送到您的邮箱。若您已经绑定 TOTP 设备，则需要先关闭 TOTP 才能切换至此选项。" :disabled="typeOf2FA === 'totp' || checkUser2FAResult?.type === 'totp'">邮箱验证码</RadioButton>
			<RadioButton v-model="typeOf2FA" v-ripple value="totp" details="在你绑定了 TOTP 的设备中查看验证码。">TOTP（基于时间的一次性密码）</RadioButton>
		</section>
		<section v-if="typeOf2FA === 'totp'">
			<!-- TODO: 使用多语言 -->
			<SettingsChipItem
				icon="lock"
				:trailingIcon="hasBoundTotp ? 'edit' : 'add'"
				:details="t.addition_date + t.colon + authenticatorAddDateDisplay"
				@trailingIconClick="openTotpModel"
			>TOTP {{ t.authenticator }}</SettingsChipItem>
		</section>

		<!-- TODO: 使用多语言 -->
		<Modal v-model="showChangeEmail" title="更改邮箱" icon="email">
			<div class="change-email-modal">
				<form>
					<!-- TODO: 使用多语言 -->
					<TextBox v-model="newEmail" :required="true" :invalid="isInvalidNewEmail" type="email" icon="email" placeholder="新邮箱" autoComplete="new-email" />
					<SendVerificationCode v-model="changeEmailVerificationCode" :email="newEmail" verificationCodeFor="change-email" :disabled="!newEmail || isInvalidNewEmail" />
					<TextBox v-model="changeEmailPassword" :required="true" type="password" icon="lock" :placeholder="t.password._" autoComplete="current-password" />
				</form>
			</div>
			<template #footer-right>
				<Button class="secondary" @click="showChangePassword = false">{{ t.step.cancel }}</Button>
				<Button @click="updateUserEmail" :disabled="isChangingEmail" :loading="isChangingEmail">{{ t.step.apply }}</Button>
			</template>
		</Modal>

		<Modal v-model="showChangePassword" :title="t.password.change" icon="password">
			<div class="change-password-modal">
				<form>
					<SendVerificationCode v-model="changePasswordVerificationCode" verificationCodeFor="change-password" />
					<TextBox v-model="oldPassword" :required="true" type="password" icon="lock" :placeholder="t.password.current" autoComplete="current-password" />
					<TextBox v-model="newPassword" :required="true" type="password" icon="lock" :placeholder="t.password.new" autoComplete="new-password" />
					<TextBox v-model="confirmNewPassword" :required="true" type="password" icon="lock" :placeholder="t.password.new_retype" autoComplete="new-password" />
				</form>
			</div>
			<template #footer-right>
				<Button class="secondary" @click="showChangePassword = false">{{ t.step.cancel }}</Button>
				<Button @click="updateUserPassword" :disabled="isChangingPassword" :loading="isChangingPassword">{{ t.step.apply }}</Button>
			</template>
		</Modal>

		<!-- TODO: 使用多语言 -->
		<Modal v-model="showCreateTotpModel" :title="t.password.change" icon="password">
			<div class="change-password-modal">
				<form>
					<SendVerificationCode v-model="changePasswordVerificationCode" verificationCodeFor="change-password" />
					<TextBox v-model="oldPassword" :required="true" type="password" icon="lock" :placeholder="t.password.current" autoComplete="current-password" />
					<TextBox v-model="newPassword" :required="true" type="password" icon="lock" :placeholder="t.password.new" autoComplete="new-password" />
					<TextBox v-model="confirmNewPassword" :required="true" type="password" icon="lock" :placeholder="t.password.new_retype" autoComplete="new-password" />
				</form>
			</div>
			<template #footer-right>
				<Button class="secondary" @click="showChangePassword = false">{{ t.step.cancel }}</Button>
				<Button @click="updateUserPassword" :disabled="isChangingPassword" :loading="isChangingPassword">{{ t.step.apply }}</Button>
			</template>
		</Modal>
	</div>
</template>

<style scoped lang="scss">
	.change-password-modal {
		display: flex;
		flex-direction: column;
		gap: 24px;
		width: 300px;

		> form {
			display: flex;
			flex-direction: column;
			gap: 16px;
		}

		.text-box {
			--size: large;
		}
	}

	.change-email-modal {
		display: flex;
		flex-direction: column;
		gap: 24px;
		width: 300px;

		> form {
			display: flex;
			flex-direction: column;
			gap: 16px;
		}

		.text-box {
			--size: large;
		}
	}
</style>
