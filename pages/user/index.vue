<script setup lang="ts">
	import testVideo from "assets/images/cav5-cover.png";

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

	const page = ref(1);
	const pages = ref(99);
	const displayPageCount = ref(6);
	const sort = ref<SortModel>(["date", "descending"]);

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
	
	<main>
		<div class="toolbox-card center">
			<div class="videos">
				<ThumbVideo
					v-for="i in 20"
					:key="i"
					link="video"
					uploader="艾了个拉"
					:image="testVideo"
					:date="new Date()"
					:watchedCount="233_0000"
					:duration="new Duration(2, 33)"
				>测试视频</ThumbVideo>
			</div>
		</div>
		
		<div class="toolbox-card right">
			<Subheader icon="sort">排序</Subheader>
			<Sort v-model="sort">
				<SortItem id="date" preferOrder="descending">投稿日期</SortItem>
				<SortItem id="play" preferOrder="descending">播放数</SortItem>
				<SortItem id="danmaku" preferOrder="descending">弹幕数</SortItem>
				<SortItem id="comment" preferOrder="descending">评论数</SortItem>
				<SortItem id="star" preferOrder="descending">收藏数</SortItem>
				<SortItem id="duration">视频时长</SortItem>
			</Sort>
			<Pagination v-model="page" :pages="pages" :displayPageCount="displayPageCount" enableArrowKeyMove />
		</div>
	</main>
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
			margin-left: auto;
		}
	}

	.tab-bar {
		--clipped: true;
		--loose: true;
		padding-bottom: 9px;
	}
	
	main {
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
		
		.videos {
			// display: grid;
			// grid-gap: 1rem;
			// grid-template-columns: repeat(auto-fill, 226px);
			// justify-content: space-between;
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
