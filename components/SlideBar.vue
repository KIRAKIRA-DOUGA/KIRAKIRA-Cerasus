<script setup lang="ts">

</script>

<template>
	<section>
		<div class="track"></div>
		<div class="thumb"></div>
	</section>
</template>

<style scoped lang="scss">
	section {
		position: relative;
	}

	.track {
		@include oval;
		height: 6px;
		background-color: c(accent-disabled);
	}

	.thumb {
		@include square(16px);
		@include circle;
		@include flex-center;
		position: absolute;
		top: 0;
		background-color: c(main-bg);

		&::after {
			@include square(8px);
			@include circle;
			display: block;
			background-color: c(accent);
			content: "";
		}
	}
</style>
