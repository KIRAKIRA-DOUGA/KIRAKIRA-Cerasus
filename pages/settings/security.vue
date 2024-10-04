<script setup lang="ts">
	import QrcodeVue from 'qrcode.vue'
	import type { Level, RenderAs } from 'qrcode.vue'

	const passwordChangeDate = ref(new Date());
	const authenticatorAddDate = ref(new Date());
	const passwordChangeDateDisplay = computed(() => formatDateWithLocale(passwordChangeDate.value));
	const authenticatorAddDateDisplay = computed(() => formatDateWithLocale(new Date(checkUser2FAResult.value?.totpCreationDateTime ?? 0)));
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

	const typeOf2FA = ref<"none" | "email" | "totp">("none"); // 2FA 的类型
	const showCreateTotpModel = ref(false); // 是否显示创建 TOTP 模态框
	const showDeleteTotpModel = ref(false); // 是否显示编辑 TOTP 模态框
	const checkUser2FAResult = ref<CheckUserHave2FAServiceResponseDto>(); //
	const hasBoundTotp = computed(() => checkUser2FAResult.value?.success && checkUser2FAResult.value.have2FA && checkUser2FAResult.value?.type === "totp"); // 是否已经有 TOTP，当 2FA 存在且类型为 totp 时，开启编辑 TOTP 的模态框，否则开启创建 TOTP 的模态框

	// 创建 TOTP
	const otpAuth = ref<string>(''); // TOTP AUTH（也就是二维码中的值）
	const totpQrcodeLevel = ref<Level>('M'); // 二维码等级
	const totpQrcodeRenderAs = ref<RenderAs>('svg'); // 二维码渲染格式
	const totpQrcodeSize = ref<number>(200); // 二维码尺寸（px）
	const confirmTotpVerificationCode = ref(''); // 确认绑定 TOTP 时用户输入的验证码
	const isConfirmTotp = ref(false); // 是否正在确认绑定 TOTP
	const backupCode = ref<string[]>([]); // 备份码
	const displayBackupCode = computed(() => backupCode.value.join("\t")); // 用于显示的备份码，中间用 TAB 隔开
	const recoveryCode = ref(""); // 恢复码

	// 删除 TOTP
	const deleteTotpVerificationCode = ref(""); // 删除 TOTP 时用户输入的验证码

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

	/**
	 * 通过 Cookie 中的 UUID 检查用户是否已开启 2FA 身份验证器
	 */
	async function checkUserHave2FAByUUID() {
		const headerCookie = useRequestHeaders(["cookie"]);
		checkUser2FAResult.value = await api.user.checkUserHave2FAByUUID(headerCookie);
		if (checkUser2FAResult.value?.type)
			typeOf2FA.value = checkUser2FAResult.value.type;
		else
			typeOf2FA.value = "none";
	}

	/**
	 * 开启 TOTP 模态框
	 */
	function openTotpModel() {
		if (hasBoundTotp.value)
			openDeleteTotpModel();
		else
			openCreateTotpModel();
	}

	/**
	 * 开启创建 TOTP 的模态框
	 */
	async function openCreateTotpModel() {
		/**
		 * 0. 开启模态框
		 * 1. 请求创建 TOTP
		 * 2. 根据创建结果渲染二维码、显示备份码、恢复码
		 */

		showCreateTotpModel.value = true;
		const headerCookie = useRequestHeaders(["cookie"]);
		const createTotpAuthenticatorResult = await api.user.createTotpAuthenticator(headerCookie);
		if (createTotpAuthenticatorResult.success && createTotpAuthenticatorResult.result?.otpAuth)
			otpAuth.value = createTotpAuthenticatorResult.result.otpAuth;
	}

	/**
	 * 关闭创建 TOTP 的模态框，并清除二维码数据和备份码/恢复码数据
	 */
	async function closeCreateTotpModel() {

		isConfirmTotp.value = true;
		await checkUserHave2FAByUUID();

		showCreateTotpModel.value = false;
		otpAuth.value = '';
		confirmTotpVerificationCode.value = "";
		isConfirmTotp.value = false;
		backupCode.value = [];
		recoveryCode.value = "";
	}

	/**
	 * 确认绑定 TOTP
	 */
	async function handleClickConfirmTotp() {
		if (!confirmTotpVerificationCode.value) {
			useToast("请输入验证码", "error");
		}

		isConfirmTotp.value = true;
		const confirmUserTotpAuthenticatorRequest: ConfirmUserTotpAuthenticatorRequestDto = {
			clientOtp: confirmTotpVerificationCode.value,
			otpAuth: otpAuth.value,
		};
		const headerCookie = useRequestHeaders(["cookie"]);
		const confirmUserTotpAuthenticatorResult = await api.user.confirmUserTotpAuthenticator(confirmUserTotpAuthenticatorRequest, headerCookie);

		if (confirmUserTotpAuthenticatorResult.success && confirmUserTotpAuthenticatorResult.result?.backupCode && confirmUserTotpAuthenticatorResult.result.recoveryCode) {
			backupCode.value = confirmUserTotpAuthenticatorResult.result.backupCode
			recoveryCode.value = confirmUserTotpAuthenticatorResult.result.recoveryCode
		}
		isConfirmTotp.value = false;
	}

	/**
	 * 下载 TOTP 生成的备份码和恢复码。
	 */
	function downloadBackupCodeAndRecoveryCode() {
		const backupCodeAndRecoveryCode = `BACKUP CODE:\n${displayBackupCode.value}\n\nRECOVERY CODE:\n${recoveryCode.value}`
		const filename = `KIRAKIRA TOTP CODE ${selfUserInfoStore.username} (UID ${selfUserInfoStore.uid}) ${new Date().getTime()}`
		downloadTxtFileFromString(backupCodeAndRecoveryCode, filename)
	}

	/**
	 * 开启编辑 TOTP 的模态框
	 */
	function openDeleteTotpModel() {
		showDeleteTotpModel.value = true;
	}

	await checkUserHave2FAByUUID();
</script>

<template>
	<div>
		<!-- TODO: 使用多语言 -->
		<!-- <InfoBar type="warning" title="警告">
			该页面中的某些功能正在开发中，无法按预期工作。
			<br />
			1）密码的修改日期未正确显示。
			<br />
			2）身份验证器无法正常使用。
		</InfoBar> -->
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
				:trailingIcon="hasBoundTotp ? 'delete' : 'add'"
				:details="checkUser2FAResult?.totpCreationDateTime ? t.addition_date + t.colon + authenticatorAddDateDisplay : undefined"
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
		<Modal v-model="showCreateTotpModel" title="绑定 TOTP 身份验证器" icon="lock" :hideTitleCloseIcon="true">
			<div class="create-totp-modal">
				<InfoBar type="warning" title="警告">
					<!-- TODO: 使用多语言 -->
					请勿向他人展示本页中显示的内容！
				</InfoBar>
				<div v-if="!backupCode || backupCode.length <= 0 || !recoveryCode" class="page1">
					<div class="step1">
						<h3>1. 安装验证器程序</h3>
						<p>如果你已安装验证器程序，请跳过本步骤。</p>
						<p>如果没有，你需要在你的私人设备中安装一个支持 TOTP 算法的验证器程序，例如 <a href="https://www.microsoft.com/security/mobile-authenticator-app" target="_blank">Microsoft Authenticator</a> 或 <a href="https://support.google.com/accounts/answer/1066447" target="_blank"> Google Authenticator</a>.</p>
					</div>
					<div class="step2">
						<h3>2. 使用验证器程序扫描下方二维码</h3>
						<div class="totp-qrcode-box">
							<QrcodeVue v-if="otpAuth" :value="otpAuth" :level="totpQrcodeLevel" :render-as="totpQrcodeRenderAs" :size="totpQrcodeSize" />
						</div>
					</div>
					<div class="step3">
						<h3>3. 填写验证码</h3>
						<p>扫描二维码后，您的验证器程序中应该会出现一个新的验证码。<a href="https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-Cerasus/issues" target="_blank">遇到问题？</a></p>
						<p>请将验证码填写至下方的输入框中，并在倒计时结束前点击“确认绑定”按钮。</p>
						<form class="totp-confirm-form">
							<TextBox
								v-model="confirmTotpVerificationCode"
								:required="true"
								type="text"
								icon="verified"
								placeholder="验证码"
							/>
						</form>
					</div>
				</div>
				<div v-else class="page2">
					<div class="step4">
						<h3>4. 保存备份码和恢复码</h3>
						<p>备份码可以作为 TOTP 验证码的替代。恢复码不仅可以作为 TOTP 验证码的替代，在使用恢复码登陆后，还会自动解除 TOTP 2FA 绑定。</p>
						<p>每个备份码和恢复码仅能使用一次，且关闭本页面后将不再显示，请妥善保存。</p>
						<br />
						<p>你的备份码如下：</p>
						<pre><code>{{ displayBackupCode }}</code></pre>
						<br />
						<p>你的恢复码如下：</p>
						<pre><code>{{ recoveryCode }}</code></pre>
					</div>
				</div>
			</div>

			<template v-if="!backupCode || backupCode.length <= 0 || !recoveryCode" #footer-right>
				<Button class="secondary" @click="closeCreateTotpModel" :disabled="isConfirmTotp">{{ t.step.cancel }}</Button>
				<!-- TODO: 使用多语言 -->
				<Button @click="handleClickConfirmTotp" :disabled="isConfirmTotp" :loading="isConfirmTotp">确认绑定</Button>
			</template>
			<template v-else #footer-right>
				<!-- TODO: 使用多语言 -->
				<Button class="secondary" @click="downloadBackupCodeAndRecoveryCode">下载备份码和恢复码</Button>
				<!-- TODO: 使用多语言 -->
				<Button @click="closeCreateTotpModel" :disabled="isConfirmTotp" :loading="isConfirmTotp">我已知晓，确认关闭本页面</Button>
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

	.create-totp-modal {
		display: flex;
		flex-direction: column;
		gap: 24px;
		width: 80dvw;
		max-width: 550px;

		> form {
			display: flex;
			flex-direction: column;
			gap: 16px;
		}

		.text-box {
			--size: large;
		}

		.page1,
		.page2 {
			display: flex;
			flex-direction: column;
			gap: 24px;

			.totp-qrcode-box {
				display: flex;
				flex-direction: column;
				height: 200px;
				margin: 5px 0 0 20px;
			}

			.totp-confirm-form {
				padding-top: 5px;
			}

			.step4 {
				pre {
					margin-top: 5px;
					padding: 10px;
					background-color: #f4f4f4;
					border: 1px solid #ddd;
					border-radius: 6px;
					cursor: text;

					code {
						display: block;
						width: 100%;
						user-select: text;
					}
				}
			}
		}
	}
</style>
