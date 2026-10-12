<script setup lang="ts">
	const route = useRoute();
	const kvid = +route.params.kvid;
</script>

<template>
	<div class="container">
		<p>{{ kvid }}</p> <!-- DELETE ME: 移除该 debug 文本 -->
		<p>UPLOAD EDITOR HERE</p> <!-- DELETE ME: 移除该 debug 文本 -->
		<UploadEditor isEditing :kvid />
	</div>
</template>
