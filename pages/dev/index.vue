<script setup lang="ts">
	useHead({ title: t.development_test_page });

	type Page = { name: string; link: string };

	/**
	 * 获取页面列表。
	 * @param pages - 页面数组。
	 * @returns 页面对象。
	 */
	function getPages(...pages: [string, string][]): Page[];
	/**
	 * 获取页面列表。
	 * @param httpCodes - HTTP 代码数组。
	 * @returns 页面对象。
	 */
	function getPages(...httpCodes: number[]): Page[];
	/**
	 * 获取页面列表。
	 * @param pages - 页面数组。
	 * @returns 页面对象。
	 */
	function getPages(...pages: ([string, string] | number)[]): Page[] {
		return pages.map(page => (typeof page === "number" ? { name: String(page), link: String(page) } :
			{ name: page[0], link: page[1] }) as Page);
	}

	const pages = getPages(
		["组件测试页", "/dev/components"],
		["富文本测试页", "/dev/test-rich-text-editor"],
		["动态图标测试页", "/dev/test-lottie"],
		["字体测试页", "/dev/test-font"],
		["滑块测试页", "/dev/test-slider"],
		["颜色测试页", "/dev/test-color"],
		["指针类型检测", "/dev/pointer-type"],
		["示例视频", "/video/kvtest"],
		["kv1", "/video/kv1"],
		["kv3", "/video/kv3"], // FIXME: 以路由形式进入不存在的页面不会跳转到对应的 404 或 301 等错误页面，以新窗口打开时则正常。
		["示例音频", "/audio"],
		["示例相簿", "/photo"],
		["搜索", "/search"],
		["投稿", "/upload"],
		["稿件编辑", "/upload/edit"],
		["个人主页", "/user"],
		["uid2", "/user/2"],
		["uid3000", "/user/3000"], // FIXME: 以路由形式进入不存在的页面不会跳转到对应的 404 或 301 等错误页面，以新窗口打开时则正常。
		["首次登录欢迎页", "/welcome"],
		["内容", "/hello"],
		["下一页", "/next"],
	);

	const httpCodes = getPages(
		233,
		301,
		404,
		500,
		502,
		503,
		601,
	);
</script>

<template>
	<div class="container">
		<Subheader icon="science" :badge="233">测试</Subheader>
		<div class="pages">
			<LocaleLink v-for="page in pages" :key="page.name" class="link lite" :to="page.link">{{ page.name }}</LocaleLink>
		</div>
		<Subheader icon="error" :badge="233">错误页</Subheader>
		<div class="pages">
			<a v-for="page in httpCodes" :key="page.name" class="link lite" :href="'/error/' + page.link">{{ page.name }}</a>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.container {
		padding-top: 0 !important;

		> * {
			margin: 26px 0;
		}
	}

	%tabulation {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.pages {
		@extend %tabulation;

		.link {
			@include round-small;
			padding: 7px 16px;
			background-color: c(accent-10);

			&:hover {
				opacity: 0.75;
			}

			&:focus {
				@include button-shadow-focus;
			}

			.dark & {
				color: c(icon-color);
			}
		}
	}
</style>
