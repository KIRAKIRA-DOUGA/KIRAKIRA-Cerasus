<template>
	<Comp>
		<LogoText />
		<div class="center">
			<Icon name="yozora_big" />
			<div class="right-wrapper">
				<p class="name">YOZORA PLAYER</p>
			</div>
		</div>
		<p class="powered-by">POWERED BY OPEN SOURCE</p>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include flex-center;
		flex-direction: column;
		overflow: hidden;
		color: c(accent);
		background-color: c(main-bg, 75%);
		backdrop-filter: blur(16px);
		animation: background-intro 3s backwards;
	}

	.logo-text {
		--form: full;
		position: absolute;
		top: 16px;
		right: 16px;
		animation: float-left 1s 0.2s $ease-out-smooth backwards;
	}

	.center {
		@include flex-center;
	}

	.right-wrapper {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		max-width: 100%;
	}

	.icon {
		margin-right: -0.2em;
		font-size: 12dvw;
		animation: icon 1s $ease-out-smooth backwards;

		@include mobile {
			font-size: 20dvw;
		}
	}

	.name {
		font-weight: bold;
		font-size: 4dvw;
		font-family: $english-logo-fonts;
		white-space: nowrap;
		animation: float-right 1s $ease-out-smooth backwards;

		@include mobile {
			font-size: 8dvw;
		}
	}

	.powered-by {
		position: absolute;
		bottom: 16px;
		color: c(icon-color);
		font-family: $english-logo-fonts;
		animation: float-up 1s $ease-out-smooth backwards;
	}

	@keyframes icon {
		from {
			rotate: -1turn;
			scale: 10;
		}
	}

	@keyframes float-left {
		from {
			translate: 100% 0;
			opacity: 0;
		}
	}

	@keyframes float-right {
		from {
			translate: -100% 0;
			opacity: 0;
		}
	}

	@keyframes float-up {
		from {
			translate: 0 200%;
			opacity: 0;
		}
	}
</style>
