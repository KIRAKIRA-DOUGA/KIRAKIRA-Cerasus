<docs>
	UP 主为你比🖤🖤！
</docs>

<script setup lang="ts">
	const props = defineProps<{
		hidden?: boolean;
	}>();

	const hover = ref(false);

	/**
	 * 在元素被插入到 DOM 之后的下一帧被调用。
	 * 用这个来开始进入动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onContentEnter(el: Element, done: () => void) {
		await animateSize(el, null, { startWidth: 0 });
		done();
	}

	/**
	 * 在离开过渡开始时调用。
	 * 用这个来开始离开动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onContentLeave(el: Element, done: () => void) {
		await animateSize(el, null, { endWidth: 0 });
		done();
	}
</script>

<template>
	<Transition>
		<kira-component v-if="!hidden" class="lovin" @mouseenter="hover = true" @mouseleave="hover = false">
			<!-- 谨记：这里有个坑。要用 mouseenter 和 mouseleave，千万不要用 mouseover 和 mouseout。 -->
			<NuxtIcon name="heart" />
			<Transition :css="false" @enter="onContentEnter" @leave="onContentLeave">
				<span v-show="hover" class="text">{{ t.uploader_lovin_it }}</span>
			</Transition>
		</kira-component>
	</Transition>
</template>

<i18n lang="json5">
{
	zh: {
		uploader_lovin_it: "UP主爱啦",
	},
	en: {
		uploader_lovin_it: "Uploader's lovin' it",
	},
	ja: {
		uploader_lovin_it: "うP主はそれが好きです",
	},
}
</i18n>

<style scoped lang="scss">
	.lovin {
		@include radius-small;
		display: inline-flex;
		align-items: center;
		height: 24px;
		padding: 6px;
		color: c(accent);
		font-weight: 500;
		background-color: c(accent-10);

		.dark & {
			color: c(icon-color);
		}

		.nuxt-icon {
			font-size: 16px;
		}

		.text {
			margin-left: 4px;
			overflow: hidden;
			white-space: nowrap;
		}

		&.v-enter-from,
		&.v-leave-to {
			scale: 0.8;
			opacity: 0;
		}
	}
</style>
