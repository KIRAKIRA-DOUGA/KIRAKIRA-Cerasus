<template>
	<div class="container">
		<Icon name="time" class="clock-1" />
		<Icon name="time" class="clock-2" />
		<Icon name="time" class="clock-3" />
		<svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg" class="triangle-1">
			<path d="M-4.5897e-07 9.5L15.75 0.406734L15.75 18.5933L-4.5897e-07 9.5Z" fill="var(--accent)" />
		</svg>
		<svg width="31" height="37" viewBox="0 0 31 37" fill="none" xmlns="http://www.w3.org/2000/svg" class="triangle-2">
			<path d="M30.25 35.3875L0.999999 18.5L30.25 1.61251L30.25 35.3875Z" stroke="var(--accent)" />
		</svg>
	</div>
</template>

<style scoped lang="scss">
	.v-enter-active * {
		transition: 1s $ease-out-smooth;
	}

	.v-leave-active * {
		transition: 100ms $ease-in-max;
	}

	.container > * {
		position: absolute;
	}

	.icon {
		color: c(accent, 10%);

		.v-enter-from &,
		.v-leave-to & {
			translate: 0 -100%;
		}

		&.clock-1 {
			top: -160px;
			left: -120px;
			font-size: 256px;
			transform: rotate(32deg);

			.v-enter-from & {
				rotate: 2turn;
			}

			.v-leave-to & {
				rotate: -0.2turn;
			}
		}

		&.clock-2 {
			top: -60px;
			left: 35%;
			font-size: 170px;
			transform: rotate(16deg);

			@include mobile {
				display: none;
			}

			.v-enter-from & {
				rotate: 1turn;
			}

			.v-leave-to & {
				rotate: -0.1turn;
			}
		}

		&.clock-3 {
			right: 25%;
			bottom: -60px;
			font-size: 128px;
			transform: rotate(80deg);

			.v-enter-from & {
				translate: 0 100%;
				rotate: 0.2turn;
			}

			.v-leave-to & {
				translate: 0 100%;
				rotate: -0.02turn;
			}
		}
	}

	svg {
		@include mobile {
			display: none;
		}

		&.triangle-1 {
			top: 42px;
			right: 40%;

			.v-enter-from & {
				translate: 128px;
			}

			.v-leave-to & {
				translate: -64px;
			}
		}

		&.triangle-2 {
			right: 30%;
			bottom: 36px;

			.v-enter-from & {
				translate: 256px;
			}

			.v-leave-to & {
				translate: -128px;
			}
		}
	}
</style>
