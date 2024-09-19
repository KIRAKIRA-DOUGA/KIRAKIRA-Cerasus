<script setup lang="ts">
	const banner = "static/images/banner-20220717.png";

	// const avatar = "/static/images/avatars/aira.webp";
	const selfUserInfoStore = useSelfUserInfoStore();

	const newAvatar = ref<string>(); // 新上传的头像
	const correctAvatar = computed(() => newAvatar.value ?? selfUserInfoStore.userAvatar); // 正确显示的头像（如果用户没有新上传头像，则使用全局变量中的旧头像）
	const userAvatarUploadFile = ref<string | undefined>(); // 用户上传的头像文件 Blob
	const isAvatarCropperOpen = ref(false); // 用户头像图片裁剪器是否开启
	const newAvatarImageBlob = ref<Blob>(); // 用户裁剪后的头像
	const userAvatarFileInput = ref<HTMLInputElement>(); // 隐藏的图片上传 Input 元素
	const isUpdateUserInfo = ref<boolean>(false); // 是否正在上传用户信息
	const isResetUserInfo = ref<boolean>(false); // 是否正在重置用户信息
	const profile = reactive({
		name: selfUserInfoStore.username,
		nickname: selfUserInfoStore.userNickname,
		bio: selfUserInfoStore.signature,
		gender: selfUserInfoStore.gender,
		birthday: new Date(), // TODO: 日期选择器 // FIXME: 注意：这个值是静态的、非响应式的，不会随时间变化
		tags: selfUserInfoStore.tags,
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
	function handleOpenAvatarCropper(e?: Event) {
		e?.stopPropagation();
		const fileInput = e?.target as HTMLInputElement | undefined;
		const image = fileInput?.files?.[0];

		if (image) {
			if (!/\.(a?png|jpe?g|jfif|pjp(eg)?|gif|svg|webp)$/i.test(fileInput.value)) {
				useToast("只能上传图片文件！", "error"); // TODO: 使用多语言
				console.error("ERROR", "不支持所选头像图片格式！");
				return;
			}

			userAvatarUploadFile.value = fileToBlob(image);
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
				useToast("裁剪头像失败，请刷新页面后重试", "error", 5000); // TODO: 使用多语言
		} catch (error) {
			useToast("修改头像失败，请刷新页面后重试", "error", 5000); // TODO: 使用多语言
			console.error("ERROR", "修改头像失败", error);
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
				useToast("无法获取裁切后的图片！", "error"); // TODO: 使用多语言
				console.error("ERROR", "无法获取裁切后的图片");
			}
		} catch (error) {
			useToast("头像上传失败！", "error"); // TODO: 使用多语言
			console.error("ERROR", "在上传用户头像时出错", error);
		}
	}

	/**
	 * 根据 cookie 中的 uid 和 token 来获取用户信息。
	 *
	 * 同时具有验证用户 token 的功能。
	 */
	async function getUserInfo() {
		try {
			await api.user.getSelfUserInfo();
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
				useToast("头像上传失败！", "error"); // TODO: 使用多语言
				console.error("ERROR", "在上传用户头像时出错", error);
			}

		const updateOrCreateUserInfoRequest: UpdateOrCreateUserInfoRequestDto = {
			avatar: correctAvatar.value,
			username: profile.name,
			userNickname: profile.nickname,
			signature: profile.bio,
			gender: profile.gender,
			userBirthday: new Date().getTime(), // TODO: 日期选择器 // FIXME: 注意：这个值是静态的、非响应式的，不会随时间变化
			label: profile.tags.map((tag, index) => ({ id: index, labelName: tag })),
		};
		try {
			const updateOrCreateUserInfoResult = await api.user.updateOrCreateUserInfo(updateOrCreateUserInfoRequest);
			if (updateOrCreateUserInfoResult.success) {
				await api.user.getSelfUserInfo();
				isUpdateUserInfo.value = false;
				newAvatarImageBlob.value = undefined;
				useToast("用户信息已更新！", "success"); // TODO: 使用多语言
			} else {
				isUpdateUserInfo.value = false;
				useToast("用户信息更新失败！", "error"); // TODO: 使用多语言
			}
		} catch (error) {
			isUpdateUserInfo.value = false;
			useToast("用户信息更新失败！", "error"); // TODO: 使用多语言
			console.error("用户信息更新失败！", error);
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
				await api.user.getSelfUserInfo();
				isResetUserInfo.value = false;
				showConfirmResetAlert.value = false;
			} else {
				isResetUserInfo.value = false;
				useToast("未能清空用户信息！", "error"); // TODO: 使用多语言
			}
		} catch (error) {
			isResetUserInfo.value = false;
			useToast("未能清空用户信息！", "error"); // TODO: 使用多语言
			console.error("未能清空用户信息！", error);
		}
	}

	/**
	 * 将 Pinia 中的用户数据拷贝到当前组件的响应式变量 "profile" 中
	 */
	function copyPiniaUserInfo2Profile() {
		profile.name = selfUserInfoStore.username;
		profile.nickname = selfUserInfoStore.userNickname;
		profile.bio = selfUserInfoStore.signature;
		profile.gender = selfUserInfoStore.gender;
		profile.tags = selfUserInfoStore.tags;
	}

	useEventListener(userAvatarFileInput, "change", handleOpenAvatarCropper); // 监听头像文件变化事件
	onMounted(async () => { await api.user.getSelfUserInfo(); });
	onBeforeUnmount(clearBlobUrl); // 释放内存
	watch(selfUserInfoStore, copyPiniaUserInfo2Profile); // 监听 Pinia 中的用户数据，一定发生改变，则拷贝到当前组件的响应式变量 "profile" 中
	useListen("user:login", async loginStatus => { // 发生用户登录事件，请求最新用户信息，并修改 Pinia 中的用户数据，然后触发上方的监听
		if (loginStatus)
			await api.user.getSelfUserInfo();
	});
</script>

<template>
	<div>
		<Alert v-model="showConfirmResetAlert" static>
			<!-- TODO: 使用多语言 -->
			确定要重置用户信息设置吗？
			<template #footer-left>
				<!-- TODO: 使用多语言 -->
				<Button @click="reset" :loading="isResetUserInfo" :disabled="isUpdateUserInfo || isResetUserInfo">确认</Button>
			</template>
			<template #footer-right>
				<!-- TODO: 使用多语言 -->
				<Button @click="showConfirmResetAlert = false" class="secondary">取消</Button>
			</template>
		</Alert>

		<!-- TODO: 使用多语言 -->
		<Modal v-model="isAvatarCropperOpen" title="更新头像">
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
				<!-- TODO: 使用多语言 -->
				<Button class="secondary" @click="isAvatarCropperOpen = false">取消</Button>
				<!-- TODO: 使用多语言 -->
				<Button :loading="isUploadingUserAvatar" @click="handleChangeAvatarImage">更新头像</Button>
			</template>
		</Modal>

		<div v-ripple class="banner">
			<NuxtImg :src="banner" alt="banner" draggable="false" format="avif" placeholder />
			<span>{{ t.profile.edit_banner }}</span>
		</div>

		<div class="change-avatar" @click="handleUploadAvatarImage">
			<UserAvatar :avatar="correctAvatar" />
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

		>img {
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
