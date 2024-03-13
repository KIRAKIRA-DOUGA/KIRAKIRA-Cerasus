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

	let avatarImage = props.avatar;
	let miniAvatarImage: string;
	if (props.avatar && !isLocalStaticAssetUrl(props.avatar)) {
		avatarImage = `${props.avatar}/w=100`; // 用户头像
		miniAvatarImage = `${props.avatar}/w=50,blur=5`; // 用户头像缩略图
	}

	const userLink = computed(() => {
		const uid = props.uid === undefined ? NaN : Number(props.uid); // 不要用一元加号运算符！
		return Number.isFinite(uid) ? `/user/${uid}` : props.link;
	});
</script>

<template>
	<Comp v-ripple>
		<NuxtImg
			v-if="avatar"
			:src="avatarImage"
			alt="avatar"
			draggable="false"
			:placeholder="miniAvatarImage"
		/>
		<Icon v-else name="person" />
		<LocaleLink v-if="userLink" :to="userLink" :draggable="false" class="lite" />
	</Comp>
</template>

<style scoped lang="scss">
	@layer utilities {
		:comp {
			@include square(58px, true);
			font-size: calc(var(--size) * 0.6);
		}
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

		> img {
			@include square(100%);
			z-index: 1;
			object-fit: cover;

			&:any-hover,
			&:has(~ a:any-hover) {
				scale: 125%;
				filter: brightness(0.85);
			}

			&:not(:any-hover):is(:not(:has(~ a)), :has(~ a:not(:any-hover))) {
				transition-duration: 1s;
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
