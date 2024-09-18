<docs>
	# 封禁用户
</docs>

<script setup lang="ts">
	const selfUserInfoStore = useSelfUserInfoStore();
	const isAdmin = computed(() => selfUserInfoStore.role === "admin");

	const showBlockUserAlert = ref(false);
	const isOpeningBlockUserAlert = ref(false);
	const criminalUid = ref();
	const criminalUserInfo = ref<GetUserInfoByUidResponseDto["result"]>();
	const isBlockingUser = ref(false);

	const blockedUser = ref<GetBlockedUserResponseDto>();

	/**
	 * 开启封锁用户的警告框
	 */
	async function openBlockUserAlert() {
		const uid = parseInt(criminalUid.value, 10);
		if (criminalUid.value === null || criminalUid.value === undefined || uid < 0) {
			useToast("未正确输入 UID", "error", 5000);
			return;
		}
		isOpeningBlockUserAlert.value = true;
		const getUserInfoByUidRequest: GetUserInfoByUidRequestDto = {
			uid,
		};
		const criminalUserInfoResult = await api.user.getUserInfo(getUserInfoByUidRequest);
		if (criminalUserInfoResult.success && criminalUserInfoResult.result) {
			criminalUserInfo.value = criminalUserInfoResult.result;
			showBlockUserAlert.value = true;
		} else
			useToast("无法获取目标用户数据，请检查 UID 是否正确", "error", 5000);
		isOpeningBlockUserAlert.value = false;
	}

	/**
	 * 封锁一个用户
	 */
	async function blockUser() {
		const uid = parseInt(criminalUid.value, 10);
		if (criminalUid.value === null || criminalUid.value === undefined || uid < 0) {
			useToast("未正确输入 UID", "error", 5000);
			return;
		}
		isBlockingUser.value = true;
		const blockUserByUIDRequest: BlockUserByUIDRequestDto = {
			criminalUid: uid,
		};
		const blockUserByUIDResult = await api.user.blockUserByUID(blockUserByUIDRequest);
		if (blockUserByUIDResult.success) {
			showBlockUserAlert.value = false;
			criminalUid.value = undefined;
			await getBlockedUser();
			useToast("用户已封禁", "success");
		} else
			useToast("无法封禁目标用户，请检查 UID 是否正确", "error", 5000);
		isBlockingUser.value = false;
	}

	/**
	 * 根据 UID 重新激活一个用户
	 * @param uid 要重新激活的用户的 UID
	 */
	async function reactivateUserByUID(uid: number) {
		const reactivateUserByUIDRequest: ReactivateUserByUIDRequestDto = {
			uid,
		};
		const reactivateUserByUIDResult = await api.user.reactivateUserByUID(reactivateUserByUIDRequest);
		if (reactivateUserByUIDResult.success) {
			useToast("重新激活成功", "success");
			await getBlockedUser();
		}
	}

	/**
	 * 获取已封禁用户
	 */
	async function getBlockedUser() {
		const headerCookie = useRequestHeaders(["cookie"]);
		blockedUser.value = await api.user.getBlockedUser(headerCookie);
	}

	await getBlockedUser();

	definePageMeta(
		{
			middleware: [
				(to: unknown) => {
					// WARN: 此处需要重新创建 Store
					const selfUserInfoStore = useSelfUserInfoStore();
					if (selfUserInfoStore.role !== "admin")
						return navigate("/settings/appearance");

					if (to && typeof to === "object" && "path" in to && to.path !== "/settings/user-block")
						return navigate("/settings/user-block");
				},
			],
		},
	);
</script>

<template>
	<div>
		<Alert v-model="showBlockUserAlert" static>
			<h4>确定要封禁这个用户吗？</h4>
			<div class="block-user-display">
				<div class="user">
					<UserAvatar :avatar="criminalUserInfo?.avatar" />
					<div class="texts">
						<div class="names">
							<span class="username">{{ criminalUserInfo?.username }}</span> <span v-if="criminalUserInfo?.userNickname">/{{ criminalUserInfo?.userNickname }}</span>
							<!-- <span v-if="memoParen" class="memo" :class="[memoParen]">{{ user?.bio }}</span> -->
							<span class="icons">
								<Icon v-if="criminalUserInfo?.gender === 'male'" name="male" class="male" />
								<Icon v-else-if="criminalUserInfo?.gender === 'female'" name="female" class="female" />
								<span v-else class="other-gender">{{ criminalUserInfo?.gender }}</span>
							</span>
						</div>
						<div class="bio">{{ criminalUserInfo?.signature }}</div>
					</div>
				</div>
			</div>
			<template #footer-left>
				<Button @click="blockUser" :loading="isBlockingUser" :disabled="isBlockingUser">确认封禁</Button>
			</template>
			<template #footer-right>
				<Button @click="showBlockUserAlert = false" class="secondary">取消</Button>
			</template>
		</Alert>

		<div class="block-user">
			<div class="input">
				<!-- TODO: 使用多语言 -->
				<TextBox
					type="number"
					v-model="criminalUid"
					placeholder="封禁用户"
					size="large"
					icon="person"
				/>
				<!-- TODO: 使用多语言 -->
				<span>输入要封禁的用户的 UID，例如 UID114 只需输入数字 114 即可。</span>
			</div>
			<Button @click="openBlockUserAlert" :disabled="!isAdmin || isOpeningBlockUserAlert" :loading="isOpeningBlockUserAlert">封禁用户</Button>
		</div>

		<!-- TODO: 使用多语言 -->
		<Subheader icon="block">已封禁用户</Subheader>
		<section>
			<SettingsChipItem
				v-for="user in blockedUser?.result"
				:key="user?.username"
				:image="user?.avatar"
				:details="`UID: ${user.uid} Name: ${user?.username}`"
				trailingIcon="close"
				@trailingIconClick="() => reactivateUserByUID(user.uid)"
			>{{ user?.signature }}</SettingsChipItem>
		</section>
	</div>
</template>

<style scoped lang="scss">
	.text-box {
		--size: large;
	}

	.block-user {
		display: flex;
		gap: 8px;
		align-items: flex-start;

		.input {
			display: flex;

			flex: 1;
			flex-direction: column;
			gap: 8px;

			span {
				color: c(icon-color);
				font-size: 12px;
				text-align: right;
			}
		}

		button {
			margin-top: 3px;
		}
	}

	.block-user-display {
		height: 60px;

		.user {
			display: flex;
			gap: 16px;
			align-items: center;
			margin-top: 20px;

			.names {
				display: flex;
				font-size: 24px;

				> * {
					flex-shrink: 0;
					user-select: text;
				}

				.username {
					color: c(text-color);
					font-weight: bold;

					+ .icons {
						margin-left: 10px;
					}
				}

				.memo {
					color: c(icon-color);

					&.fullwidth {
						&::before {
							content: "（";
						}

						&::after {
							content: "）";
						}
					}

					&.halfwidth {
						&::before {
							content: "\a0(";
						}

						&::after {
							content: ")\a0";
						}
					}
				}

				.icons {
					@include flex-center;

					.male {
						color: c(blue);
					}

					.female {
						color: c(pink);
					}

					.other-gender {
						background: linear-gradient(to right, #58c8f2, #eda4b2);
						background-clip: text;
						-webkit-text-fill-color: transparent;
					}
				}
			}

			.bio {
				margin-top: 6px;
				color: c(icon-color);
				user-select: text;
			}
		}
	}
</style>
