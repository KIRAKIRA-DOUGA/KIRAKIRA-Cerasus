<script setup lang="ts">
	definePageMeta({
		validate: route => {
			const routeNumber = +route.path.slice(1);
			if (routeNumber === 601)
				navigateTo("/601.html");
			if (routeNumber === 404)
				return false;
			if (isFinite(routeNumber)) // 测试，如果输入的路由是数字就可以触发对应数字的错误代码。
				return {
					statusCode: routeNumber,
				};
			return true;
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
