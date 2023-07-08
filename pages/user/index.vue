<script setup lang="ts">
	const username = ref("艾了个拉");
	const memo = ref("艾拉");
	const signature = ref("Kind and Kawaii, Forever!~");
	const gender = ref<"male" | "female" | (string & {})>("female");
	const isFollowed = ref(true);
	const actionMenu = ref<MenuModel>();
	
	const fullwidthRegexp = /[⺀-ㄯ㆐-ㇿ㈠-㉇㊀-㊰㋀-㋋㋐-㍰㍻-㍿㏠-㏾㐀-䶿一-鿿豈-龎︐-︙︰-﹫！-｠￠-￦𚿰-𛅧𠀀-𲎯]/u;
	const nbsp = "\xa0"; // Vue 太蠢，不会自动转换空格。
	// 验证是否是加上全宽括弧而不是半宽括弧，条件是包含至少一个非谚文的全宽字符。
	const memoWithParen = computed(() =>
		!memo.value ? "" : fullwidthRegexp.exec(memo.value) ? `（${memo.value}）` : `${nbsp}(${memo.value})${nbsp}`);
	const tab = ref("home");

	useHead({ title: username.value + "的个人中心" });
</script>

<template>
	<header>
		<div class="content">
			<div class="user">
				<UserAvatar />
				<div class="texts">
					<div class="names">
						<span class="username">{{ username }}</span>
						<span v-if="memo" class="memo">{{ memoWithParen }}</span>
						<span class="icons">
							<Icon v-if="gender === 'male'" name="male" class="male" />
							<Icon v-else-if="gender === 'female'" name="female" class="female" />
							<span v-else class="other-gender">{{ gender }}</span>
						</span>
					</div>
					<div class="signature">{{ signature }}</div>
				</div>
			</div>
			<div class="actions">
				<SoftButton v-tooltip:top="'私信'" icon="email" />
				<SoftButton v-tooltip:top="'老铁们，给我举报他！'" icon="more_vert" @click="e => actionMenu = e" />
				<Menu v-model="actionMenu">
					<MenuItem icon="flag">举报</MenuItem>
					<MenuItem icon="block">加入黑名单</MenuItem>
				</Menu>
				<Button v-if="!isFollowed">关注</Button>
				<Button v-else disabled>已关注</Button>
			</div>
		</div>
		<TabBar v-model="tab">
			<TabItem id="home" icon="home">主页</TabItem>
			<TabItem id="series" icon="video_library">合集</TabItem>
			<TabItem id="video" icon="movie">视频</TabItem>
			<TabItem id="audio" icon="music">音频</TabItem>
			<TabItem id="album" icon="photo_library">相簿</TabItem>
			<TabItem id="favorites" icon="star">收藏</TabItem>
		</TabBar>
	</header>
</template>

<style scoped lang="scss">
	header {
		@include card-shadow;
		padding: 0 100px;
		background-color: c(main-bg);
	}

	.content {
		display: flex;
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

				.username {
					color: c(text-color);
					font-weight: bold;
					
					+ .icons {
						margin-left: 10px;
					}
				}

				.memo {
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
			}
		}
		
		.actions {
			display: flex;
			gap: 16px;
			justify-content: flex-end;
		}
	}

	.tab-bar {
		--clipped: true;
		--loose: true;
		padding-bottom: 9px;
	}
</style>
