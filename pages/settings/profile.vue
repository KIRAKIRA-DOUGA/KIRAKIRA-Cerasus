<script setup lang="ts">
	import banner from "assets/images/banner-20220717.png";

	// const avatar = "/static/images/avatars/aira.webp";
	const selfUserInfoStore = useSelfUserInfoStore();

	const profile = computed(() => ({
		name: selfUserInfoStore.username,
		bio: selfUserInfoStore.signature,
		gender: selfUserInfoStore.gender,
		birthday: new Date(), // FIXME 注意：这个值是静态的、非响应式的，不会随时间变化
		tags: selfUserInfoStore.tags?.map(tag => tag.labelName),
	}));

	const avatarCropperIsOpen = ref(false);
	const handleOpenAvatarCropper = () => {
		avatarCropperIsOpen.value = true;
	};

	const cropper = ref();
	const isUploadingUserAvatar = ref(false);
	const handleSubmitAvatarImage = async () => {
		try {
			isUploadingUserAvatar.value = true;
			const blobImageData = await cropper.value.getCropBlobData() as Blob;
			const userAvatarUploadSignedUrlResult = await api.user.getUserAvatarUploadSignedUrl();
			const userAvatarUploadSignedUrl = userAvatarUploadSignedUrlResult.userAvatarUploadSignedUrl;
			if (userAvatarUploadSignedUrlResult.success && userAvatarUploadSignedUrl) {
				const uploadResult = await api.user.uploadUserAvatar(blobImageData, userAvatarUploadSignedUrl);
				if (uploadResult) {
					await api.user.getSelfUserInfo();
					avatarCropperIsOpen.value = false;
				}
				isUploadingUserAvatar.value = false;
			}
		} catch (error) {
			console.error("ERROR", "在上传用户头像时出错");
			isUploadingUserAvatar.value = false;
		}
	};

	/**
	* 根据 cookie 中的 uid 和 token 来获取用户信息（同时具有验证用户 token 的功能）
	*/
	const getUserInfo = async () => {
		try {
			await api.user.getSelfUserInfo();
		} catch (error) {
			console.error("无法获取用户信息，请尝试重新登录", error);
		}
	};

	useListen("user:login", async loginStatus => {
		if (loginStatus)
			await getUserInfo();
	});

	onMounted(async () => { await getUserInfo(); });

	/**
	 * Update the user profile.
	 */
	async function updateProfile() {
		// const api = useApi();

		// const encodedName = encodeUtf8(profile.name);
		// const encodedGender = encodeUtf8(profile.gender);
		// const encodedBio = encodeUtf8(profile.bio);
		// const handleError = (error: unknown) => error && console.error(error);

		// try {
		// 	await api?.updateProfile(encodedName, encodedGender, profile.birthday.toString(), encodedBio);
		// } catch (error) { handleError(error); }
	}
</script>

<template>
	<Modal v-model="avatarCropperIsOpen">
		<div style="width: 20vw; height: 20vw;">
			<ImageCropper ref="cropper" :fixed="true" :fixedNumber="[1, 1]" />
		</div>
		<template #footer-right>
			<!-- TODO 使用多语言 -->
			<Button class="secondary" @click="avatarCropperIsOpen = false">取消</Button>
			<!-- TODO 使用多语言 -->
			<Button :loading="isUploadingUserAvatar" @click="handleSubmitAvatarImage">更新头像</Button>
		</template>
	</Modal>
	<div v-ripple class="banner">
		<img :src="banner" alt="banner" draggable="false" />
		<span>{{ t.profile.edit_banner }}</span>
	</div>

	<div class="change-avatar" @click="handleOpenAvatarCropper">
		<UserAvatar :avatar="selfUserInfoStore.userAvatar" />
		<span>{{ t.profile.edit_avatar }}</span>
	</div>

	<div class="items">
		<SettingsUserProfile v-model="profile" />
	</div>

	<div class="submit">
		<Button icon="reset" class="secondary">{{ t.step.reset }}</Button>
		<Button icon="check" @click="updateProfile">{{ t.step.save }}</Button>
	</div>
</template>

<style scoped lang="scss">
	.banner {
		@include round-large;
		position: relative;
		overflow: hidden;
		background-color: c(gray-5);

		> img {
			z-index: 1;
			width: 100%;
			height: 150px;
			object-fit: cover;
			cursor: pointer;

			&:any-hover {
				filter: brightness(0.75) blur(2px);
				scale: 105%;

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
</style>
