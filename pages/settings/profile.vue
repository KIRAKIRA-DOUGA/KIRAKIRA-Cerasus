<script setup lang="ts">
	const banner = "static/images/banner-20220717.png";

	// const avatar = "/static/images/avatars/aira.webp";
	const selfUserInfoStore = useSelfUserInfoStore();
	const appSettingsStore = useAppSettingsStore();

	const newAvatar = ref<string>(); // 新上传的头像
	const correctAvatar = computed(() => newAvatar.value ?? selfUserInfoStore.userInfo.avatar); // 正确显示的头像（如果用户没有新上传头像，则使用全局变量中的旧头像）
	const userAvatarUploadFile = ref<string | undefined>(); // 用户上传的头像文件 Blob
	const isAvatarCropperOpen = ref(false); // 用户头像图片裁剪器是否开启
	const newAvatarImageBlob = ref<Blob>(); // 用户裁剪后的头像
	const userAvatarFileInput = ref<HTMLInputElement>(); // 隐藏的图片上传 Input 元素
	const isUpdateUserInfo = ref<boolean>(false); // 是否正在上传用户信息
	const isResetUserInfo = ref<boolean>(false); // 是否正在重置用户信息
	const profile = reactive({
		name: selfUserInfoStore.userInfo.username?.normalize() ?? "",
		nickname: selfUserInfoStore.userInfo.userNickname?.normalize() ?? "",
		bio: selfUserInfoStore.userInfo.signature?.normalize() ?? "",
		gender: selfUserInfoStore.userInfo.gender?.normalize() ?? "",
		birthday: (() => {
			try {
				return Temporal.PlainDate.from(selfUserInfoStore.userInfo.userBirthday!);
			} catch {
				return Temporal.Now.plainDateISO().withCalendar("gregory");
			}
		})(),
		tags: selfUserInfoStore.userInfo.label?.map(label => label.labelName?.normalize()) ?? [],
	});
	const cropper = ref<InstanceType<typeof ImageCropper>>(); // 图片裁剪器实例
	const isUploadingUserAvatar = ref(false); // 是否正在上传头像
	const showConfirmResetAlert = ref(false); // 是否显示重置警告框

	/**
	 * 点击头像事件，模拟点击文件上传并唤起文件资源管理器
	 */
	function handleUploadAvatarImage() {
		userAvatarFileInput.value?.click();
	}

	/**
	 * 如果有上传图片，则开启图片裁切器。
	 *
	 * 即：用户选择了本地文件的事件。
	 * @param e - 应为用户上传文件的 `<input>` 元素的 change 事件。
	 */
	async function handleOpenAvatarCropper(e?: Event) {
		e?.stopPropagation();
		const fileInput = e?.target as HTMLInputElement | undefined;
		const image = fileInput?.files?.[0];

		if (image) {
			if (!/\.(a?png|jpe?g|jfif|pjp(eg)?|gif|svg|webp)$/i.test(fileInput.value)) {
				useToast(t.toast.unsupported_image_format, "error");
				console.error("ERROR", t.toast.unsupported_image_format);
				return;
			}

			userAvatarUploadFile.value = await fileToBlob(image);
			isAvatarCropperOpen.value = true;
			fileInput.value = ""; // 读取完用户上传的文件后，需要清空 input，以免用户在下次上传同一个文件时无法触发 change 事件。
		}
	}

	/**
	 * 点击裁剪头像
	 */
	async function handleChangeAvatarImage() {
		isUploadingUserAvatar.value = true;
		try {
			const blobImageData = await cropper.value?.getCropBlobData();
			if (blobImageData) {
				const imageBlobUrl = URL.createObjectURL(blobImageData);
				newAvatar.value = imageBlobUrl;
				newAvatarImageBlob.value = blobImageData;
			} else
				useToast(t.toast.something_went_wrong, "error", 5000);
		} catch (error) {
			useToast(t.toast.something_went_wrong, "error", 5000);
			console.error("ERROR", "Failed to update avatar.", error);
		}
		isUploadingUserAvatar.value = false;
		isAvatarCropperOpen.value = false;
	}

	/**
	 * 修改头像事件，向服务器提交新的图片。
	 */
	async function handleSubmitAvatarImage() {
		try {
			const blobImageData = newAvatarImageBlob.value;
			if (blobImageData) {
				const userAvatarUploadSignedUrlResult = await api.user.getUserAvatarUploadSignedUrl();
				const userAvatarUploadSignedUrl = userAvatarUploadSignedUrlResult.userAvatarUploadSignedUrl;
				const userAvatarUploadFilename = userAvatarUploadSignedUrlResult.userAvatarFilename;
				if (userAvatarUploadSignedUrlResult.success && userAvatarUploadSignedUrl && userAvatarUploadFilename) {
					const uploadResult = await api.user.uploadUserAvatar(userAvatarUploadFilename, blobImageData, userAvatarUploadSignedUrl);
					if (uploadResult) {
						newAvatar.value = userAvatarUploadFilename;
						clearBlobUrl(); // 释放内存
					}
				}
			} else {
				useToast(t.toast.something_went_wrong, "error");
				console.error("ERROR", "Failed to get cropped image data.");
			}
		} catch (error) {
			useToast(t.toast.avatar_upload_failed, "error");
			console.error("ERROR", "Failed to upload avatar.", error);
		}
	}

	/**
	 * 根据 cookie 中的 uid 和 token 来获取用户信息。
	 *
	 * 同时具有验证用户 token 的功能。
	 */
	async function getSelfUserInfoController() {
		try {
			const headerCookie = useRequestHeaders(["cookie"]);
			await api.user.getSelfUserInfo({ getSelfUserInfoRequest: undefined, appSettingsStore, selfUserInfoStore, headerCookie });
		} catch (error) {
			console.error("无法获取用户信息，请尝试重新登录", error);
		}
	}

	/**
	 * 清除已经上传完成的图片，释放内存。
	 */
	function clearBlobUrl() {
		if (userAvatarUploadFile.value) {
			URL.revokeObjectURL(userAvatarUploadFile.value);
			userAvatarUploadFile.value = undefined;
		}
	}

	/**
	 * Update the user profile.
	 */
	async function updateProfile() {
		isUpdateUserInfo.value = true;
		if (newAvatarImageBlob.value)
			try {
				await handleSubmitAvatarImage();
			} catch (error) {
				useToast(t.toast.avatar_upload_failed, "error");
				console.error("ERROR", "Failed to upload avatar.", error);
			}

		const updateOrCreateUserInfoRequest: UpdateOrCreateUserInfoRequestDto = {
			avatar: correctAvatar.value,
			username: profile.name.normalize(),
			userNickname: profile.nickname.normalize(),
			signature: profile.bio.normalize(),
			gender: profile.gender.normalize(),
			userBirthday: profile.birthday.toString(),
			label: profile.tags?.map((tag, index) => ({ id: index, labelName: tag.normalize() })),
		};
		try {
			const updateOrCreateUserInfoResult = await api.user.updateOrCreateUserInfo(updateOrCreateUserInfoRequest);
			if (updateOrCreateUserInfoResult.success) {
				await api.user.getSelfUserInfo({ getSelfUserInfoRequest: undefined, appSettingsStore, selfUserInfoStore, headerCookie: undefined });
				isUpdateUserInfo.value = false;
				newAvatarImageBlob.value = undefined;
				useToast(t.toast.profile_updated, "success");
			} else {
				isUpdateUserInfo.value = false;
				useToast(t.toast.something_went_wrong, "error");
			}
		} catch (error) {
			isUpdateUserInfo.value = false;
			useToast(t.toast.something_went_wrong, "error");
			console.error("Failed to update profile.", error);
		}
	}

	/**
	 * 弹出确认重置的警告框
	 */
	function resetConfirm() {
		showConfirmResetAlert.value = true;
	}

	/**
	 * reset all user info.
	 * 重置用户设置
	 * 请求旧用户信息，并修改 Pinia 中的用户数据，然后触发上方的监听
	 */
	async function reset() {
		isResetUserInfo.value = true;
		const updateOrCreateUserInfoRequest: UpdateOrCreateUserInfoRequestDto = {
			avatar: "",
			userNickname: "",
			signature: "",
			gender: "",
			userBirthday: undefined,
			label: [],
		};
		try {
			const updateOrCreateUserInfoResult = await api.user.updateOrCreateUserInfo(updateOrCreateUserInfoRequest);
			if (updateOrCreateUserInfoResult.success) {
				await api.user.getSelfUserInfo({ getSelfUserInfoRequest: undefined, appSettingsStore, selfUserInfoStore, headerCookie: undefined });
				isResetUserInfo.value = false;
				showConfirmResetAlert.value = false;
			} else {
				isResetUserInfo.value = false;
				useToast(t.toast.something_went_wrong, "error");
			}
		} catch (error) {
			isResetUserInfo.value = false;
			useToast(t.toast.something_went_wrong, "error");
			console.error("Failed to reset profile.", error);
		}
	}

	/**
	 * 将 Pinia 中的用户数据拷贝到当前组件的响应式变量 "profile" 中
	 */
	function copyPiniaUserInfoToProfile() {
		profile.name = selfUserInfoStore.userInfo.username?.normalize() ?? "";
		profile.nickname = selfUserInfoStore.userInfo.userNickname?.normalize() ?? "";
		profile.bio = selfUserInfoStore.userInfo.signature?.normalize() ?? "";
		profile.gender = selfUserInfoStore.userInfo.gender?.normalize() ?? "";
		profile.tags = selfUserInfoStore.userInfo.label?.map(label => label.labelName?.normalize()) ?? [];
	}

	useEventListener(userAvatarFileInput, "change", handleOpenAvatarCropper); // 监听头像文件变化事件

	onMounted(async () => await getSelfUserInfoController());
	onBeforeUnmount(clearBlobUrl); // 释放内存
	watch(selfUserInfoStore, copyPiniaUserInfoToProfile); // 监听 Pinia 中的用户数据，一定发生改变，则拷贝到当前组件的响应式变量 "profile" 中
	useListen("user:login", async loginStatus => { // 发生用户登录事件，请求最新用户信息，并修改 Pinia 中的用户数据，然后触发上方的监听
		if (loginStatus)
			await getSelfUserInfoController();
	});
</script>

<template>
	<div>
		<Alert v-model="showConfirmResetAlert" static>
			{{ t.confirm.reset_profile }}
			<template #footer-left>
				<Button @click="reset" :loading="isResetUserInfo" :disabled="isUpdateUserInfo || isResetUserInfo">{{ t.step.ok }}</Button>
			</template>
			<template #footer-right>
				<Button @click="showConfirmResetAlert = false" class="secondary">{{ t.step.cancel }}</Button>
			</template>
		</Alert>

		<Modal v-model="isAvatarCropperOpen" :title="t.profile.edit_avatar">
			<div class="avatar-cropper">
				<ImageCropper
					ref="cropper"
					:image="userAvatarUploadFile"
					:fixed="true"
					:fixedNumber="[1, 1]"
					:full="true"
					:centerBox="true"
					:infoTrue="true"
					:mode="'contain '"
				/>
			</div>
			<template #footer-right>
				<Button class="secondary" @click="isAvatarCropperOpen = false">{{ t.step.cancel }}</Button>
				<Button :loading="isUploadingUserAvatar" @click="handleChangeAvatarImage">{{ t.step.ok }}</Button>
			</template>
		</Modal>

		<div v-ripple class="banner">
			<NuxtImg :src="banner" alt="banner" draggable="false" format="avif" />
			<span>{{ t.profile.edit_banner }}</span>
		</div>

		<div class="change-avatar" @click="handleUploadAvatarImage">
			<UserAvatar :avatar="correctAvatar" hoverable />
			<span>{{ t.profile.edit_avatar }}</span>
			<input ref="userAvatarFileInput" type="file" accept="image/*" hidden />
		</div>

		<div class="items">
			<SettingsUserProfile v-model="profile" />
		</div>

		<div class="submit">
			<Button icon="delete" class="secondary" @click="resetConfirm" :disabled="isUpdateUserInfo || isResetUserInfo">{{ t.step.reset }}</Button>
			<Button icon="check" @click="updateProfile" :loading="isUpdateUserInfo" :disabled="isUpdateUserInfo || isResetUserInfo">{{ t.step.save }}</Button>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.banner {
		@include round-large;
		position: relative;
		overflow: clip;
		background-color: c(gray-5);

		> img {
			z-index: 1;
			width: 100%;
			height: 150px;
			object-fit: cover;
			cursor: pointer;

			&:any-hover {
				scale: 105%;
				filter: brightness(0.75) blur(2px);

				& + span {
					opacity: 1;
				}
			}

			&:not(:any-hover) {
				transition-duration: 1s;
			}
		}

		span {
			position: absolute;
			right: 0;
			bottom: 0;
			z-index: 5;
			margin: 1rem;
			color: white;
			opacity: 0;
			pointer-events: none;
		}
	}

	.change-avatar {
		z-index: 5;
		display: flex;
		gap: 0.75rem;
		align-items: flex-end;
		margin: -48px 0 12px 24px;
		color: c(icon-color);
		pointer-events: none;

		.user-avatar {
			--size: 64px;
			pointer-events: auto;

			&:any-hover + span {
				opacity: 1;
			}
		}

		span {
			margin-bottom: 0.5rem;
			opacity: 0;
			pointer-events: none;
		}
	}

	.items {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.avatar-cropper {
		@include square(350px, true);

		@media (width <= 450px) {
			--size: 80dvw;
			// 对于图片切割器，不建议使用响应式，因为切割器内部被切割的图片不会随之改变尺寸，但考虑到极端小尺寸的适配问题，且在上传图片时浏览器宽度发生剧烈变化的概率较小，故保留本功能。
		}
	}
</style>
