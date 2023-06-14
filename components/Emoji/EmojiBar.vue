<script setup lang="ts">
	const props = defineProps<{
		emoji: string[];
	}>();
	const model = defineModel<string>();
	const selectedTab = ref("all");
</script>

<template>
	<div class="emoji-bar">
		<div class="tab">
			<TabBar v-model="selectedTab">
				<TabItem id="happy">{{ t.happy }}</TabItem>
				<TabItem id="hello">{{ t.hello }}</TabItem>
				<TabItem id="cute">{{ t.awa }}</TabItem>
				<TabItem id="sad">{{ t.sad }}</TabItem>
				<TabItem id="embarrassed">{{ t.embarrassed }}</TabItem>
				<Icon name="play" class="play-icon" />
			</TabBar>
		</div>
		<div v-for="n in 5" :key="n" class="col">
			<Button v-for="i in 3" :key="i" class="emoji">
				{{ props.emoji[3 * (n - 1) + (i - 1)] }}
			</Button>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.emoji-bar {
		@include dropdown-flyouts;
		@include radius-large;
		display: flex;
		flex-flow: column;
		width: 289px;
		height: 276px;
		background-color: c(acrylic-bg);
	}

	.play-icon {
		margin-top: 2px;
		color: c(accent);
	}

	.emoji {
		@include chip-shadow;
		@include radius-small;
		display: flex;
		width: 87px;
		height: 24px;
		margin-right: 4px;
		color: c(text-color);
		background-color: c(main-bg);
	}

	.tab {
		@include flex-center;
		width: 289px;
		height: 37px;
	}

	.col {
		@include flex-center;
		display: flex;
		flex-flow: column;
		flex-wrap: wrap;
		width: 269px;
		height: 24px;
		margin: 7px 0 17px 10px;
	}
</style>
