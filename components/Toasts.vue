<docs>
	消息框
</docs>

<script setup lang="ts">
	import type { ToastEvent } from "composables/toast";

	type ToastEventWithTimestamp = ToastEvent & {
		timestamp: number;
		icon: DeclaredIcons;
	};
	const toastList = reactive<ToastEventWithTimestamp[]>([]);
	const TRANSLATE_VALUE = 50;
	const icons = new Map<ToastEvent["severity"] | undefined, DeclaredIcons>([
		["success", "check"],
		["warning", "exclamation"],
		["error", "close"],
		["info", "info"],
		[undefined, "info"],
	]);

	useListen("app:toast", e => {
		const toast = e as ToastEventWithTimestamp;
		toast.duration ??= 2000;
		toast.timestamp = new Date().valueOf();
		toast.icon = icons.get(toast.severity)!;
		toastList.push(toast);
		setTimeout(() => arrayRemoveItem(toastList, e), e.duration);
	});

	useListen("app:clearAllToast", () => {
		arrayClearAll(toastList);
	});

	/**
	 * 在元素被插入到 DOM 之后的下一帧被调用。
	 * 用这个来开始进入动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onToastEnter(el: Element, done: () => void) {
		await animateSize(el, null, { startHeight: 0, duration: 500, startStyle: { translate: `0 -${TRANSLATE_VALUE}px` } });
		done();
	}

	/**
	 * 在离开过渡开始时调用。
	 * 用这个来开始离开动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onToastLeave(el: Element, done: () => void) {
		await animateSize(el, null, { endHeight: 0, duration: 300, endStyle: { translate: `0 -${TRANSLATE_VALUE}px` }, easing: eases.easeInOutSmooth });
		done();
	}
</script>

<template>
	<Teleport to="#popovers">
		<Comp role="none">
			<TransitionGroup :css="false" appear @enter="onToastEnter" @leave="onToastLeave">
				<div
					v-for="toast in toastList"
					:key="toast.timestamp"
					class="toast"
					:class="[toast.severity]"
					:style="{ '--duration': toast.duration }"
					role="tooltip"
					aria-label="toast"
				>
					<div class="content">
						<Icon :name="toast.icon" />
						<span>{{ toast.message || t.toast.finish }}</span>
					</div>
					<div class="progress"></div>
				</div>
			</TransitionGroup>
		</Comp>
	</Teleport>
</template>

<style scoped lang="scss">
	:comp {
		@include flex-center;
		z-index: 60;
		flex-direction: column;
		width: 100%;
		margin-top: 12px;
		padding: 0 36px;
		pointer-events: none;

		.toast {
			@include round-small;
			@include toast-shadow(accent);
			@include acrylic-background;
			--duration: 2000;
			position: relative;
			margin-top: 12px;
			overflow: clip;

			.content {
				@include flex-center;
				gap: 8px;
				padding: 12px 16px;
				text-align: justify;

				.icon {
					margin-left: -2px;
					font-size: 24px;
				}
			}

			.progress {
				position: absolute;
				bottom: 0;
				left: 0;
				height: 2px;
				border-radius: 1px;
				animation: progressing calc(var(--duration) * 1ms) linear forwards;

				@media (prefers-reduced-motion: reduce) {
					display: none;
				}
			}

			&.success {
				@include toast-shadow(green);
			}

			&.warning {
				@include toast-shadow(yellow);
			}

			&.error {
				@include toast-shadow(red);
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
