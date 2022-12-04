<script setup lang="ts">
	const page = ref(1);
</script>

<template>
	<div class="kirakira-home-page-box">
		<div>
			kirakira home
		</div>
		<NuxtLink to="/VideoPlay">
			video
		</NuxtLink>
		<div class="component-test">
			<PageController :pages="99" :displayPageCount="7" :current="page" enableArrowKeyMove @changePage="e => page = e.page" />
			<br />
			<Button>123</Button>
			<Button disabled>123</Button>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.kirakira-home-page-box {
		background-color: yellow;
	}

	.component-test {
		padding: 2rem 1rem;

		> * {
			margin: 0.25rem 0.5rem;
		}
	}
</style>
