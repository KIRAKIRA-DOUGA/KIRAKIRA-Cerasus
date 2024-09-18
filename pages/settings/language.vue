<script setup lang="ts">
	import type { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables";
	import { useNow } from "@vueuse/core"; // 它与 lodash 同名函数冲突，只得显式引入。

	const { locale: currentLocale, locales } = useI18n();
	const date = useNow();

	const localeModel = computed({
		get: () => currentLocale.value,
		set: value => switchLanguage(value),
	});
	const localeList = computed(() => (locales.value as LocaleObject[]).map(locale => ({
		code: locale.code,
		lang: getCurrentLocaleLangCode(locale.code),
		name: locale.name || locale.code,
	})));
</script>

<template>
	<div>
		<div class="date-time">
			<Subheader icon="time">{{ t.current_time }}</Subheader>
			<p><DateTime :dateTime="date" showTime /></p>
		</div>
		<section grid>
			<SettingsGridItem
				v-for="locale in localeList"
				:id="locale.code"
				:key="locale.code"
				v-model="localeModel"
				:title="t.language[locale.code]"
			>
				<div class="line" :lang="locale.lang">
					{{ locale.name }}
				</div>
			</SettingsGridItem>
		</section>
	</div>
</template>

<style scoped lang="scss">
	section {
		$length: 10;
		animation: none !important;

		@media not (prefers-reduced-motion: reduce) {
			:not(.stop-animation) > & {
				@for $i from 1 through $length {
					> :nth-child(#{$i}) {
						animation: scale-in 600ms (100ms * ($i - 1)) $ease-out-smooth backwards;
					}
				}
			}
		}
	}

	.date-time {
		$length: 2;
		animation: none !important;

		@media not (prefers-reduced-motion: reduce) {
			:not(.stop-animation) > & {
				@for $i from 1 through $length {
					> :nth-child(#{$i}) {
						animation: float-left 1s (100ms * ($i - 1)) $ease-out-smooth backwards;
					}
				}
			}
		}

		> .subheader {
			margin-bottom: 10px;
		}

		> p {
			margin-bottom: 4px;
			font-variant-numeric: tabular-nums;
		}
	}

	.line {
		width: 100%;
		margin: 0 20px;
		padding: 20px 0;
		color: c(icon-color);
		font-size: 32px;
		font-weight: 500;
		font-feature-settings: normal;
		line-height: 32px;
		text-align: center;
		border: c(gray-40) solid;
		border-width: 1px 0;

		&:lang-latin {
			font-family: $english-logo-fonts;
		}

		.settings-grid-item.active & {
			color: c(accent);
			border-color: c(accent-30);
		}

		@container style(--column: single) {
			margin: 0 12px;
			padding: 12px 0;
			font-size: 20px;
			line-height: 20px;
		}
	}

	@keyframes scale-in {
		from {
			scale: 0.8;
			opacity: 0;
		}
	}

	@keyframes float-left {
		from {
			translate: 2rem;
			opacity: 0;
		}
	}
</style>
