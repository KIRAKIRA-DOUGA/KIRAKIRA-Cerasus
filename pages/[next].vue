<script setup lang="ts">
	definePageMeta({
		validate: route => {
			const validRoutes = ["hello", "next", "settings", "user"];
			if (validRoutes.includes(route.params.next as string))
				return true;
			return false;
		},
	});

	/**
	 * 重新载入。
	 */
	function reload() {
		location.reload();
	}
</script>

<template>
	<main class="main">
		<h1 class="slug">{{ $route.fullPath }}</h1>
		<ContentDoc>
			<template #not-found>
				<p>{{ t.page_not_found_info }}</p>
				<Button @click="reload">{{ t.click_to_refresh }}</Button>
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
		font-size: calc(1.425rem + 2.1dvw);
		font-style: italic;
		background: linear-gradient(315deg, #42d392 25%, #647eff);
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>
