<script setup lang="ts">
	import startSound from "assets/audios/StartSnd.ogg";
	const startSoundAudio = ref<HTMLAudioElement>();

	const props = defineProps<{
		/** 视频是否正在播放？ */
		playing?: boolean;
	}>();

	/** 是否显示？ */
	const shown = defineModel<boolean>();

	/**
	 * 播放启动音。
	 */
	function playStartSound() {
		if (startSoundAudio.value) {
			startSoundAudio.value.currentTime = 0;
			startSoundAudio.value.play();
		}
	}
</script>

<template>
	<Transition>
		<Comp v-if="shown" :class="{ playing }" @click="shown = false">
			<LogoText />
			<div class="center">
				<Icon class="logo" name="yozora_big" />
				<div class="right-wrapper">
					<p class="name" @animationend="playStartSound">YOZORA PLAYER</p>
				</div>
			</div>
			<p class="powered-by">POWERED BY OPEN SOURCES</p>
			<audio ref="startSoundAudio" :src="startSound"></audio>
		</Comp>
	</Transition>
</template>

<style scoped lang="scss">
	$animation-wait-shown: 250ms;

	:comp {
		@include flex-center;
		flex-direction: column;
		overflow: clip;
		color: c(accent);
		background-color: c(main-bg, 75%);
		backdrop-filter: blur(16px);
		transition-duration: 500ms;

		&.v-enter-from,
		&.v-leave-to {
			opacity: 0;
		}
	}

	.logo-text {
		--form: full;
		position: absolute;
		top: 16px;
		right: 16px;
		z-index: 2;
		animation: float-left 1s 200ms + $animation-wait-shown $ease-out-smooth backwards;
	}

	.center {
		@include flex-center;
		z-index: 3;

		:comp.playing:not(.v-enter-active, .v-leave-active) & {
			animation: fluttering 1s $ease-out-max infinite;
		}
	}

	.right-wrapper {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		max-width: 100%;
	}

	.logo {
		margin-right: -0.2em;
		font-size: 12dvw;
		animation:
			logo-in 1s $animation-wait-shown $ease-out-smooth,
			cut-in $animation-wait-shown backwards;

		@include mobile {
			font-size: 20dvw;
		}
	}

	.name {
		font-weight: bold;
		font-size: 4dvw;
		font-family: $english-logo-fonts;
		white-space: nowrap;
		animation: float-right 1s $animation-wait-shown $ease-out-smooth backwards;

		@include mobile {
			font-size: 8dvw;
		}
	}

	.powered-by {
		position: absolute;
		bottom: 16px;
		z-index: 1;
		color: c(icon-color);
		font-family: $english-logo-fonts;
		animation: float-up 1s $animation-wait-shown $ease-out-smooth backwards;
	}

	:comp.v-leave-to {
		&,
		* {
			transition-timing-function: $ease-in-smooth;
			transition-duration: 250ms;
		}

		.logo-text {
			translate: 100%;
			opacity: 0;
		}

		.powered-by {
			translate: 0 200%;
			opacity: 0;
		}

		.name {
			translate: -50%;
			opacity: 0;
		}

		.logo {
			rotate: -90deg;
			scale: 4;
		}
	}

	@keyframes logo-in {
		from {
			rotate: -1turn;
			scale: 10;
		}
	}

	@keyframes float-left {
		from {
			translate: 100%;
			opacity: 0;
		}
	}

	@keyframes float-right {
		from {
			translate: -100%;
			opacity: 0;
		}
	}

	@keyframes float-up {
		from {
			translate: 0 200%;
			opacity: 0;
		}
	}

	@keyframes fluttering {
		0%,
		100% {
			scale: 1;
			translate: 0;
			animation-timing-function: $ease-in-smooth;
		}

		75% {
			scale: 0.9;
			translate: 0 0.75rem;
		}
	}
</style>
