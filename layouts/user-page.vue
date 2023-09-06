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
	import { Users200Response } from "kirakira-backend";

	// TODO nice copy pasta dude
	const uid = currentUserUid();
	const user = ref<Users200Response>();

	const data = reactive({
		uid,
	});

	/** fetch the user profile data */
	async function fetchData() {
		const api = useApi();
		try {
			user.value = await api.users(uid);
		} catch (error) { console.error(error); }
	}
	watch(data, fetchData, { deep: true });
	await fetchData();

	const isSelf = ref(false); // 是否为登录用户本人。

	const actionMenu = ref<FlyoutModel>();
	const fullwidthRegexp = /[⺀-ㄯ㆐-ㇿ㈠-㉇㊀-㊰㋀-㋋㋐-㍰㍻-㍿㏠-㏾㐀-䶿一-鿿豈-龎︐-︙︰-﹫！-｠￠-￦𚿰-𛅧𠀀-𲎯]/u;
	// 验证是否是加上全宽括弧而不是半宽括弧，条件是包含至少一个非谚文的全宽字符。
	const memoParen = computed(() => {
		const memo = user.value?.bio ?? "";
		return !memo.trim() ? "" :
			fullwidthRegexp.exec(memo) ? "fullwidth" : "halfwidth";
	});
	const currentTab = computed({
		get: () => currentUserTab(),
		set: async id => { await forceNavigate(`/user/${uid}/${id}`, () => currentTab.value === id); },
	});

	useHead({ title: user.value?.username + t.user_page.title_suffix });
</script>

<template>
	<header class="user-center">
		<div>
			<div class="content">
				<div class="user">
					<UserAvatar />
					<div class="texts">
						<div class="names">
							<span class="username">{{ user?.username }}</span>
							<span v-if="memoParen" class="memo" :class="[memoParen]">{{ user?.bio }}</span>
							<span class="icons">
								<Icon v-if="user?.gender === 'male'" name="male" class="male" />
								<Icon v-else-if="user?.gender === 'female'" name="female" class="female" />
								<span v-else class="other-gender">{{ user?.gender }}</span>
							</span>
						</div>
						<div class="bio">{{ user?.bio }}</div>
					</div>
				</div>
				<div class="actions">
					<!-- <SoftButton v-tooltip:top="'私信'" icon="email" /> -->
					<SoftButton v-tooltip:top="t.more" icon="more_vert" @click="e => actionMenu = [e, 'y']" />
					<Menu v-model="actionMenu">
						<MenuItem icon="badge">{{ t.modify_memo }}</MenuItem>
						<MenuItem icon="groups">{{ t.add_to_group }}</MenuItem>
						<hr />
						<MenuItem v-tooltip:x="'老铁们，给我举报他！'" icon="flag">{{ t.report }}</MenuItem>
						<MenuItem icon="block">{{ t.add_to_blocklist }}</MenuItem>
					</Menu>
					<div v-if="!isSelf" class="follow-button">
						<Button v-if="true">{{ t.follow }}</Button>
						<!-- TODO: !user.isFollowed -->
						<Button v-else disabled>{{ t.following }}</Button>
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
	$padding-x: 100px;
	$padding-x-narrow: 40px;
	$header-height: 134px;
	$main-margin-top: 32px;

	header {
		@include card-shadow;
		position: sticky;
		top: 0;
		z-index: 4;
		padding: 0 $padding-x;
		background-color: c(main-bg);
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
	}

	header:deep ~ .user-center-slot > .container {
		display: flex;
		gap: 20px;
		align-items: flex-start;
		padding: $main-margin-top $padding-x;

		@include tablet {
			flex-direction: column-reverse;

			.toolbox-card {
				width: 100%;
			}
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

	@include tablet {
		header,
		main {
			padding-right: $padding-x-narrow;
			padding-left: $padding-x-narrow;
		}
	}
</style>
