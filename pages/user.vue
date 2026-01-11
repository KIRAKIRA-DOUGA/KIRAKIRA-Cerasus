<script lang="ts">
	export const tabs = [
		{ id: "", icon: "home" }, // 首页，Markdown自我介绍放在顶部（类似GitHub），下方为显示用户发布的所有内容，类似于「关注（/feed/following）」页面
		{ id: "videos", name: "video", icon: "movie" }, // 视频
		// { id: "series", icon: "video_library" }, // 系列
		// { id: "posts", name: "post", icon: "post" }, // 帖子
		// { id: "audios", icon: "music" }, // 音频
		// { id: "albums", icon: "photo_library" }, // 相簿或者相册，类似QQ空间相册，所有帖子配图默认也会放在这里，相簿名称可以直接叫「帖子」。
		{ id: "collections", name: "collection.title", icon: "star" },
	];
</script>

<script setup lang="ts">
	definePageMeta({
		pageTransition: {
			name: "page-jump-in",
			mode: "out-in",
		},
		async middleware(to, from) {
			const { tabs } = await import("./user.vue");
			if (to.meta.pageTransition && typeof to.meta.pageTransition !== "boolean") {
				const [path, prevPath] = [removeI18nPrefix(to.path), removeI18nPrefix(from.path)];
				if (path.startsWith("/user/") && prevPath.startsWith("/user/")) {
					const [tab, prevTab] = [path.split("/")[3], prevPath.split("/")[3]];
					const [index, prevIndex] = [tabs.findIndex(i => i.id === tab), tabs.findIndex(i => i.id === prevTab)];
					if (index !== prevIndex)
						to.meta.pageTransition.name = index > prevIndex ? "right" : index < prevIndex ? "left" : "";
				} else
					to.meta.pageTransition.name = "page-jump-in";
			}
		},
	});

	const { t } = useI18n();
	const selfUserInfoStore = useSelfUserInfoStore();

	const headerCookie = useRequestHeaders(["cookie"]);
	await api.user.getSelfUserInfo({ getSelfUserInfoRequest: undefined, appSettingsStore: useAppSettingsStore(), selfUserInfoStore, headerCookie });

	const isSelf = ref(false); // 当前页面是否是自己
	const isFollowing = ref(false); // 当前页面中的用户是否已经关注
	const userInfo = ref<GetUserInfoByUidResponseDto>(); // 用户信息（并非自己的用户信息）
	const actionMenu = ref<FlyoutModel>();
	const currentTab = computed(() => currentUserTab());

	const urlUid = ref(); // URL 中的 UID
	urlUid.value = currentUserUid(); // SSR
	const nuxtApp = useNuxtApp();
	nuxtApp.hook("page:finish", () => {
		urlUid.value = currentUserUid(); // CSR
	});

	const selfUid = computed(() => selfUserInfoStore.userInfo.uid); // 自己的 UID（如果已经登陆）

	/**
	 * 屏蔽一个用户
	 */
	async function blockUser() {
		try {
			const blockUid = urlUid.value;

			if (blockUid === undefined || blockUid === null || blockUid < 1) {
				console.error("ERROR", "屏蔽用户的 UID 格式不正确，不能为空或小于零");
				// TODO: 使用多语言
				useToast("屏蔽用户的 UID 格式不正确", "error", 5000);
				return;
			}

			if (selfUserInfoStore.userInfo.uid === blockUid) {
				console.error("ERROR", "不能屏蔽自己");
				// TODO: 使用多语言
				useToast("不能屏蔽自己", "error", 5000);
				return;
			}

			const blockUserByUidRequest: BlockUserByUidRequestDto = {
				blockUid,
			};
			const blockUserResult = await api.block.blockUserController(blockUserByUidRequest);
			if (blockUserResult.success) {
				// TODO: 使用多语言
				useToast("屏蔽用户成功", "success");
				navigate("/");
			} else {
				console.error("ERROR", "屏蔽用户失败");
				// TODO: 使用多语言
				useToast("屏蔽用户失败", "error", 5000);
			}
		} catch (error) {
			console.error("ERROR", "屏蔽用户时出错", error);
			// TODO: 使用多语言
			useToast("屏蔽用户时出错", "error", 5000);
		}
	}

	/**
	 * fetch user profile data
	 */
	async function fetchUserData() {
		if (urlUid.value === selfUserInfoStore.userInfo.uid)
			isSelf.value = true;
		else {
			isSelf.value = false;
			const getUserInfoByUidRequest: GetUserInfoByUidRequestDto = {
				uid: urlUid.value,
			};
			const headerCookie = useRequestHeaders(["cookie"]);
			const userInfoResult = await api.user.getUserInfo(getUserInfoByUidRequest, headerCookie);
			if (!userInfoResult.success)
				useToast("获取用户信息失败", "error", 5000); // TODO: 使用多语言

			if (userInfoResult.isBlocked)
				navigateToErrorPage(404);

			isFollowing.value = !!userInfoResult.result?.isFollowing;
			userInfo.value = userInfoResult;
		}
	}

	await fetchUserData();
	watch(() => [urlUid.value, selfUid.value], fetchUserData);

	// 提供一个刷新关注统计的函数，供子组件调用
	const refreshFollowStats = ref<(() => void) | undefined>();
	provide("refreshFollowStats", refreshFollowStats);

	const titleUserNickname = computed(() => isSelf.value ? selfUserInfoStore.userInfo.userNickname ? t("user_page.title_affix", [selfUserInfoStore.userInfo.userNickname]) : "" : userInfo.value?.result?.userNickname ? t("user_page.title_affix", [userInfo.value?.result?.userNickname]) : "");
	useHead({ title: titleUserNickname });
</script>

<template>
	<div>
		<header>
			<div>
				<div class="content">
					<UserContent
						:avatar="isSelf ? selfUserInfoStore.userInfo.avatar : userInfo?.result?.avatar"
						:username="isSelf ? selfUserInfoStore.userInfo.username : userInfo?.result?.username"
						:nickname="isSelf ? selfUserInfoStore.userInfo.userNickname : userInfo?.result?.userNickname"
						:gender="isSelf ? selfUserInfoStore.userInfo.gender : userInfo?.result?.gender"
						:roles="isSelf ? selfUserInfoStore.userInfo.roles : userInfo?.result?.roles"
						size="huge"
						avatarFullWidth
					>
						{{ isSelf ? selfUserInfoStore.userInfo.signature : userInfo?.result?.signature }}
						<template #actionButtons>
							<div class="actions">
								<!-- <SoftButton v-tooltip:top="'私信'" icon="email" /> -->
								<SoftButton
									v-if="!isSelf"
									v-tooltip:top="$t('more')"
									icon="more_vert"
									@click="e => actionMenu = [e, 'y']"
								/>
								<Menu v-if="!isSelf" v-model="actionMenu">
									<MenuItem icon="groups">{{ $t("add_to_group") }}</MenuItem>
									<MenuItem icon="badge">{{ $t("modify_memo") }}</MenuItem>
									<hr />
									<MenuItem icon="flag">{{ $t("report") }}</MenuItem>
									<MenuItem icon="block" @click="blockUser">{{ $t("block_user") }}</MenuItem>
								</Menu>
								<FollowButton v-if="!isSelf" :uid="urlUid" :isFollowing />
								<SoftButton v-if="isSelf" href="/settings/profile" icon="edit" />
							</div>
						</template>
					</UserContent>
				</div>
				<TabBar v-model="currentTab">
					<TabItem v-for="tab in tabs" :id="tab.id" :key="tab.id" :icon="tab.icon" :to="`/user/${urlUid}/${tab.id}`">{{ $t(tab.name || "home", 2) }}</TabItem>
				</TabBar>
			</div>
		</header>
		<div v-if="!userInfo?.isBlocked" class="slot">
			<NuxtPage />
		</div>
	</div>
</template>

<style scoped lang="scss">
	$header-height: 134px;
	$main-margin-top: 32px;

	header {
		@include card-shadow;
		// position: sticky;
		// top: 0;
		// z-index: 4;
		padding: 0 $page-padding-x;
		background-color: c(surface-color);

		@include tablet {
			padding: 0 $page-padding-x-tablet;
		}

		@include mobile {
			padding: 0 $page-padding-x-mobile;
		}
	}

	.content {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		justify-content: space-between;
		align-items: start;
		padding: 24px 0;

		.actions {
			display: flex;
			gap: 16px;
			justify-content: end;
			align-items: center;
			margin-left: auto;

			.soft-button {
				--ripple-size: var(--wrapper-size);
			}
		}

		.user-content {
			flex-grow: 1;
		}
	}

	.tab-bar {
		--clipped: true;
		--loose: true;
		--size: big;
		margin: 0 (-$page-padding-x);

		&:deep(.items) {
			padding: 0 $page-padding-x;
		}
	}

	.slot:deep(.container) {
		display: flex;
		gap: 20px;
		align-items: start;
		padding: $main-margin-top $page-padding-x;

		@include tablet {
			flex-direction: column-reverse;
			padding: $page-padding-x-tablet;

			.toolbox-card {
				width: 100%;
			}
		}

		@include mobile {
			padding: $page-padding-x-mobile;
		}

		> .left,
		> .right {
			flex-shrink: 0;

			@include computer {
				position: sticky;
				top: $header-height + $main-margin-top;
			}
		}

		> .center {
			width: 100%;
		}

		&:has(> .center):has(> .left):has(> .right) {
			@media (width < 1280px) {
				flex-direction: column;

				.toolbox-card {
					width: 100%;
				}

				> .left,
				> .right {
					position: static;
				}

				> .right {
					order: 1;
				}

				> .center {
					order: 2;
				}
			}
		}

		.sort {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	header,
	main {
		@include tablet {
			padding: 0 $page-padding-x-tablet;

			.tab-bar {
				margin: 0 (-$page-padding-x-tablet);

				&:deep(.items) {
					padding: 0 $page-padding-x-tablet;
				}
			}
		}

		@include mobile {
			padding: 0 $page-padding-x-mobile;

			.tab-bar {
				margin: 0 (-$page-padding-x-mobile);

				&:deep(.items) {
					padding: 0 calc($page-padding-x-mobile / 2);
				}
			}
		}
	}
</style>
