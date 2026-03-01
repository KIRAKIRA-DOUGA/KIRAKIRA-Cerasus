<docs>
	# 通知浮窗
</docs>

<script setup lang="ts">
	const flyout = defineModel<FlyoutModel>();
	type PageType = "replies" | "mentions" | "notifications" | "messages";
	const currentPage = ref<PageType>("replies");
	const { t } = useI18n();
	const pages: { name: string; id: PageType; icon: DeclaredIcons }[] = [
		{ name: t("reply", 2), id: "replies", icon: "reply" },
		{ name: t("mention", 2), id: "mentions", icon: "at" },
		{ name: t("notification", 2), id: "notifications", icon: "notifications" },
		{ name: t("messages", 2), id: "messages", icon: "chat_bubble" },
	];
	const transitionName = ref("page-jump-in");
	const hideTabBarText = ref(false);
</script>

<template>
	<Flyout v-model="flyout" noPadding>
		<Comp>
			<div class="menu">
				<div class="title-bar">
					<SoftButton icon="dehaze" @click="hideTabBarText = !hideTabBarText" />
				</div>
				<TabBar v-model="currentPage" vertical>
					<TabItem v-for="page in pages" :key="page.id" :id="page.id" :icon="page.icon">{{ page.name }}
					</TabItem>
				</TabBar>
			</div>
			<div class="content">
				<div class="title-bar">
					<p>{{ pages.find(p => p.id === currentPage)?.name }}</p>
					<div class="decoration">
						<span class="color-block" />
						<LogoShadingMessages />
					</div>
				</div>
				<div class="page-wrapper">
					<Transition :name="transitionName" mode="out-in">
						<div v-if="currentPage === 'replies'">
							<FlyoutNotificationItem nickname="哇" username="wow" :uid="8" :date="new Date()" quote="阿斯顿法国红酒快乐阿斯顿法国红酒快乐阿斯顿法国红酒快乐阿斯顿法国红酒快乐">自行车VB你们🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲</FlyoutNotificationItem>
						</div>
						<div v-else-if="currentPage === 'mentions'">
							<FlyoutNotificationItem nickname="啊" username="ahh" :uid="8" :date="new Date()">感谢<a class="link lite">@被提及的人</a>制作的新设计！</FlyoutNotificationItem>
						</div>
						<div v-else-if="currentPage === 'notifications'">
							<FlyoutNotificationItem nickname="啊" username="ahh" :uid="8" :date="new Date()">感谢<a
								class="link lite"
							>@被提及的人</a>制作的新设计！</FlyoutNotificationItem>
						</div>
						<div v-else-if="currentPage === 'messages'">
							<FlyoutNotificationItem nickname="啊" username="ahh" :uid="8" :date="new Date()">感谢<a
								class="link lite"
							>@被提及的人</a>制作的新设计！</FlyoutNotificationItem>
						</div>
					</Transition>
				</div>
			</div>
		</Comp>
	</Flyout>
</template>

<style scoped lang="scss">
	$title-bar-height: 48px;
	$tab-bar-width: 108px;

	:comp {
		container: flyout-notification / inline-size;
		display: flex;
		width: 500px;
		min-height: 400px;

		.tab-bar {
			--full: true;
			min-width: $tab-bar-width;
			padding: 8px;
		}

		.page-wrapper {
			width: calc(100cqw - $tab-bar-width);
			padding-top: 8px;
			padding-right: 8px;
			padding-bottom: 16px;
		}
	}

	.title-bar {
		display: flex;
		align-items: center;
		height: $title-bar-height;

		.soft-button {
			@include square($title-bar-height);
			--ripple-size: #{$title-bar-height};
		}

		p {
			padding-left: 16px;
			color: c(icon-color);
			font-weight: bold;
		}
	}

	.menu .title-bar {
		padding-left: 5px;
	}

	.content .title-bar {
		display: flex;
		justify-content: space-between;
		overflow: clip;

		.decoration {
			display: flex;
			flex-direction: row-reverse;
			align-items: center;
			margin-right: -30px;

			.icon {
				@include square(150px);
				margin-top: 30px;
				margin-right: -48px;
				rotate: 45deg;

				&:deep(path:nth-child(1)) {
					fill: c(accent-20);
				}

				&:deep(path:nth-child(2)) {
					fill: c(accent-30);
				}
			}

			.color-block {
				width: 130px;
				height: 60px;
				margin-right: -15px;
				background-color: c(accent-10);
				rotate: 45deg;
			}
		}
	}
</style>
