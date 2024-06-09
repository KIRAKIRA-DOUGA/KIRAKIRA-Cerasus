<docs>
	# 通知浮窗
</docs>

<script setup lang="ts">
	const flyout = defineModel<FlyoutModel>();
	type PageType = "reply" | "mention" | "system";
	const currentPage = ref<PageType>("reply");
	const pages: { name: string; id: PageType; icon: DeclaredIcons }[] = [
		{ name: t.reply, id: "reply", icon: "reply" },
		{ name: t.mention, id: "mention", icon: "at" },
	];
	const transitionName = ref("page-jump");
</script>

<template>
	<Flyout v-model="flyout" noPadding>
		<Comp>
			<div class="content">
				<TabBar v-model="currentPage" @movingForTransition="name => transitionName = name">
					<TabItem v-for="page in pages" :key="page.id" :id="page.id" :icon="page.icon">{{ page.name }}</TabItem>
				</TabBar>
				<div class="page-wrapper">
					<Transition :name="transitionName" mode="out-in">
						<div v-if="currentPage === 'reply'">
							<FlyoutNotificationItem name="哇" username="wow" :uid="8" :date="new Date()" quote="阿斯顿法国红酒快乐阿斯顿法国红酒快乐阿斯顿法国红酒快乐阿斯顿法国红酒快乐">自行车VB你们🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲🚲</FlyoutNotificationItem>
						</div>
						<div v-else-if="currentPage === 'mention'">
							<FlyoutNotificationItem name="啊" username="ahh" :uid="8" :date="new Date()">感谢<a class="link lite">@被提及的人</a>制作的新设计！</FlyoutNotificationItem>
						</div>
					</Transition>
				</div>
			</div>
		</Comp>
	</Flyout>
</template>

<style scoped lang="scss">
	$title-bar-height: 48px;

	:comp {
		display: flex;
		flex-direction: column;
		width: 500px;
		min-height: 400px;

		.tab-bar {
			--full: true;
			padding: 8px;
		}

		.content {
			display: flex;
			flex-direction: column;
		}

		.page-wrapper {
			flex-grow: 1;
			padding: 16px;
			padding-top: 0;
		}
	}
</style>
