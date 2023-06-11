<docs>

</docs>

<script setup lang="ts">
	const props = defineProps<{
		emoji:string[];
	}>();
	const model = defineModel<number>();
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
				<Icon name="play" class="playicon" />
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
	display: flex;
	flex-flow: column;
	width: 289px;
	height: 276px;
	background: rgb(248 248 248 / 85%);
	border-radius: 6px;
	box-shadow: 0 8px 16px rgb(193 159 168 / 50%);
	backdrop-filter: blur(16px);
}

.playicon {
	margin-top: 2px;
	color: c(accent);
}

.emoji {
	display: flex;
	width: 87px;
	height: 24px;
	margin-right: 4px;
	color: black;
	background: white;
	border-radius: 4px;
	box-shadow: 0 2px 4px rgb(193 159 168 / 30%);
}

.tab {
	display: flex;
	align-items: center;
	justify-content: center;
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
	margin-top: 7px;
	margin-bottom: 17px;
	margin-left: 10px;
}
</style>
