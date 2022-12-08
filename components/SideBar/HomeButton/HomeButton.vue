<template>
	<div @click="goHome">
		Home
	</div>
</template>

<script setup lang="ts">

	const router = useRouter();

	const goHome = () => {
		router.push("/");
	};

</script>
