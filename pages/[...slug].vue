<script setup lang="ts">
	import { slugValidate } from "middleware/validate.global";
	import SettingsSlug from "./settings/[...slug].vue";

	definePageMeta({
		validate: slugValidate(),
	});

	const route = useRoute();
	const isSettings = computed(() => route.params.slug?.[0] === "settings");

	/**
	 * 重新载入。
	 */
	function reload() {
		location.reload();
	}
</script>

<template>
	<SettingsSlug v-if="isSettings" />
	<main v-else class="main">
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
		font-size: calc(1.425rem + 2.1dvw);
		font-style: italic;
		background: linear-gradient(315deg, #42d392 25%, #647eff);
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>
