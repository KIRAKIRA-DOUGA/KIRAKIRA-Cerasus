<docs>
	# 沉浸式布局
</docs>

<script setup lang="ts">

</script>

<template>
	<main>
		<slot></slot>
	</main>
</template>

<style scoped lang="scss">
	main {
		overflow-y: auto;

		:deep(> .container) {
			padding: 26px 100px;

			@include tablet {
				padding: 26px 40px;
			}

			@include mobile {
				padding: 0;
			}
		}
	}
</style>
