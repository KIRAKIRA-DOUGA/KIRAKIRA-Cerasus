<script setup lang="ts">
	const props = defineProps<{
		name: string;
		englishName: string;
		count?: number | string;
	}>();
</script>

<template>
	<header>
		<slot name="icon"></slot>
		<Header>{{ name }}</Header>
		<Header v-if="count !== undefined" form="small-solid">{{ count }}</Header>
		<Header form="small" class="english-after">{{ englishName }}</Header>
	</header>
</template>

<style scoped lang="scss">
	header {
		display: flex;
		gap: 8px;
		align-items: flex-end;
		white-space: nowrap;

		:slotted(svg) {
			margin-right: -5px;
			margin-bottom: 4px;
			fill: c(accent);
		}

		.english-after:lang(en) {
			display: none;
		}
	}
</style>
