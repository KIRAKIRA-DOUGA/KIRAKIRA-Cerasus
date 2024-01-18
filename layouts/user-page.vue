<script lang="ts">
	export const tabs = [
		{ id: "", icon: "home" },
		{ id: "series", icon: "video_library" },
		{ id: "video", icon: "movie" },
		{ id: "audio", icon: "music" },
		{ id: "photo", icon: "photo_library" },
		{ id: "favorites", icon: "star" },
	];

	export const userTabs = tabs.map(tab => tab.id);
</script>

<script setup lang="ts">
	import makeFullwidth from "pomsky/fullwidth.pom";

	const userSelfInfoStore = useSelfUserInfoStore();

	const isSelf = ref(false); // TODO: 是否为登录用户本人。
	const isFollowed = ref(false); // TODO
	const actionMenu = ref<FlyoutModel>();
	const userInfo = ref<GetUserInfoByUidResponseDto["result"]>();

	const fullwidthRegexp = makeFullwidth();

	// TODO
	// // 验证是否是加上全宽括弧而不是半宽括弧，条件是包含至少一个非谚文的全宽字符。
	// const memoParen = computed(() => {
	// 	const memo = user.value?.bio ?? "";
	// 	return !memo.trim() ? "" :
	// 		fullwidthRegexp.exec(memo) ? "fullwidth" : "halfwidth";
	// });

	/** fetch the user profile data */
	async function fetchUserData() {
		if (userSelfInfoStore.isLogined && urlUid.value === userSelfInfoStore.uid) {
			isSelf.value = true;
			await api.user.getSelfUserInfo(); // 获取当前登录用户的用户信息
		} else {
			isSelf.value = false;
			const getUserInfoByUidRequest: GetUserInfoByUidRequestDto = {
				uid: urlUid.value,
			};
			const userInfoResult = await api.user.getUserInfo(getUserInfoByUidRequest); // 获取当前 URL 指向的用户的信息
			if (userInfoResult.success)
				userInfo.value = userInfoResult.result;
		}
	}

	const urlUid = computed(currentUserUid);
	watch(urlUid, fetchUserData, { deep: false });

	const selfUid = computed(() => userSelfInfoStore.uid);
	watch(selfUid, fetchUserData, { deep: false });

	await fetchUserData();

	const currentTab = computed({
		get: () => currentUserTab(),
		set: async id => { await navigate(`/user/${urlUid.value}/${id}`); },
	});

	const titleUserName = computed(() => isSelf.value ? (userSelfInfoStore.username ? t.user_page.title_affix(userSelfInfoStore.username) : "") : (userInfo.value?.username ? t.user_page.title_affix(userInfo.value?.username) : ""));

	// const titleUserName = computed(() => isSelf.value ? "aaa" : "bbb");

	useHead({ title: titleUserName });
</script>

<template>
	<header class="user-center">
		<div>
			<div class="content">
				<div class="user">
					<UserAvatar :avatar="isSelf ? (userSelfInfoStore.userAvatar) : userInfo?.avatar" />
					<div class="texts">
						<div class="names">
							<span class="username">{{ isSelf ? userSelfInfoStore.username : userInfo?.username }}</span>
							<!-- <span v-if="memoParen" class="memo" :class="[memoParen]">{{ user?.bio }}</span> -->
							<span class="icons">
								<Icon v-if="isSelf ? userSelfInfoStore.gender === 'male' : userInfo?.gender === 'male'" name="male" class="male" />
								<Icon v-else-if="isSelf ? userSelfInfoStore.gender === 'female' : userInfo?.gender === 'female'" name="female" class="female" />
								<span v-else class="other-gender">{{ isSelf ? userSelfInfoStore.gender : userInfo?.gender }}</span>
							</span>
						</div>
						<div class="bio">{{ isSelf ? userSelfInfoStore.signature : userInfo?.signature }}</div>
					</div>
				</div>
				<div class="actions">
					<!-- <SoftButton v-tooltip:top="'私信'" icon="email" /> -->
					<SoftButton v-if="!isSelf" v-tooltip:top="t.more" icon="more_vert" @click="e => actionMenu = [e, 'y']" />
					<Menu v-if="!isSelf" v-model="actionMenu">
						<MenuItem icon="badge">{{ t.modify_memo }}</MenuItem>
						<MenuItem icon="groups">{{ t.add_to_group }}</MenuItem>
						<hr />
						<MenuItem v-tooltip:x="'老铁们，给我举报他！'" icon="flag">{{ t.report }}</MenuItem>
						<MenuItem icon="block">{{ t.add_to_blocklist }}</MenuItem>
					</Menu>
					<div v-if="!isSelf" class="follow-button">
						<Button v-if="!isFollowed" icon="add" @click="isFollowed = true">{{ t.follow_verb }}</Button>
						<!-- TODO: !user.isFollowed -->
						<Button v-else icon="check" @click="isFollowed = false">{{ t.following }}</Button>
					</div>
					<Button v-if="isSelf">{{ t.manage_content }}</Button>
				</div>
			</div>
			<TabBar v-model="currentTab">
				<TabItem v-for="tab in tabs" :id="tab.id" :key="tab.id" :icon="tab.icon">{{ t[tab.id || "home"] }}</TabItem>
			</TabBar>
		</div>
	</header>
</template>

<style scoped lang="scss">
	$padding-x: 5%;
	$padding-x-tablet: 24px;
	$padding-x-mobile: 16px;
	$header-height: 134px;
	$main-margin-top: 32px;

	header {
		@include card-shadow;
		position: sticky;
		top: 0;
		z-index: 4;
		padding: 0 $padding-x;
		background-color: c(main-bg);

		@include tablet {
			padding: 0 $padding-x-tablet;
		}

		@include mobile {
			padding: 0 $padding-x-mobile;
		}
	}

	.content {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		align-items: center;
		justify-content: space-between;
		padding: 24px 0;

		.user {
			display: flex;
			gap: 10px;
			align-items: center;

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

		.actions {
			display: flex;
			gap: 16px;
			align-items: center;
			justify-content: flex-end;
			margin-left: auto;
		}
	}

	.tab-bar {
		--clipped: true;
		--loose: true;
		--size: big;
		margin-right: -$padding-x;
		margin-left: -$padding-x;

		&:deep(.items) {
			padding-left: $padding-x;
		}
	}

	header:deep ~ .user-center-slot > .container {
		display: flex;
		gap: 20px;
		align-items: flex-start;
		padding: $main-margin-top $padding-x;

		@include tablet {
			flex-direction: column-reverse;
			padding: $padding-x-tablet;

			.toolbox-card {
				width: 100%;
			}
		}

		@include mobile {
			padding: $padding-x-mobile;
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
			padding-right: $padding-x-tablet;
			padding-left: $padding-x-tablet;

			.tab-bar {
				margin-right: -$padding-x-tablet;
				margin-left: -$padding-x-tablet;

				&:deep(.items) {
					padding-right: $padding-x-tablet;
					padding-left: $padding-x-tablet;
				}
			}
		}

		@include mobile {
			padding-right: $padding-x-mobile;
			padding-left: $padding-x-mobile;

			.tab-bar {
				margin-right: -$padding-x-mobile;
				margin-left: -$padding-x-mobile;

				&:deep(.items) {
					padding-right: 0;
					padding-left: 0;
				}
			}
		}
	}
</style>
