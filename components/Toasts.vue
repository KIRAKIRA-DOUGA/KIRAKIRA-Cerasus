<docs>
	消息框
</docs>

<script setup lang="ts">
	import { ToastEvent } from "composables/toast";

	type ToastEventWithTimestamp = ToastEvent & { timestamp: number };
	const toastList = reactive<ToastEventWithTimestamp[]>([]);
	const TRANSLATE_VALUE = 10;

	useListen("app:toast", e => {
		const toast = e as ToastEventWithTimestamp;
		toast.severity ??= "success";
		toast.duration ??= 1000;
		toast.timestamp = new Date().valueOf();
		toastList.push(toast);
		setTimeout(() => arrayRemoveItem(toastList, e), e.duration);
	});

	/**
	 * 在元素被插入到 DOM 之后的下一帧被调用。
	 * 用这个来开始进入动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onToastEnter(el: Element, done: () => void) {
		await animateSize(el, null, { startHeight: 0, startStyle: { translate: `0 -${TRANSLATE_VALUE}px` } });
		done();
	}

	/**
	 * 在离开过渡开始时调用。
	 * 用这个来开始离开动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onToastLeave(el: Element, done: () => void) {
		await animateSize(el, null, { endHeight: 0, endStyle: { translate: `0 -${TRANSLATE_VALUE}px` }, easing: eases.easeInExpo });
		done();
	}
</script>

<template>
	<Teleport to="#popovers">
		<kira-component class="toasts">
			<TransitionGroup :css="false" appear @enter="onToastEnter" @leave="onToastLeave">
				<div v-for="toast in toastList" :key="toast.timestamp" class="toast" :class="[toast.severity]" :style="{ '--duration': toast.duration }">
					<div class="content">
						<NuxtIcon name="check" />
						<span>{{ toast.message || t.finish }}</span>
					</div>
					<div class="progress"></div>
				</div>
			</TransitionGroup>
		</kira-component>
	</Teleport>
</template>

<i18n lang="json5">
{
	zh: {
		finish: "操作成功完成",
	},
	en: {
		finish: "Operation successfully done",
	},
	ja: {
		finish: "操作が正常に完了しました",
	},
}
</i18n>

<style scoped lang="scss">
	.toasts {
		@include flex-center;
		flex-direction: column;
		width: 100%;
		margin-top: 12px;
		pointer-events: none;

		.toast {
			@include radius-small;
			@include toast-shadow-successful;
			--duration: 1000;
			position: relative;
			margin-top: 12px;
			overflow: hidden;
			color: c(green);
			background-color: c(acrylic-bg, 75%);

			.content {
				@include flex-center;
				gap: 8px;
				padding: 12px 16px;

				.nuxt-icon {
					margin-left: -2px;
					font-size: 24px;
				}
			}

			.progress {
				position: absolute;
				bottom: 0;
				left: 0;
				height: 2px;
				background-color: c(green);
				border-radius: 1px;
				animation: progressing calc(var(--duration) * 1ms) linear forwards;
			}
		}
	}

	@keyframes progressing {
		from {
			width: 0;
		}

		to {
			width: 100%;
		}
	}
</style>
