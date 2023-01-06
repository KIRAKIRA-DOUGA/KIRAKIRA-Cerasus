<script setup lang="ts">
	const router = useRouter();

	const goHome = () => {
		router.push("/");
	};
</script>

<template>
	<LocaleLink to="/">Home</LocaleLink>
</template>
