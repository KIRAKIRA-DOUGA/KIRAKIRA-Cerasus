<script setup lang="ts">
	import avatar from "assets/images/aira.jpg";

	const showLogin = ref(false);
	const isLogined = ref(false);
	const isCurrentSettings = computed(() => !!currentSettingsPage());

	useListen("app:requestLogin", () => showLogin.value = true);
	useListen("user:login", value => isLogined.value = value);
</script>

<template>
	<aside role="toolbar" aria-label="side bar" aria-orientation="vertical">
		<div class="top icons">
			<SoftButton v-i="0" v-tooltip:right="t.home" icon="home" href="/" />
			<SoftButton v-i="1" v-tooltip:right="t.search" icon="search" href="/search" />
			<SoftButton v-i="2" v-tooltip:right="t.history" icon="history" />
			<SoftButton v-i="3" v-tooltip:right="t.favorite" icon="star" />
			<SoftButton v-i="4" v-tooltip:right="'关注'" icon="feed" />
			<SoftButton v-i="5" v-tooltip:right="t.upload" icon="upload" />
		</div>

		<div v-i="6" class="center">
			<div class="stripes">
				<div v-for="i in 2" :key="i" class="stripe"></div>
			</div>
			<LogoText />
		</div>

		<div class="bottom icons">
			<SoftButton
				v-if="!isLogined"
				v-i="7"
				v-tooltip:right="t.login"
				icon="person"
				class="person"
				@click="showLogin = true"
			/>
			<div
				v-else
				v-i="7"
				v-ripple
				v-tooltip:right="'艾草'"
				class="person logined"
				@click="showLogin = true"
			>
				<img :src="avatar" alt="avatar" draggable="false" />
			</div>
			<SoftButton v-i="8" v-tooltip:right="t.messages" icon="email" href="/test-rich-text-editor" />
			<SoftButton v-i="9" v-tooltip:right="t.settings" icon="settings" href="/settings" :active="isCurrentSettings" />
		</div>

		<LoginWindow v-model="showLogin" />
	</aside>
</template>

<style scoped lang="scss">
	$icons-gap: 8px;

	aside {
		@include sidebar-shadow;
		@include flex-center;
		z-index: 30;
		flex-direction: column;
		justify-content: space-between;
		width: $sidebar-width;
		padding: $icons-gap 0;
		overflow: hidden;
		background-color: c(main-bg);

		> * {
			flex-grow: 0;
			width: $sidebar-width;
		}

		&.ready {
			[style*="--i"] {
				animation: jump-in 300ms calc(var(--i) * 50ms) $ease-out-back both;
			}
		}

		.icons {
			@include flex-center;
			flex-direction: column;
			gap: $icons-gap;

			@media (max-height: 432px) {
				gap: 0;
			}
		}

		.center {
			@include flex-center;
			width: max-content;
			rotate: -100grad;

			.stripes {
				display: flex; // 结论：池沼 block 布局会恶意在元素之间加空隙还找不出原因。
				margin-right: 24px;
				transform: skewX(30deg);

				.stripe {
					display: inline-block;
					width: 8px;
					height: $sidebar-width;
					margin-right: 12px;
					background-color: c(accent);
				}

				@media (height < 678px) {
					margin-right: 0;
				}

				@media (height < 540px) {
					transform: none;
					opacity: 0;
				}
			}

			.logo-text {
				--form: hidden;

				@media (height >= 678px) {
					--form: half;
				}

				@media (height >= 765px) {
					--form: full;
				}
			}

			@media (height < 540px) {
				margin-top: -100%;
			}

			/* &.v-enter-from,
			&.v-leave-to {
				opacity: 0;

				.stripes {
					transform: none;
				}
			} */
		}

		.bottom ~ * {
			display: none;
		}

		.soft-button {
			--ripple-size: 40px;
		}
	}

	.person {
		@include square(40px);
		@include circle;
		overflow: hidden;

		&:has(svg) {
			background: c(gray-30);
		}

		> img {
			z-index: 1;
			width: 100%;
			aspect-ratio: 1 / 1;
			object-fit: cover;

			&:hover {
				scale: 125%;
			}

			&:not(:hover) {
				transition-duration: 1s;
			}
		}
	}

	@keyframes jump-in {
		from {
			translate: -$sidebar-width;
		}
	}
</style>
