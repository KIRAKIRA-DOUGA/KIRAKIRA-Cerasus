<docs>
	标准样式的 Banner（横幅）。
</docs>

<script setup lang="ts">
	const props = defineProps<{
		name: string;
		englishName: string;
		icon: DeclaredIcons;
	}>();
</script>

<template>
	<Comp>
		<Transition appear mode="out-in">
			<ShadingIcon :icon position="right top" :key="icon" />
		</Transition>
		<Transition appear mode="out-in" :duration="{ enter: 550, leave: 100 }">
			<HeadingGroup :name :englishName :key="name" />
		</Transition>
	</Comp>
</template>

<style scoped lang="scss">
:comp {
	display: flex;
	align-items: center;
	padding: 0 $page-padding-x;

	@include tablet {
		padding: 0 $page-padding-x-tablet;
	}

	@include mobile {
		padding: 0 $page-padding-x-mobile;
	}

	.shading-icon {
		position: absolute;
		transform-origin: 75% 25%;

		&.v-enter-active {
			transition: 500ms $ease-out-spring;
		}

		&.v-leave-active {
			transition: 100ms $ease-in-max;
		}

		&.v-enter-from,
		&.v-leave-to {
			scale: 0;
			opacity: 0.8;
		}

		&.v-enter-from {
			rotate: -45deg;
		}

		&.v-leave-to {
			rotate: 45deg;
		}
	}

	.heading-group {
		&.v-enter-active {
			&:deep(> *) {
				transition: 500ms $ease-out-max;
			}

			&:deep(> .sub) {
				transition-delay: 50ms;
			}
		}

		&.v-leave-active :deep(> *) {
			transition: 100ms $ease-in-max;
		}

		&.v-enter-from :deep(> *) {
			translate: 3rem;
			opacity: 0;
		}

		&.v-leave-to :deep(> *) {
			translate: -2rem;
			opacity: 0;
		}
	}
}
</style>
