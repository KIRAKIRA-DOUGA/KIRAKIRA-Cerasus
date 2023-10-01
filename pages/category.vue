<script setup lang="ts">
	const categoryList = ["Anime", "Music", "Otomad", "Tech", "Design", "Game", "Misc"];
</script>

<template>
	<div class="container">
		<div class="categories">
			<div v-for="cat in categoryList" :key="cat" class="item">
				<p>
					<Icon name="placeholder" />
					{{ t.category[cat.toLowerCase()] }}
				</p>
				<Badge>39</Badge>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.categories {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;

		.item {
			@include round-large;
			@include mini-card-shadow;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 13px 16px;
			background-color: c(main-bg);

			p {
				display: flex;
				gap: 8px;
				align-items: center;
				color: c(icon-color);
				font-size: 16px;

				.icon {
					font-size: 24px;
				}
			}

			&:any-hover {
				@include chip-shadow-hover;
			}

			&:active {
				@include button-scale-pressed;
			}
		}
	}
</style>
