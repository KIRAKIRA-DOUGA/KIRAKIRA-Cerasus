<script setup lang="ts">
	import importKaomoji from "./kaomojis";

	const inputKaomoji = defineModel<string>();
	const selectedTab = ref("all");
	let emoji: string[] = importKaomoji[0];

	/**
	 * 改变当前页数,从0开始。
	 * @param page 要改变到的页数。
	*/
	function changePage(page: number) {
		inputKaomoji.value = "";
		emoji = importKaomoji[page];
	}
</script>

<template>
	<div class="emoji-bar">
		<div class="tab">
			<TabBar v-model="selectedTab">
				<TabItem id="happy" @click="changePage(0)">{{ t.happy }}</TabItem>
				<TabItem id="greet" @click="changePage(1)">{{ t.greet }}</TabItem>
				<TabItem id="cute" @click="changePage(2)">{{ t.awa }}</TabItem>
				<TabItem id="sad" @click="changePage(3)">{{ t.sad }}</TabItem>
				<TabItem id="embarrassed" @click="changePage(4)">{{ t.embarrassed }}</TabItem>
				<Icon name="play" class="play-icon" />
			</TabBar>
		</div>
		<div class="group">
			<div v-for="n in 5" :key="n" class="col">
				<Button v-for="i in 3" :key="i" class="emoji" @click="inputKaomoji = emoji[3 * (n - 1) + (i - 1)]">
					{{ emoji[3 * (n - 1) + (i - 1)] }}
				</Button>
			</div>
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
		font-size: 0.5em;
		background-color: c(main-bg);
	}

	.tab {
		@include flex-center;
		width: 234px;
		height: 37px;
		margin: 0 0 10px 16px;
	}

	.col {
		@include flex-center;
		display: flex;
		flex-flow: column;
		flex-wrap: wrap;
		width: 269px;
		height: 24px;
		margin: 7px 0 17px -2px;
	}
</style>
