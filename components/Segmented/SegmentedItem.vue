<script setup lang="ts">
	const props = defineProps<{
		/** 图标，可选。 */
		icon?: string;
		/** 标识符。 */
		id: string;
	}>();
</script>

<template>
	<Comp>
		<Icon v-if="icon" :name="icon" />
		<span>
			<slot></slot>
		</span>
	</Comp>
</template>
