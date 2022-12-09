<template>
	<a @click="goHome">
		Home
	</a>
</template>

<script setup lang="ts">

	const router = useRouter();

	const goHome = () => {
		router.push("/");
	};

</script>
