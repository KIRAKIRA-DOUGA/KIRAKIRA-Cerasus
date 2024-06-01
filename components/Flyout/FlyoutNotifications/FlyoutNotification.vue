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
		{ name: t.system, id: "system", icon: "email" },
	];
</script>

<template>
	<Flyout v-model="flyout" noPadding>
		<Comp>
			<div class="content">
				<TabBar v-model="currentPage">
					<TabItem v-for="page in pages" :key="page.id" :id="page.id" :icon="page.icon">{{ page.name }}</TabItem>
				</TabBar>
				<div class="page-wrapper">
					<div class="page-reply">
						<FlyoutNotificationItem />
					</div>
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
