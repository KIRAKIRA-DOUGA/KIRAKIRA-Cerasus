<script setup lang="ts">
	import QrcodeVue from "qrcode.vue";
	import type { Level, RenderAs } from "qrcode.vue";

	const passwordChangeDate = ref(new Date());
	const passwordChangeDateDisplay = computed(() => formatDateWithLocale(passwordChangeDate.value));
	const selfUserInfoStore = useSelfUserInfoStore();
	const appSettings = useAppSettingsStore();
	const selfUserInfo = useSelfUserInfoStore();

	// 修改邮箱相关
	const showChangeEmail = ref(false);
	const changeEmailVerificationCode = ref("");
	const newEmail = ref("");
	const isInvalidNewEmail = computed(() => !!newEmail.value && !newEmail.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]{2,}$/));
	const changeEmailPassword = ref("");
	const isChangingEmail = ref(false);

	// 修改密码相关
	const showChangePassword = ref(false);
	const changePasswordVerificationCode = ref("");
	const oldPassword = ref("");
	const newPassword = ref("");
	const confirmNewPassword = ref("");
	const isChangingPassword = ref(false);

	// 2FA 相关
	const checkUser2FAResult = ref<CheckUserHave2FAResponseDto>(); // 获取到的用户 2FA 类型
	const authenticatorAddDateDisplay = computed(() => formatDateWithLocale(new Date(checkUser2FAResult.value?.totpCreationDateTime ?? 0)));
	type TypeOf2FA = "none" | "email" | "totp";
	const categoryOf2FAComputed = computed<TypeOf2FA>({ // 2FA 的类型，带有副作用
		get() {
			return appSettings.typeOf2FA === "email" || appSettings.typeOf2FA === "totp" ? appSettings.typeOf2FA : "none";
		},
		set(newValue) {
			if (appSettings.typeOf2FA === "totp" && newValue !== "totp" && checkUser2FAResult.value?.type === "totp") {
				// 当响应式变量从 totp 改变为其他非 totp 的值，且用户的 2FA 类型为 totp 时，打开解绑 TOTP 的模态框，且不会导致导致响应式变量的变更
				// TODO: 使用多语言
				useToast("在关闭 2FA 之前必须删除 TOTP 验证器", "warning", 5000);
				openDeleteTotpModel();
			} else if (appSettings.typeOf2FA === "email" && newValue !== "email" && checkUser2FAResult.value?.type === "email") {
				// 当响应式变量从 email 改变为其他非 email 的值，且用户的 2FA 类型为 email 时，打开删除 Email 2FA 的模态框，且不会导致导致响应式变量的变更
				openDeleteEmail2FAModel();
				useToast("在关闭 2FA 之前必须验证你的邮箱。", "warning", 5000);
			} else if (newValue === "email" && appSettings.typeOf2FA !== "email" && checkUser2FAResult.value?.type !== "email")
				openCreateEmail2FAModel();
			else
				appSettings.typeOf2FA = newValue;
		},
	});
	const hasBoundTotp = computed(() => checkUser2FAResult.value?.success && checkUser2FAResult.value.have2FA && checkUser2FAResult.value?.type === "totp"); // 是否已经有 TOTP，当 2FA 存在且类型为 totp 时，开启编辑 TOTP 的模态框，否则开启创建 TOTP 的模态框
	const isEmail2FADisable = computed(() => checkUser2FAResult.value?.type === "totp" || categoryOf2FAComputed.value === "totp");
	const isTotp2FADisable = computed(() => checkUser2FAResult.value?.type === "email" || categoryOf2FAComputed.value === "email");

	// 警告相关
	const isUnsafeAccount = computed(() => selfUserInfo.isLogined && (appSettings.typeOf2FA === "none" || !checkUser2FAResult.value?.have2FA));

	// 创建 TOTP 2FA 相关
	const showCreateTotpModel = ref(false); // 是否显示创建 TOTP 模态框
	const otpAuth = ref<string>(""); // TOTP AUTH（也就是二维码中的值）
	const totpQrcodeLevel = ref<Level>("M"); // 二维码等级
	const totpQrcodeRenderAs = ref<RenderAs>("svg"); // 二维码渲染格式
	const totpQrcodeSize = ref<number>(200); // 二维码尺寸（px）
	const confirmTotpVerificationCode = ref(""); // 确认绑定 TOTP 时用户输入的验证码
	const isConfirmTotp = ref(false); // 是否正在确认绑定 TOTP
	const backupCode = ref<string[]>([]); // 备份码
	const displayBackupCode = computed(() => backupCode.value.join("\t")); // 用于显示的备份码，中间用 TAB 隔开
	const recoveryCode = ref(""); // 恢复码

	// 删除 TOTP 2FA 相关
	const showDeleteTotpModel = ref(false); // 是否显示删除 TOTP 的模态框
	const deleteTotpVerificationCode = ref(""); // 删除 TOTP 时用户输入的验证码
	const deleteTotpPassword = ref(""); // 删除 TOTP 时用户输入的密码
	const isDeletingTotp = ref(false); // 是否正在删除 TOTP

	// 创建 Email 2FA 相关
	const showCreateEmail2FAModel = ref(false); // 是否显示创建 Email 2FA 的模态框
	const isCreatingEmail2FA = ref(false); // 是否正在创建 Email 2FA

	// 删除 Email 2FA 相关
	const showDeleteEmail2FAModel = ref(false); // 是否显示删除 Email 2FA 的模态框
	const deleteEmail2FAVerificationCode = ref(""); // 删除 Email 2FA 时用户输入的验证码
	const deleteEmail2FAPassword = ref(""); // 删除 Email 2FA 时用户输入的密码
	const isDeletingEmail2FA = ref(false); // 是否正在删除 Email 2FA

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
			categoryOf2FAComputed.value = checkUser2FAResult.value.type;
		else
			categoryOf2FAComputed.value = "none";
	}

	/**
	 * 开启创建 Email 2FA 的模态框
	 */
	function openCreateEmail2FAModel() {
		showCreateEmail2FAModel.value = true;
	}

	/**
	 * 关闭创建 Email 2FA 的模态框
	 */
	function closeCreateEmail2FAModel() {
		showCreateEmail2FAModel.value = false;
	}

	/**
	 * 用户创建 Email 身份验证器
	 */
	async function createEmail2FA() {
		isCreatingEmail2FA.value = true;
		try {
			const headerCookie = useRequestHeaders(["cookie"]);
			const createEmail2FAResult = await api.user.createEmail2FA(headerCookie);
			if (!createEmail2FAResult.success) {
				useToast("开启邮箱双重验证失败，请稍后重试。", "error", 5000); // TODO: 使用多语言
				isCreatingEmail2FA.value = false;
			}

			if (createEmail2FAResult.isExists) {
				useToast("你已经开启过一个 2FA，请刷新页面。", "warning", 5000); // TODO: 使用多语言
				isCreatingEmail2FA.value = false;
			}

			isCreatingEmail2FA.value = false;
			showCreateEmail2FAModel.value = false;
			appSettings.typeOf2FA = "email";
			useToast("成功开启邮箱双重验证！", "success", 3000); // TODO: 使用多语言
			checkUserHave2FAByUUID();
		} catch (error) {
			useToast("开启邮箱双重验证时出错，请稍后重试。", "error", 5000); // TODO: 使用多语言
			checkUserHave2FAByUUID();
		}
	}

	/**
	 * 开启删除 Email 2FA 的模态框
	 */
	function openDeleteEmail2FAModel() {
		showDeleteEmail2FAModel.value = true;
	}

	/**
	 * 关闭删除 Email 2FA 的模态框，并清除相关状态
	 */
	function closeDeleteEmail2FAModel() {
		showDeleteEmail2FAModel.value = false;
		isDeletingEmail2FA.value = false;
		deleteEmail2FAPassword.value = "";
		deleteEmail2FAVerificationCode.value = "";
	}

	/**
	 * 删除 Email 2FA
	 */
	async function deleteEmail2FAByVerification() {
		isDeletingEmail2FA.value = true;
		try {
			if (!deleteEmail2FAPassword.value || !deleteEmail2FAVerificationCode.value) {
				isDeletingEmail2FA.value = false;
				useToast("必填项为空。", "error", 5000); // TODO: 使用多语言
				return;
			}

			const deleteUserEmailAuthenticatorRequest: DeleteUserEmailAuthenticatorRequestDto = {
				passwordHash: await generateHash(deleteEmail2FAPassword.value),
				verificationCode: deleteEmail2FAVerificationCode.value,
			};
			const headerCookie = useRequestHeaders(["cookie"]);
			const deleteEmail2FAResult = await api.user.deleteEmail2FA(deleteUserEmailAuthenticatorRequest, headerCookie);
			if (deleteEmail2FAResult.success) {
				useToast("你已关闭邮箱验证码。", "success", 5000); // TODO: 使用多语言
				closeDeleteEmail2FAModel();
				await checkUserHave2FAByUUID();
			} else {
				isDeletingEmail2FA.value = false;
				useToast("关闭 Email 2FA 失败，请稍后重试", "error", 5000); // TODO: 使用多语言
			}
		} catch (error) {
			isDeletingEmail2FA.value = false;
			useToast("关闭 Email 2FA 时出错，请刷新页面", "error", 5000); // TODO: 使用多语言
		}
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
		otpAuth.value = "";
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
			useToast("请输入验证码", "error"); // TODO: 使用多语言
			return;
		}

		isConfirmTotp.value = true;

		try {
			const confirmUserTotpAuthenticatorRequest: ConfirmUserTotpAuthenticatorRequestDto = {
				clientOtp: confirmTotpVerificationCode.value,
				otpAuth: otpAuth.value,
			};
			const headerCookie = useRequestHeaders(["cookie"]);
			const confirmUserTotpAuthenticatorResult = await api.user.confirmUserTotpAuthenticator(confirmUserTotpAuthenticatorRequest, headerCookie);

			if (confirmUserTotpAuthenticatorResult.success && confirmUserTotpAuthenticatorResult.result?.backupCode && confirmUserTotpAuthenticatorResult.result.recoveryCode) {
				backupCode.value = confirmUserTotpAuthenticatorResult.result.backupCode;
				recoveryCode.value = confirmUserTotpAuthenticatorResult.result.recoveryCode;
			}
			await checkUserHave2FAByUUID();
		} catch (error) {
			isConfirmTotp.value = false;
			useToast("绑定 TOTP 验证器失败，请稍后再试", "error", 5000); // TODO: 使用多语言
		}
		isConfirmTotp.value = false;
	}

	/**
	 * 下载 TOTP 生成的备份码和恢复码。
	 */
	function downloadBackupCodeAndRecoveryCode() {
		// TODO: 使用多语言
		// 此处也许没必要使用多语言。
		const backupCodeAndRecoveryCode = `BACKUP CODE:\n${displayBackupCode.value}\n\nRECOVERY CODE:\n${recoveryCode.value}`;
		const filename = `KIRAKIRA TOTP CODE ${selfUserInfoStore.username} (UID ${selfUserInfoStore.uid}) ${new Date().getTime()}`;
		downloadTxtFileFromString(backupCodeAndRecoveryCode, filename);
	}

	/**
	 * 开启删除 TOTP 的模态框
	 */
	function openDeleteTotpModel() {
		showDeleteTotpModel.value = true;
	}

	/**
	 * 关闭删除 TOTP 的模态框，并清除相关状态
	 */
	function closeDeleteTotpModel() {
		showDeleteTotpModel.value = false;
		isDeletingTotp.value = false;
		deleteTotpPassword.value = "";
		deleteTotpVerificationCode.value = "";
	}

	/**
	 * 删除 TOTP 身份验证器
	 */
	async function deleteTotpByVerification() {
		if (!deleteTotpPassword.value) {
			useToast("请输入密码", "error"); // TODO: 使用多语言
			return;
		}

		if (!deleteTotpVerificationCode.value) {
			useToast("请输入验证码", "error"); // TODO: 使用多语言
			return;
		}

		isDeletingTotp.value = true;
		try {
			const passwordHash = await generateHash(deleteTotpPassword.value);
			const deleteTotpAuthenticatorByTotpVerificationCodeRequest: DeleteTotpAuthenticatorByTotpVerificationCodeRequestDto = {
				passwordHash,
				clientOtp: deleteTotpVerificationCode.value,
			};
			const headerCookie = useRequestHeaders(["cookie"]);
			const deleteTotpByVerificationCodeResult = await api.user.deleteTotpByVerificationCode(deleteTotpAuthenticatorByTotpVerificationCodeRequest, headerCookie);

			if (deleteTotpByVerificationCodeResult.isCoolingDown)
				useToast("无法删除，验证码冷却中。", "warning"); // TODO: 使用多语言

			if (deleteTotpByVerificationCodeResult.success) {
				closeDeleteTotpModel();
				await checkUserHave2FAByUUID();
			} else
				useToast("删除 TOTP 身份验证器失败，请稍后再试", "error", 5000); // TODO: 使用多语言

			isDeletingTotp.value = false;
		} catch (error) {
			useToast("删除 TOTP 身份验证器失败，请稍后再试", "error", 5000); // TODO: 使用多语言
			isDeletingTotp.value = false;
		}
	}

	await checkUserHave2FAByUUID();
</script>

<template>
	<div>
		<!-- TODO: 使用多语言 -->
		<InfoBar v-if="isUnsafeAccount" type="warning" :title="t.severity.warning">
			你还没有开启二重验证，建议你立即启用。
			<br />
			没有启动二重验证的账号更容易被盗号。
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
		<!-- TODO: 使用多语言 -->
		<span>开启双重验证可以提高账号的安全性，如果你需要切换 2FA 类型，必须先将其关闭。</span>
		<section list>
			<!-- TODO: 使用多语言 -->
			<RadioButton v-model="categoryOf2FAComputed" v-ripple value="none" details="关闭双重验证会降低账号安全性。">关闭</RadioButton>
			<!-- TODO: 使用多语言 -->
			<RadioButton v-model="categoryOf2FAComputed" v-ripple value="email" details="敏感操作时，验证码将会直接发送到你的邮箱。" :disabled="isEmail2FADisable">邮箱验证码</RadioButton>
			<!-- TODO: 使用多语言 -->
			<RadioButton v-model="categoryOf2FAComputed" v-ripple value="totp" details="敏感操作时，需要在你绑定了 TOTP 的设备中查看验证码。" :disabled="isTotp2FADisable">TOTP（基于时间的一次性密码）</RadioButton>
		</section>
		<section v-if="categoryOf2FAComputed === 'totp'">
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
				<Button class="secondary" :disabled="isChangingEmail" @click="showChangePassword = false">{{ t.step.cancel }}</Button>
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
				<Button class="secondary" :disabled="isChangingPassword" @click="showChangePassword = false">{{ t.step.cancel }}</Button>
				<Button @click="updateUserPassword" :disabled="isChangingPassword" :loading="isChangingPassword">{{ t.step.apply }}</Button>
			</template>
		</Modal>

		<!-- TODO: 使用多语言 -->
		<Modal v-model="showCreateTotpModel" title="绑定 TOTP 身份验证器" icon="lock" :hideTitleCloseIcon="true">
			<div class="create-totp-modal">
				<InfoBar type="warning" :title="t.severity.warning">
					<!-- TODO: 使用多语言 -->
					请勿向他人展示本页中显示的内容！
				</InfoBar>
				<div v-if="!backupCode || backupCode.length <= 0 || !recoveryCode" class="page">
					<div class="step">
						<ShadingIcon icon="download" />
						<h3><Icon name="counter_1" />安装验证器程序</h3>
						<p>如果你已安装验证器程序，请跳过本步骤。</p>
						<p>如果没有，你需要在你的私人设备中安装一个支持 TOTP 算法的验证器程序，例如 <a href="https://ente.io/auth/" target="_blank">Ente Auth</a>、<a href="https://www.microsoft.com/security/mobile-authenticator-app" target="_blank">Microsoft Authenticator</a> 或 <a href="https://support.google.com/accounts/answer/1066447" target="_blank">Google Authenticator</a>.</p>
					</div>
					<div class="step">
						<ShadingIcon icon="qr_code_scanner" />
						<h3><Icon name="counter_2" />使用验证器程序扫描下方二维码</h3>
						<div class="totp-qrcode-box">
							<QrcodeVue v-if="otpAuth" :value="otpAuth" :level="totpQrcodeLevel" :renderAs="totpQrcodeRenderAs" :size="totpQrcodeSize" />
						</div>
					</div>
					<div class="step">
						<ShadingIcon icon="edit" />
						<h3><Icon name="counter_3" />填写验证码</h3>
						<p>扫描二维码后，你的验证器程序中应该会出现一个新的验证码。<a href="https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-Cerasus/issues" target="_blank">遇到问题？</a></p>
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
				<div v-else class="page">
					<div class="step">
						<ShadingIcon icon="lock_reset" />
						<h3><Icon name="counter_4" />保存备份码和恢复码</h3>
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

		<!-- TODO: 使用多语言 -->
		<Modal v-model="showDeleteTotpModel" title="删除 TOTP 身份验证器" icon="delete">
			<div class="delete-totp-modal">
				<form>
					<TextBox v-model="deleteTotpPassword" :required="true" type="password" icon="lock" :placeholder="t.password" autoComplete="current-password" />
					<TextBox v-model="deleteTotpVerificationCode" :required="true" type="text" icon="lock" placeholder="TOTP 验证码" />
				</form>
			</div>
			<template #footer-right>
				<Button class="secondary" :disabled="isDeletingTotp" @click="closeDeleteTotpModel">{{ t.step.cancel }}</Button>
				<Button @click="deleteTotpByVerification" :disabled="isDeletingTotp" :loading="isDeletingTotp">{{ t.delete }}</Button>
			</template>
		</Modal>

		<!-- TODO: 使用多语言 -->
		<Modal v-model="showCreateEmail2FAModel" title="确认开启邮箱验证" icon="lock">
			<div>
				<p>你注册时使用的邮箱是{{ t.colon + selfUserInfoStore.userEmail }}</p>
				<p>请确保该邮箱仍在使用。</p>
			</div>
			<template #footer-right>
				<Button class="secondary" :disabled="isCreatingEmail2FA" @click="closeCreateEmail2FAModel">{{ t.step.cancel }}</Button>
				<!-- TODO: 使用多语言 -->
				<Button @click="createEmail2FA" :disabled="isCreatingEmail2FA" :loading="isCreatingEmail2FA">开启邮箱验证</Button>
			</template>
		</Modal>

		<!-- TODO: 使用多语言 -->
		<Modal v-model="showDeleteEmail2FAModel" title="确认关闭邮箱验证" icon="delete">
			<div class="delete-email-2fa-modal">
				<form>
					<TextBox v-model="deleteEmail2FAPassword" :required="true" type="password" icon="lock" :placeholder="t.password" autoComplete="current-password" />
					<SendVerificationCode v-model="deleteEmail2FAVerificationCode" verificationCodeFor="delete-email-2fa" />
				</form>
			</div>
			<template #footer-right>
				<Button class="secondary" :disabled="isDeletingEmail2FA" @click="closeDeleteEmail2FAModel">{{ t.step.cancel }}</Button>
				<!-- TODO: 使用多语言 -->
				<Button @click="deleteEmail2FAByVerification" :disabled="isDeletingEmail2FA" :loading="isDeletingEmail2FA">关闭邮箱验证</Button>
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
		gap: 8px;
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

		.page {
			display: flex;
			flex-direction: column;
			gap: 8px;

			.totp-qrcode-box {
				@include round-small;
				@include chip-shadow;
				display: inline-flex;
				justify-content: center;
				align-items: center;
				width: 150px;
				height: 150px;
				padding: 8px;
				background-color: white;

				> svg {
					@include square(100%);
				}
			}

			.totp-confirm-form {
				margin-top: 8px;
			}

			.step {
				@include chip-shadow;
				@include round-large;
				position: relative;
				padding: 16px;
				overflow: clip;
				background-color: c(surface-color);

				.shading-icon {
					position: absolute;
					z-index: unset;
				}

				> *:not(h3) {
					margin-left: 32px;
				}
			}

			h3 {
				display: flex;
				gap: 8px;
				align-items: center;
				margin-bottom: 6px;

				.icon {
					color: c(accent);
					font-size: 24px;
				}
			}

			pre {
				@include round-small;
				display: flex;
				align-items: center;
				height: 36px;
				margin-top: 4px;
				padding: 0 12px;
				background-color: c(gray-10);
				cursor: text;

				code {
					display: block;
					width: 100%;
					user-select: text;
				}
			}
		}
	}

	.delete-totp-modal {
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

	.delete-email-2fa-modal {
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
