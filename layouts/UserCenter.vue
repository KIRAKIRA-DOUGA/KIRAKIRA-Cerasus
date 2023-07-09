<script setup lang="ts">
	import users from "helpers/users";

	const uid = currentUserUid();
	if (!users[uid]) navigate("/error/404");
	const user = users[uid] ?? {};

	const actionMenu = ref<MenuModel>();
	const fullwidthRegexp = /[⺀-ㄯ㆐-ㇿ㈠-㉇㊀-㊰㋀-㋋㋐-㍰㍻-㍿㏠-㏾㐀-䶿一-鿿豈-龎︐-︙︰-﹫！-｠￠-￦𚿰-𛅧𠀀-𲎯]/u;
	// 验证是否是加上全宽括弧而不是半宽括弧，条件是包含至少一个非谚文的全宽字符。
	const memoParen = computed(() => {
		const memo = user.memo ?? "";
		return !memo.trim() ? "" :
			fullwidthRegexp.exec(memo) ? "fullwidth" : "halfwidth";
	});
	const tabs = [
		{ id: "", icon: "home" },
		{ id: "series", icon: "video_library" },
		{ id: "video", icon: "movie" },
		{ id: "audio", icon: "music" },
		{ id: "photo", icon: "photo_library" },
		{ id: "favorites", icon: "star" },
	];
	const currentTab = computed({
		get: () => currentUserTab(),
		set: id => navigate(`/user/${uid}/${id}`),
	});

	useHead({ title: user.username + "的个人中心" });
</script>

<template>
	<header class="user-center">
		<div>
			<div class="content">
				<div class="user">
					<UserAvatar />
					<div class="texts">
						<div class="names">
							<span class="username">{{ user.username }}</span>
							<span v-if="memoParen" class="memo" :class="[memoParen]">{{ user.memo }}</span>
							<span class="icons">
								<Icon v-if="user.gender === 'male'" name="male" class="male" />
								<Icon v-else-if="user.gender === 'female'" name="female" class="female" />
								<span v-else class="other-gender">{{ user.gender }}</span>
							</span>
						</div>
						<div class="signature">{{ user.signature }}</div>
					</div>
				</div>
				<div class="actions">
					<SoftButton v-tooltip:top="'私信'" icon="email" />
					<SoftButton v-tooltip:top="'老铁们，给我举报他！'" icon="more_vert" @click="e => actionMenu = e" />
					<Menu v-model="actionMenu">
						<MenuItem icon="flag">举报</MenuItem>
						<MenuItem icon="block">加入黑名单</MenuItem>
					</Menu>
					<Button v-if="!user.isFollowed">关注</Button>
					<Button v-else disabled>已关注</Button>
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
						background: linear-gradient(90deg, #58c8f2, #eda4b2);
						background-clip: text;
						-webkit-text-fill-color: transparent;
					}
				}
			}

			.signature {
				margin-top: 6px;
				color: c(icon-color);
				user-select: text;
			}
		}
		
		.actions {
			display: flex;
			gap: 16px;
			justify-content: flex-end;
			margin-left: auto;
		}
	}

	.tab-bar {
		--clipped: true;
		--loose: true;
		padding-bottom: 9px;
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
		
		> :not(.center) {
			flex-shrink: 0;
			
			@include computer {
				position: sticky;
				top: $header-height + $main-margin-top;
			}
		}
		
		> .center {
			width: 100%;
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
