<script setup lang="ts">
	const props = defineProps<{
		/** 图标，可选。 */
		icon?: DeclaredIcons;
		/** 是否可点击？ */
		clickable?: boolean;
	}>();
</script>

<template>
	<Comp :class="{ clickable }">
		<Icon v-if="icon" :name="icon" />
		<p><slot></slot></p>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		display: flex;
		flex-shrink: 0;
		gap: 0.25rem;
		align-items: center;
		color: c(icon-color);

		&.clickable {
			cursor: pointer;

			&:any-hover {
				color: c(accent-hover);
			}

			&:active {
				color: c(accent-pressed);
			}
		}
	}

	.icon {
		font-size: 20px;
	}

	p {
		user-select: text;

		:comp.clickable & {
			user-select: none;
		}
	}
</style>
