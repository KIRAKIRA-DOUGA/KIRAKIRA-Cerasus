<script setup lang="ts">
	import caliburPixel from "assets/svg/calibur_pixel.svg?raw";
	import caliburTv from "assets/svg/calibur_tv.svg?raw";
	import novaOtomads from "assets/svg/nova_otomads.svg?raw";
	import omMidi from "assets/svg/om_midi.svg?raw";
	import otomadHelper from "assets/svg/otomad_helper.svg?raw";
	import otomadWiki from "assets/svg/otomad_wiki.svg?raw";

	const links = {
		NOVA: [
			{ logo: novaOtomads, href: "https://space.bilibili.com/171767281/" },
			{ logo: otomadWiki, href: "https://otomad.wiki/" },
			{ logo: caliburTv, href: "https://www.calibur.tv/" },
			{ logo: caliburPixel, href: "https://mc.calibur.tv/" },
		],
		"OTOMAD+": [
			{ logo: otomadHelper, href: "https://otomad.github.io/otomad/link/OtomadHelper.html#homepage" },
			{ logo: omMidi, href: "https://otomad.github.io/otomad/link/om_midi.html#homepage" },
		],
	} as Record<string, { logo: string; href: string; index?: number }[]>;

	let i = 1;
	for (const section of Object.values(links))
		for (const link of section)
			link.index = i++;
</script>

<template>
	<div>
		<Subheader icon="link">{{ t.friendly_links }}</Subheader>
		<template v-for="section, title in links" :key="title">
			<header class="section" :style="{ '--i': section[0]?.index }">{{ title }}</header>
			<div class="links lite-links">
				<!-- eslint-disable-next-line vue/no-v-html -->
				<a v-for="{ logo, href, index } in section" :key="href" target="_blank" :style="{ '--i': index }" :href v-html="logo"></a>
			</div>
		</template>
	</div>
</template>

<style scoped lang="scss">
	$delay: 250ms;
	$item-height: 64px;

	header.section {
		margin-block: 1.35rem 0.65rem;
		color: c(accent);
		font-family: $english-logo-fonts;
		font-size: 20px;
		font-weight: 600;
		text-align: center;

		&:first-of-type {
			margin-block-start: 0;
		}

		&::before,
		&::after {
			content: "\2013";
			margin-inline: 1rem;
		}
	}

	.links {
		display: flex;
		flex-flow: row wrap;
		gap: 1rem 2.5rem;
		justify-content: center;

		a {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			width: min-content;
			max-width: 500px;
			height: $item-height;

			&,
			:deep(svg) .logo,
			:deep(svg) .text {
				transition: $fallback-transitions, scale $ease-out-back-smooth 500ms, transform $ease-out-back-smooth 500ms;
			}

			&:is(:hover, :focus-visible) {
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
				max-height: $item-height;
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

	.section {
		animation-delay: calc(var(--i) * $delay - 100ms);
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
