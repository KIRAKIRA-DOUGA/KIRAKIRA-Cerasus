<script setup lang="ts">
	import novaOtomads from "assets/svg/nova_otomads.svg?raw";
	import otomadWiki from "assets/svg/otomad_wiki.svg?raw";
	import caliburTv from "assets/svg/calibur_tv.svg?raw";
	import caliburPixel from "assets/svg/calibur_pixel.svg?raw";

	const links = {
		NOVA: [
			{ logo: novaOtomads, href: "https://space.bilibili.com/171767281/" },
			{ logo: otomadWiki, href: "https://otomad.wiki/" },
			{ logo: caliburTv, href: "https://www.calibur.tv/" },
			{ logo: caliburPixel, href: "https://mc.calibur.tv/" },
		],
	} as Record<string, { logo: string; href: string; index?: number }[]>;

	let i = 0;
	for (const section of Object.values(links))
		for (const link of section)
			link.index = i++;
</script>

<template>
	<Subheader icon="link">{{ t.friendly_links }}</Subheader>
	<template v-for="section, title in links" :key="title">
		<Subheader>{{ title }}</Subheader>
		<div class="links lite-links">
			<!-- eslint-disable-next-line vue/no-v-html -->
			<a v-for="{ logo, href, index } in section" :key="href" :style="{ '--i': index }" :href v-html="logo"></a>
		</div>
	</template>
</template>

<style scoped lang="scss">
	$delay: 250ms;

	.links {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		a {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			width: min-content;
			max-width: 500px;

			&,
			:deep(svg) .logo,
			:deep(svg) .text {
				transition: $fallback-transitions, scale $ease-out-back-smooth 500ms, transform $ease-out-back-smooth 500ms;
			}
			
			&:is(:hover, :focus-visible):not(:active) {
				filter: saturate(2);
			}

			&:active {
				scale: 0.95;

				:deep(svg) .logo {
					transform: scale(0.85) rotate(10deg);
				}

				:deep(svg) .text {
					transform: translateX(-8px);
				}
			}

			:deep(svg) {
				height: 64px;
				overflow: visible;

				.logo,
				.text {
					transform-origin: center;
					transform-box: fill-box;
				}

				.logo {
					animation: scale-out-in 1s $ease-out-max calc(var(--i) * $delay) both;
				}

				.text {
					animation: move-left 1s $ease-out-max calc(var(--i) * $delay + 100ms) both;
				}
			}
		}
	}

	@keyframes scale-out-in {
		from {
			scale: 1.5;
			opacity: 0;
		}
	}

	@keyframes move-left {
		from {
			translate: 24px;
			opacity: 0;
		}
	}
</style>
