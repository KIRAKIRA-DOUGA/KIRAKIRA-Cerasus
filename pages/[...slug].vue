<script setup lang="ts">
	definePageMeta({
		validate: route => {
			const validRoutes = ["hello", "search", "next"];

			const routePath = getRoutePath({ route });
			const routeNumber = +routePath;
			if (validRoutes.includes(routePath))
				return true;
			if (routeNumber === 404)
				return false;
			if (isFinite(routeNumber))
				return true;
			return false;
		},
	});

	function reload() {
		location.reload();
	}
</script>

<template>
	<main class="main">
		<h1 class="slug">{{ $route.params.slug }}</h1>
		<ContentDoc>
			<template #not-found>
				<p>你似乎来到了一个很新的页面。</p>
				<Button @click="reload">点击刷新</Button>
			</template>
		</ContentDoc>
	</main>
</template>

<style scoped lang="scss">
	.main {
		padding: 1rem;
	}

	.slug {
		display: inline-block;
		margin-top: 0;
		font-size: calc(1.425rem + 2.1vw);
		font-style: italic;
		background: linear-gradient(315deg, #42d392 25%, #647eff);
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>
