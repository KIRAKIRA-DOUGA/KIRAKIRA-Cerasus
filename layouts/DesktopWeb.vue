<script setup lang="ts">
	const showBanner = ref(false);
	watchRoute(() => showBanner.value = getRoutePath() === "", true);
</script>

<template>
	<CssDoodle
		styles="
		css-doodle {
			--color: @p(#51eaea, #fffde1, #ff9d76, #FB3569);

			--rule: ( :doodle {
					@grid: 30x1 / 18vmin;
					--deg: @p(-180deg, 180deg);
				}

				:container {
					perspective: 30vmin;
				}

				:after, :before {
					content: '';
					background: var(--color);
					@place-cell: @r(100%) @r(100%);
					@size: @r(6px);
					@shape: heart;
				}

				@place-cell: center;
				@size: 100%;

				box-shadow: @m2(0 0 50px var(--color));
				background: @m100(radial-gradient(var(--color) 50%, transparent 0) @r(-20%, 120%) @r(-20%, 100%) / 1px 1px no-repeat);

				will-change: transform, opacity;
				animation: scale-up 12s linear infinite;
				animation-delay: calc(-12s / @size() * @i());

				@keyframes scale-up {
					0%, 95.01%, 100% {
						transform: translateZ(0) rotate(0);
						opacity: 0;
					}

					10% {
						opacity: 1;
					}

					95% {
						transform: translateZ(35vmin) rotateZ(@var(--deg));
					}
				}

			)
		}"
	/>
	<SideBar class="sidebar" />
	<div class="container">
		<Banner :collapsed="!showBanner" />
		<main>
			<slot></slot>
		</main>
	</div>
</template>

<style scoped lang="scss">
	.container {
		position: relative;
		z-index: 1;
		padding-left: $sidebar-width;
	}

	main {
		max-width: 1920px;
		margin: 0 auto;
	}

	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		transition: background $ease-out-max 250ms;
	}
</style>
