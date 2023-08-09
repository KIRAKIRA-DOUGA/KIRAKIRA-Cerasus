<script setup lang="ts">
	const props = defineProps<{
		name: string;
		englishName: string;
		count?: number | string;
	}>();
</script>

<template>
	<Comp>
		<slot name="icon"></slot>
		<Heading>{{ name }}</Heading>
		<Heading v-if="count !== undefined" form="small-solid">{{ count }}</Heading>
		<Heading form="small" class="english-after">{{ englishName }}</Heading>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		display: flex;
		gap: 16px;
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
