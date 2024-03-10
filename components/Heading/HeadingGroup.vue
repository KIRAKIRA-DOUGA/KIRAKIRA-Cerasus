<script setup lang="ts">
	const props = defineProps<{
		name: string;
		englishName: string;
		count?: number | string;
	}>();
</script>

<template>
	<header class="heading-group">
		<slot name="icon"></slot>
		<Heading class="main-title">{{ name }}</Heading>
		<Heading v-if="count !== undefined" form="small-solid" class="count">{{ count }}</Heading>
		<Heading form="small" class="english-after">{{ englishName }}</Heading>
	</header>
</template>

<style scoped lang="scss">
	header {
		display: flex;
		gap: 16px;
		align-items: flex-end;
		white-space: nowrap;

		:slotted(svg) {
			margin-right: -5px;
			margin-bottom: 4px;
			fill: c(accent);
		}

		.english-after:not(:lang(zh), :lang(ko)) {
			display: none;
		}

		.main-title:lang-latin,
		.english-after {
			font-feature-settings: normal;
		}

		.count {
			font-variant-numeric: oldstyle-nums;
		}
	}
</style>
