<template>
	<div class="container">
		<div class="color-box">
			<div v-for="i in 10" :key="i" class="color"></div>
		</div>
	</div>
</template>

<style lang="scss">
	.color-box {
		display: flex;
		flex-direction: column;
		gap: 16px;

		.color {
			@include round-small;
			@include card-shadow;
			@include square(50px);

			&:nth-child(1) {
				background-color: c(accent-5);
			}

			@for $i from 1 to 10 {
				$id: $i * 10;
				&:nth-child(#{$i + 1}) {
					background-color: c(accent- + $id);
				}
			}
		}
	}
</style>
