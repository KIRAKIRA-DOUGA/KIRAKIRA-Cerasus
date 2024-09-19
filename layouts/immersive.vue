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
	main:deep() {
		overflow-y: auto;

		> .container {
			padding: 26px $page-padding-x;

			@include tablet {
				padding: 26px $page-padding-x-tablet;
			}

			@include mobile {
				padding: 0;
			}
		}
	}
</style>
