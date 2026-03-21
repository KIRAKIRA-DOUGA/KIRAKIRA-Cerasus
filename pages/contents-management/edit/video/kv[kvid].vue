<script setup lang="ts">
	const route = useRoute();
	const kvid = +route.params.kvid;
</script>

<template>
	<div class="container">
		<p>{{ kvid }}</p>
		<p>UPLOAD EDITOR HERE</p>
	</div>
</template>
