<script setup lang="ts">

</script>

<template>
	<Subheader icon="link">{{ t.friendly_links }}</Subheader>
	<div class="links lite-links">
		<a href="https://otomad.wiki/"><img src="/static/images/links/otomadwiki.svg" alt="Otomad Wiki" /></a>
	</div>
</template>

<style scoped lang="scss">
	.links a {
		@include flex-center;
		max-width: 500px;

		:is(&, img) {
			max-width: 500px;
			transition: $fallback-transitions, scale cubic-bezier(0.18, 0.89, 0.32, 2) 500ms;

			&:active {
				scale: 0.95;
			}
		}
	}
</style>
