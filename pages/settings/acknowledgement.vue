<script setup lang="ts">
	
</script>

<template>
	<Subheader icon="link">{{ t.friendly_links }}</Subheader>
	<div class="links lite-links">
		<a href="https://otomad.wiki/"><img src="/static/images/links/otomadwiki.svg" alt="Otomad Wiki" /></a>
		<a id="horahora" href="https://www.horahora.org/">Horahora</a>
		<a href="https://sakuranomiyaaira-my.sharepoint.com/:f:/g/personal/aira_sakuranomiyaaira_onmicrosoft_com/EupwfzfUz8VNqhS_YWGToesBkfn_bfGZPeqpbrcVQMsPgA">艾拉软件库</a>
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
	
	#horahora {
		color: #0a5c4e;
		font-weight: 700;
		font-size: 64px;
		font-family: $english-logo-fonts;
		
		html.dark & {
			color: #9fd;
		}
	}
</style>
