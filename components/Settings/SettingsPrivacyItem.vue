<script setup lang="ts">
	const option = ref("");
	const optionList = ["public", "following", "private"] as const;
</script>

<template>
	<Comp>
		<slot></slot>
		<div class="privacy-radio-group">
			<RadioButton
				v-for="item in optionList"
				:key="item"
				v-model="option"
				:value="item"
			/>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		display: flex;
		justify-content: space-between;
	}

	.privacy-radio-group {
		display: flex;
		gap: 2rem;
	}

	:deep(.radio-button) {
		gap: 0 !important;
		font-size: 0;
	}
</style>
