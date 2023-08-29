<script setup lang="ts">
	const props = defineProps<{
		icon?: DeclaredIcons;
	}>();

	const privacy = defineModel<PrivacyType>();
	const privacies = ["public", "following", "private"] as PrivacyType[];
</script>

<template>
	<Comp v-ripple role="listitem">
		<Icon v-if="icon" :name="icon" />
		<span class="content"><slot></slot></span>
		<div class="privacy-radio-group">
			<RadioButton
				v-for="item in privacies"
				:key="item"
				v-model="privacy"
				:value="item"
			/>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		display: flex;
		align-items: center;

		> .icon {
			margin-right: 8px;
			color: c(icon-color);
			font-size: 20px;
		}

		> .content {
			width: 100%;
		}
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
