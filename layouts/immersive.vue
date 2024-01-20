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
	main:deep {
		overflow-y: auto;

		> .container {
			padding: 26px 5dvw;

			@include tablet {
				padding: 26px 24px;
			}

			@include mobile {
				padding: 0;
			}
		}
	}
</style>
