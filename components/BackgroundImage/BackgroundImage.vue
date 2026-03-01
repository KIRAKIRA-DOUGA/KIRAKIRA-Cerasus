<script setup lang="ts">
	const backgroundImageSettingsStore = useAppSettingsStore().backgroundImage;
	const backgroundImages = useBackgroundImages();
</script>

<template>
	<ClientOnly>
		<div v-if="backgroundImages.shown" class="background" :style="{ opacity: backgroundImageSettingsStore.opacity }">
			<Transition appear>
				<BackgroundImageImg
					:src="backgroundImages.currentImage"
					:autoAlt="false"
					:fit="backgroundImages.fit"
					:position="backgroundImages.position"
					:style="{ filter: `blur(${backgroundImageSettingsStore.blur}px)` }"
				/>
			</Transition>
			<div class="overlay" :style="{ opacity: backgroundImageSettingsStore.tint }"></div>
		</div>
	</ClientOnly>
</template>

<style scoped lang="scss">
	.background {
		position: fixed;
		inset: 0;
		z-index: 0;
		opacity: 0.2;
		transition: $fallback-transitions, scale $ease-out-max 1s;

		img {
			@include square(100%);
			position: fixed;
			inset: 0;
			object-fit: cover;

			&.v-enter-from,
			&.v-leave-to {
				scale: 1.1;
				opacity: 0;
			}

			&.v-enter-active,
			&.v-leave-active {
				transition: scale $ease-out-smooth 1s, opacity ease 1s;
			}
		}

		.overlay {
			@include square(100%);
			position: fixed;
			inset: 0;
			background-color: c(accent);
			opacity: 0.75;
			mix-blend-mode: screen;
			forced-color-adjust: none;
		}
	}
</style>
