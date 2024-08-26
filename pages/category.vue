<script setup lang="ts">
	const categories = [
		{ id: "anime", icon: "movie" },
		{ id: "music", icon: "music" },
		{ id: "otomad", icon: "otomad_wiki" },
		{ id: "tech", icon: "programmer" },
		{ id: "design", icon: "design" },
		{ id: "game", icon: "games" },
		{ id: "misc", icon: "sun" },
	];
</script>

<template>
	<div class="container">
		<div class="categories">
			<div v-for="{ id: cat, icon } in categories" :key="cat" class="item">
				<p>
					<Icon :name="icon" />
					{{ t.category[cat] }}
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
			justify-content: space-between;
			align-items: center;
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
