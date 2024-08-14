<docs>
	# 用户头像
</docs>

<script setup lang="ts">
	const props = defineProps<{
		/** 头像网址。 */
		avatar?: string;
		/**
		 * 点击后跳转到链接。
		 * @deprecated
		 */
		link?: string;
		/** 用户 UID。 */
		uid?: Readable;
	}>();

	const userLink = computed(() => {
		const uid = props.uid === undefined ? NaN : Number(props.uid); // 不要用一元加号运算符！
		return Number.isFinite(uid) ? `/user/${uid}` : props.link;
	});

	const provider = computed(() => props.avatar?.startsWith("blob:http") ? undefined : "kirakira");
</script>

<template>
	<Comp v-ripple>
		<NuxtImg
			v-if="avatar"
			:provider
			:src="avatar"
			alt="avatar"
			draggable="false"
			format="avif"
			width="100"
			height="100"
			:placeholder="[20, 20, 100, 2]"
		/>
		<Icon v-else name="person" />
		<div v-if="avatar" class="tint-overlay"></div>
		<LocaleLink v-if="userLink" :to="userLink" :draggable="false" class="lite" />
	</Comp>
</template>

<style scoped lang="scss">
	@layer props {
		:comp {
			/// 显式触发悬停效果？
			--hover: false;
			/// 着色？
			--tint: false;
		}
	}

	@layer utilities {
		:comp {
			@include square(58px, true);
			font-size: calc(var(--size) * 0.6);
		}
	}

	@mixin hover {
		scale: 125%;
		filter: brightness(0.85);
	}

	:comp {
		@include circle;
		@include flex-center;
		position: relative;
		flex-shrink: 0;
		overflow: clip;
		color: c(icon-color);
		background-color: c(gray-20);
		cursor: pointer;

		.colored-sidebar & {
			background-color: c(main-bg, 20%);

			&:any-hover {
				background-color: c(main-bg, 40%);
			}

			.icon {
				color: white;
			}
		}

		> img {
			@include square(100%);
			z-index: 1;
			object-fit: cover;

			&:any-hover,
			&:has(~ a:any-hover) {
				@include hover;
			}

			@container style(--hover: true) {
				@include hover;
				transition-duration: 250ms !important;
			}

			&:not(:any-hover):is(:not(:has(~ a)), :has(~ a:not(:any-hover))) {
				transition-duration: 1s;
			}
		}

		.tint-overlay {
			position: absolute;
			inset: 0;
			z-index: 1;
			background-color: c(accent);
			opacity: 0;
			visibility: hidden;
			mix-blend-mode: color;

			@container style(--tint: true) {
				opacity: 1;
				visibility: visible;
			}
		}

		&:any-hover {
			background-color: c(gray-30);
		}

		a {
			@include square(100%);
			position: absolute;
			z-index: 3;
		}
	}
</style>
