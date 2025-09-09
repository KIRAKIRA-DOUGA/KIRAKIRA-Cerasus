<script setup lang="ts">
	// 允许同步的 kira cookie 设置
	// const useLocalKiraCookieOptions = { isWatchCookieRef: true, isSyncSettings: false };
</script>

<template>
	<!-- <div>
		<InfoBar type="warning" :title="$t('severity.warning')">
			{{ $t("settings.experimental_warning") }}
		</InfoBar>
		<Subheader icon="palette">{{ $t("appearance.title") }}</Subheader>
		<section list>
		</section>
	</div> -->
	<div class="no-settings">
		<Icon name="science" />

		<h2>{{ $t("experimental") }}</h2>
		<p>{{ $t("settings.no_experimental_features") }}</p>
	</div>
</template>

<style scoped lang="scss">
	.no-settings {
		@include flex-center;
		flex-direction: column;
		gap: 1rem;
		height: 70dvh;
		color: c(icon-color);
		transition: none;
	}

	.icon {
		font-size: 128px;
	}
</style>
