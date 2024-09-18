<docs>
	首次登录且没有昵称时、或昵称违规后显示的页面。
</docs>

<script setup lang="ts">
	useHead({ title: "欢迎加入KIRAKIRA☆DOUGA大家庭" });
	const next = useRoute().query.next || "/";
	const container = ref<HTMLDivElement>();

	const profile = reactive({
		name: "",
		nameValid: false,
		nickname: "",
		bio: "",
		gender: "",
		birthday: new Date(),
		tags: [] as string[],
	});
	const isRead = ref(false);
	const showWelcome = ref(false);
	const avatarBlob = ref<string>(); // 头像文件
	const cropper = ref<InstanceType<typeof ImageCropper>>(); // 图片裁剪器实例
	const isAvatarCropperOpen = ref(false); // 用户头像图片裁剪器是否开启
	const isUploadingUserAvatar = ref(false); // 是否正在上传头像
	const userAvatarUploadFile = ref<string | undefined>(); // 用户上传的头像文件 Blob
	const userAvatarFileInput = ref<HTMLInputElement>(); // 隐藏的图片上传 Input 元素
	const isUpdateUserInfo = ref<boolean>(false); // 是否正在上传用户信息
	const validData = computed(() => isRead.value && profile.nameValid && profile.gender);

	/**
	 * 完成注册。
	 */
	async function finish() {
		isUpdateUserInfo.value = true;
		const updateOrCreateUserInfoRequest: UpdateOrCreateUserInfoRequestDto = {
			avatar: avatarBlob.value,
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
			}
		} catch (error) {
			isUpdateUserInfo.value = false;
			useToast("用户信息更新失败！", "error"); // TODO: 使用多语言
			console.error("用户信息更新失败！", error);
		}

		const main = container.value?.parentElement;
		if (main) {
			main.scrollTo({ top: 0, left: 0, behavior: "smooth" });
			await main.animate([{}, { translate: "0 100%", opacity: 0 }], { duration: 600, easing: eases.easeInMax, fill: "forwards" }).finished;
			showWelcome.value = true;
			await delay(1200);
		}
		navigate(next);
	}

	/**
	 * 修改头像事件，向服务器提交新的图片。
	 */
	async function handleSubmitAvatarImage() {
		try {
			isUploadingUserAvatar.value = true;
			const blobImageData = await cropper.value?.getCropBlobData();
			if (blobImageData) {
				const userAvatarUploadSignedUrlResult = await api.user.getUserAvatarUploadSignedUrl();
				const userAvatarUploadSignedUrl = userAvatarUploadSignedUrlResult.userAvatarUploadSignedUrl;
				const userAvatarUploadFilename = userAvatarUploadSignedUrlResult.userAvatarFilename;
				if (userAvatarUploadSignedUrlResult.success && userAvatarUploadSignedUrl && userAvatarUploadFilename) {
					const uploadResult = await api.user.uploadUserAvatar(userAvatarUploadFilename, blobImageData, userAvatarUploadSignedUrl);
					if (uploadResult) {
						avatarBlob.value = userAvatarUploadFilename;
						isAvatarCropperOpen.value = false;
						clearBlobUrl(); // 释放内存
					}
					isUploadingUserAvatar.value = false;
				}
			} else {
				useToast("无法获取裁切后的图片！", "error"); // TODO: 使用多语言
				console.error("ERROR", "无法获取裁切后的图片");
			}
		} catch (error) {
			useToast("头像上传失败！", "error"); // TODO: 使用多语言
			console.error("ERROR", "在上传用户头像时出错", error);
			isUploadingUserAvatar.value = false;
		}
	}

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
	 * 清除已经上传完成的图片，释放内存。
	 */
	function clearBlobUrl() {
		if (userAvatarUploadFile.value) {
			URL.revokeObjectURL(userAvatarUploadFile.value);
			userAvatarUploadFile.value = undefined;
		}
	}

	useEventListener(userAvatarFileInput, "change", handleOpenAvatarCropper); // 监听头像文件变化事件
</script>

<template>
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
			<Button :loading="isUploadingUserAvatar" @click="handleSubmitAvatarImage">更新头像</Button>
		</template>
	</Modal>

	<div class="banner">
		<LogoCover noAnimation noTitle />
		<h1>欢迎加入<LogoText />大家庭</h1>
	</div>
	<div ref="container" class="container">
		<div class="card">
			<div class="card-rectangle"></div>
			<h2>完善个人信息</h2>
			<div class="items">
				<div class="avatar">
					<UserAvatar :avatar="avatarBlob" @click="handleUploadAvatarImage" />
					<span>上传头像</span>
					<input ref="userAvatarFileInput" type="file" accept="image/*" hidden />
				</div>

				<SettingsUserProfile v-model="profile" />

				<Checkbox v-model:single="isRead">我已阅读并同意<PopupWindowLink href="https://otomad.github.io/cssc/license.htm">《KIRAKIRA☆DOUGA用户协议》</PopupWindowLink></Checkbox>

				<Button icon="check" :disabled="!validData || isUpdateUserInfo" :loading="isUpdateUserInfo" @click="finish">开始畅游KIRAKIRA☆DOUGA</Button>
			</div>
		</div>
	</div>
	<ClientOnlyTeleport to="body">
		<div v-if="showWelcome" class="welcome">
			<div class="avatar">
				<UserAvatar :avatar="avatarBlob" />
				<ProgressRing />
			</div>
			<div class="content-wrapper">
				<div v-for="i in 2" :key="i" class="content" :class="{ 'content-visible': i === 2 }">
					<p class="welcome-text">欢迎加入</p>
					<p class="name">{{ profile.name }}</p>
				</div>
			</div>
		</div>
	</ClientOnlyTeleport>
</template>

<style scoped lang="scss">
	.banner {
		--i: 0;
		position: relative;

		.logo-cover {
			--width: 100%;
			--height: 280px;
			--full-logo: true;
			position: absolute;
			top: 0;
			pointer-events: none;
			mask-image: linear-gradient(white, transparent);
		}

		h1 {
			@include flex-center;
			flex-wrap: wrap;
			gap: 16px;
			width: 100%;
			padding: 30px 0;
			font-size: 48px;

			@include tablet {
				zoom: 0.6;
			}

			@include mobile {
				zoom: 0.4;
			}
		}

		.logo-text {
			--form: full;
			zoom: 2.5;
		}
	}

	h1,
	h2 {
		color: c(accent);
	}

	.container {
		--i: 1;
		padding-top: 0;
		padding-bottom: 0;

		h2 {
			font-size: 24px;
		}

		.card {
			position: relative;
			padding: 24px 32px;

			.card-rectangle {
				@include round-large(top);
				@include card-shadow-with-blur;
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100lvh;
				background-color: c(main-bg, 80%);

				~ * {
					position: relative;
				}
			}

			.items {
				display: flex;
				flex-direction: column;
				gap: 20px;
				align-items: stretch;
				margin-top: 24px;

				.avatar {
					display: flex;
					gap: 16px;
					align-items: center;

					span {
						color: c(icon-color);
						font-size: 16px;
					}
				}

				button {
					margin-left: auto;
				}

				.checkbox:deep() {
					padding: 0 14px;

					label {
						margin-left: 13px;
					}
				}
			}
		}
	}

	.banner,
	.container {
		animation: float-up 600ms calc(150ms * var(--i)) $ease-out-smooth backwards;
	}

	.welcome {
		@include flex-center;
		position: fixed;
		inset: 0;
		gap: 30px;
		cursor: progress;

		.avatar {
			position: relative;
			animation: scale-in 600ms $ease-out-back forwards;

			.user-avatar {
				@include square(128px);
				pointer-events: none;
			}

			.progress-ring {
				--size: 128px;
				--thickness: 5px;
				position: absolute;
				top: 0;
				z-index: 2;
				animation: fade-in 500ms 400ms $ease-out-sine backwards;
			}
		}

		.content-wrapper {
			$ease-scaler-or-mover: cubic-bezier(0.3, 0, 0, 1);
			position: relative;
			display: grid;
			grid-template-rows: 1fr;
			grid-template-columns: 0fr;
			animation: avatar-mover 600ms 400ms $ease-scaler-or-mover forwards;

			.content {
				$ease-text-move: cubic-bezier(0.1, 0.5, 0, 1);
				overflow: clip;
				white-space: nowrap;

				&:not(.content-visible) {
					visibility: hidden;
				}

				&.content-visible {
					position: absolute;
					overflow: visible;
				}

				.welcome-text {
					margin-bottom: 10px;
					font-size: 24px;
					animation: name-move 700ms 450ms $ease-text-move both;
				}

				.name {
					font-size: 38px;
					font-weight: bold;
					animation: name-move 700ms 500ms $ease-text-move both;
				}
			}
		}
	}

	@keyframes avatar-mover {
		to {
			grid-template-columns: 1fr;
		}
	}

	@keyframes name-move {
		0% {
			translate: 200px;
			opacity: 0;
		}

		1% {
			translate: 200px;
			opacity: 1;
		}

		100% {
			translate: 0;
			opacity: 1;
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes float-up {
		from {
			translate: 0 2rem;
			opacity: 0;
		}
	}

	.avatar-cropper {
		@include square(350px, true);

		@media (width <= 450px) {
			--size: 80dvw;
			// 对于图片切割器，不建议使用响应式，因为切割器内部被切割的图片不会随之改变尺寸，但考虑到极端小尺寸的适配问题，且在上传图片时浏览器宽度发生剧烈变化的概率较小，故保留本功能。
		}
	}
</style>
