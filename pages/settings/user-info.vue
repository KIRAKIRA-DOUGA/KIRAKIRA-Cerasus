<docs>
	# 用户信息管理
</docs>

<script setup lang="ts">
	const selfUserInfoStore = useSelfUserInfoStore();
	const isAdmin = computed(() => selfUserInfoStore.role === "admin");

	const isOnlyShowUserInfoUpdatedAfterReview = ref(false); // 是否只展示在上一次审核通过后修改了用户信息的用户
	const users = ref<AdminGetUserInfoResponseDto>(); // 用户信息
	const isLoadingUserInfo = ref(false); // 是否正在加载用户信息
	const pageSize = 20; // 每页数量
	const pageCount = computed(() => Math.max(1, Math.ceil(users.value?.totalCount ? users.value.totalCount / pageSize : 0))); // 总页数

	const currentPageRef = ref(1);
	const currentPage = computed({ // 当前页数
		get() {
			return currentPageRef.value;
		},
		set(page: number) {
			if (!isLoadingUserInfo.value) // TODO: 当正在加载用户数据时，不能更换页码，即同一时间只允许有一个请求。
				currentPageRef.value = page;
			else
				useToast("数据加载中，请稍等。", "warning", 5000);
		},
	});

	const isOpeningClearUserInfoAlert = ref(false);
	const showClearUserInfoAlert = ref(false);
	const isClearingUserInfo = ref(false);
	const clearedUid = ref();
	const clearedUserInfo = ref<GetUserInfoByUidResponseDto["result"]>();

	const disableCurrentPageEffect = ref(false); // 是否禁用 currentPage 的 watch 副作用被执行

	/**
	 * 管理员获取用户信息
	 */
	async function adminGetUserInfo() {
		isLoadingUserInfo.value = true;
		try {
			const headerCookie = useRequestHeaders(["cookie"]);
			const adminGetUserInfoResult = await api.user.adminGetUserInfo(isOnlyShowUserInfoUpdatedAfterReview.value, currentPage.value, pageSize, headerCookie);
			if (adminGetUserInfoResult.success)
				users.value = adminGetUserInfoResult;
			else {
				useToast("获取用户信息失败", "error", 5000);
				!!users.value && (users.value = { ...users.value, result: [] });
			}
		} catch (error) {
			useToast("获取用户信息失败，网络请求失败", "error", 5000);
			!!users.value && (users.value = { ...users.value, result: [] });
		}
		isLoadingUserInfo.value = false;
	}

	/**
	 * 管理员通过用户信息审核
	 * @param UUID 用户 UUID
	 */
	async function approveUserInfo(UUID: string) {
		const approveUserInfoRequest: ApproveUserInfoRequestDto = {
			UUID,
		};
		const approveUserInfoResult = await api.user.approveUserInfo(approveUserInfoRequest);
		if (approveUserInfoResult.success) {
			await adminGetUserInfo();
			useToast("审核通过！", "success");
		}
	}

	/**
	 * 打开清理用户信息警告框
	 */
	async function openClearUserInfoAlert() {
		const uid = clearedUid.value;
		if (uid === undefined || uid === null || uid <= 0) {
			useToast("用户 UID 不合法", "error");
			return;
		}
		isOpeningClearUserInfoAlert.value = true;
		const getUserInfoByUidRequest: GetUserInfoByUidRequestDto = {
			uid,
		};
		const clearedUserInfoResult = await api.user.getUserInfo(getUserInfoByUidRequest);
		if (clearedUserInfoResult.success && clearedUserInfoResult.result) {
			clearedUserInfo.value = clearedUserInfoResult.result;
			showClearUserInfoAlert.value = true;
		} else
			useToast("无法获取目标用户数据，请检查 UID 是否正确", "error", 5000);
		isOpeningClearUserInfoAlert.value = false;
	}

	/**
	 * 管理员清空某个用户的信息
	 */
	async function clearUserInfo() {
		const uid = clearedUid.value;
		if (uid === undefined || uid === null || uid <= 0) {
			useToast("用户 UID 不合法", "error");
			return;
		}
		isClearingUserInfo.value = true;
		const adminClearUserInfoRequest: AdminClearUserInfoRequestDto = {
			uid: parseInt(uid, 10),
		};
		const adminClearUserInfoResult = await api.user.adminClearUserInfo(adminClearUserInfoRequest);
		if (adminClearUserInfoResult.success) {
			showClearUserInfoAlert.value = false;
			clearedUid.value = undefined;
			await adminGetUserInfo();
			useToast("用户信息已清理", "success");
		} else
			useToast("无法清理目标用户信息，请检查 UID 是否正确", "error", 5000);
		isClearingUserInfo.value = false;
	}

	watch(isOnlyShowUserInfoUpdatedAfterReview, async () => {
		disableCurrentPageEffect.value = true; // 阻止 currentPage 的 watch 副作用被执行
		currentPage.value = 1;
		await adminGetUserInfo();
		disableCurrentPageEffect.value = false; // 阻止 currentPage 的 watch 副作用被执行
	});
	watch(currentPage, async () => {
		!disableCurrentPageEffect.value && await adminGetUserInfo(); // disableCurrentPageEffect 的值为假才执行
	});

	await adminGetUserInfo();

	definePageMeta(
		{
			middleware: [
				(to: unknown) => {
					// WARN: 此处需要重新创建 Store
					const selfUserInfoStore = useSelfUserInfoStore();
					if (selfUserInfoStore.role !== "admin")
						return navigate("/settings/appearance");

					if (to && typeof to === "object" && "path" in to && to.path !== "/settings/user-info")
						return navigate("/settings/user-info");
				},
			],
		},
	);
</script>

<template>
	<div>
		<!-- TODO: 使用多语言 -->
		<!-- WARN: 该页面需要多语言支持 -->
		<!-- TODO: 使用多语言 -->

		<Alert v-model="showClearUserInfoAlert" static>
			<h4>确定要清除这个用户的信息吗？</h4>
			<p>该用户的用户名、昵称、头像、签名、性别、用户 TAG 和 生日等用户信息将会被清空。</p>
			<p>被清空的用户将会使用 UUID 作为用户名。</p>
			<p>如果该用户的 UUID 被占用，则无法清空，请联系开发组解决。</p>
			<div class="clear-user-display">
				<div class="user">
					<UserAvatar :avatar="clearedUserInfo?.avatar" />
					<div class="texts">
						<div class="names">
							<span class="username">{{ clearedUserInfo?.username }}</span> <span v-if="clearedUserInfo?.userNickname">/{{ clearedUserInfo?.userNickname }}</span>
							<!-- <span v-if="memoParen" class="memo" :class="[memoParen]">{{ user?.bio }}</span> -->
							<span class="icons">
								<Icon v-if="clearedUserInfo?.gender === 'male'" name="male" class="male" />
								<Icon v-else-if="clearedUserInfo?.gender === 'female'" name="female" class="female" />
								<span v-else class="other-gender">{{ clearedUserInfo?.gender }}</span>
							</span>
						</div>
						<div class="bio">{{ clearedUserInfo?.signature }}</div>
					</div>
				</div>
			</div>
			<template #footer-left>
				<Button @click="clearUserInfo" :loading="isClearingUserInfo" :disabled="isClearingUserInfo">确认清空</Button>
			</template>
			<template #footer-right>
				<Button @click="showClearUserInfoAlert = false" class="secondary">取消</Button>
			</template>
		</Alert>

		<InfoBar type="info" title="提示">
			先改后审：用户修改信息立即公开展示给他人。
			<br />
			你可以开启“只展示新注册和更新了用户信息的待审核用户”选项来审核用户信息。
			<br />
			被封禁的用户不能修改自己的信息，但封禁用户并不能同时删除用户已有信息，请使用本页面中的 “清空用户信息” 功能。
		</InfoBar>

		<Subheader icon="placeholder">清空用户信息</Subheader>
		<div class="clear-user" v-if="isAdmin">
			<div class="input">
				<TextBox
					type="number"
					v-model="clearedUid"
					placeholder="清除用户信息"
					size="large"
					icon="person"
				/>
				<span>输入要清空信息的目标用户 UID，例如 UID114 只需输入数字 114 即可。</span>
			</div>
			<Button @click="openClearUserInfoAlert" :disabled="!isAdmin || isOpeningClearUserInfoAlert" :loading="isOpeningClearUserInfoAlert">清空用户信息</Button>
		</div>

		<Subheader icon="account_circle" v-if="isOnlyShowUserInfoUpdatedAfterReview">待审核用户</Subheader>
		<Subheader icon="account_circle" v-else>全部用户</Subheader>
		<section list>
			<ToggleSwitch v-model="isOnlyShowUserInfoUpdatedAfterReview" icon="visibility">只展示新注册和更新了用户信息的待审核用户</ToggleSwitch>
		</section>

		<Pagination v-model="currentPage" :pages="pageCount" :displayPageCount="7" />

		<section v-if="isAdmin && !isLoadingUserInfo && !isOnlyShowUserInfoUpdatedAfterReview">
			<SettingsChipItem
				v-for="user in users?.result"
				:key="user.uid"
				:image="user.avatar"
				icon="account_circle"
				:details="`UID ${user.uid}, UUID ${user.UUID}` + (user.signature?.trim() ? ` - ${user.signature}` : '')"
				trailingIcon="open_in_new"
				:href="`/user/${user.uid}`"
			>
				<div class="name">
					<span class="nickname">{{ user.userNickname }}</span>
					<span class="username">@{{ user.username }}</span>
					<div class="icons">
						<Icon v-if="user.gender === 'male' " name="male" class="male" />
						<Icon v-else-if="user.gender === 'female'" name="female" class="female" />
						<Icon v-if="user.role === 'admin' " name="build_circle" class="admin" />
					</div>
				</div>
			</SettingsChipItem>
		</section>

		<section v-if="isAdmin && !isLoadingUserInfo && isOnlyShowUserInfoUpdatedAfterReview">
			<SettingsChipItem
				v-for="user in users?.result"
				:key="user.uid"
				:image="user.avatar"
				icon="account_circle"
				:details="`UID ${user.uid}, UUID ${user.UUID}` + (user.signature?.trim() ? ` - ${user.signature}` : '')"
				trailingIcon="check"
				@trailingIconClick="() => approveUserInfo(user.UUID)"
			>
				<div class="name">
					<span class="nickname">{{ user.userNickname }}</span>
					<span class="username">@{{ user.username }}</span>
					<div class="icons">
						<Icon v-if="user.gender === 'male' " name="male" class="male" />
						<Icon v-else-if="user.gender === 'female'" name="female" class="female" />
						<Icon v-if="user.role === 'admin' " name="build_circle" class="admin" />
					</div>
				</div>
			</SettingsChipItem>
		</section>
	</div>
</template>

<style scoped lang="scss">
	.text-box {
		--size: large;
	}

	.clear-user {
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

	.name {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;

		.nickname {
			@include hide-if-empty;
			font-weight: bold;
		}

		.username {
			color: c(icon-color);
		}

		.icons {
			@include flex-center;

			.male {
				color: c(blue);
			}

			.female {
				color: c(pink);
			}

			.admin {
				color: c(red);
			}
		}
	}
</style>
