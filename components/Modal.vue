<docs>
	可拖动模态框
</docs>

<script setup lang="ts">
	import { numbers } from "virtual:scss-var:theme/_variables";

	const props = withDefaults(defineProps<{
		/** 已打开，单向绑定使用。 */
		open?: boolean;
		/** 标题。 */
		title?: string;
		/** 聚焦内容。是否**不要**单击空白处关闭。 */
		static?: boolean;
		/** 应用图标。 */
		icon?: DeclaredIcons;
		/** 不显示标题部分。 */
		hideTitle?: boolean;
		/** 不显示页脚部分 */
		hideFooter?: boolean;
		/** 不显示标题中的关闭按钮 */
		hideTitleCloseIcon?: boolean;
	}>(), {
		title: "",
		icon: "colored-logo/kirakira",
		hideTitleCloseIcon: false,
	});

	const model = defineModel<boolean>();
	const open = withOneWayProp(model, () => props.open);

	const modal = refComp();

	watch(open, async open => {
		await nextTick();
		if (open && modal.value)
			modal.value.focus(); // 打开模态时自动聚焦。
	}, { immediate: true });

	const windowSize = useWindowSize();
	const isMobile = computed(() => windowSize.width.value <= numbers.mobileMaxWidth);

	watch(isMobile, isMobile => {
		if (isMobile && modal.value)
			modal.value.style.translate = "0";
	}, { immediate: true });

	/**
	 * 拖拽模态逻辑处理。
	 * @param e - 指针事件（包括鼠标和触摸）。
	 */
	function onTitleBarDown(e: PointerEvent) {
		if (!modal.value) return;
		const { pageX: startX, pageY: startY } = e;
		const { x: originalX, y: originalY } = getTranslate(modal.value);
		modal.value.style.transition = "none";
		let mobileNewY = e.pageY - startY + originalY;
		const pointerMove = (e: PointerEvent) => {
			if (!modal.value) return;
			if (isMobile.value) {
				mobileNewY = Math.max(e.pageY - startY + originalY, 0);
				modal.value.style.translate = `0 ${mobileNewY}px`;
			} else
				modal.value.style.translate = `${e.pageX - startX + originalX}px ${e.pageY - startY + originalY}px`;
		};
		const pointerUp = (_e: PointerEvent) => {
			document.removeEventListener("pointermove", pointerMove);
			document.removeEventListener("pointerup", pointerUp);
			if (!modal.value) return;
			modal.value.style.transition = "";
			if (!isMobile.value) return;
			if (mobileNewY > modal.value.offsetHeight * 0.25)
				open.value = false;
			else
				modal.value.style.translate = "0";
		};
		document.addEventListener("pointermove", pointerMove);
		document.addEventListener("pointerup", pointerUp);
	}

	/**
	 * 获取平移值。
	 * @param el - HTML DOM 元素。
	 * @returns 平移值。
	 */
	function getTranslate(el: HTMLElement) {
		const translateCss = getComputedStyle(el).translate;
		const translateCssTuple = translateCss.split(" ");
		const translateCssNumberTuple = [] as number[];
		for (let i = 0; i < 2; i++) {
			let item = translateCssTuple[i];
			if (item === undefined || item === "" || item === "none")
				item = "0px";
			translateCssNumberTuple[i] = parseFloat(item);
		}
		const [x, y] = translateCssNumberTuple;
		return { x, y };
	}
</script>

<template>
	<Teleport to="#popovers">
		<Transition>
			<Comp
				v-if="open"
				ref="modal"
				tabindex="0"
				role="dialog"
				aria-modal="true"
				:aria-label="title"
			>
				<div class="titlebar">
					<div class="title" :class="{ hide: hideTitle }" @pointerdown="onTitleBarDown">
						<Icon :name="icon" :filled="icon.startsWith('colored-')" @dblclick="open = false" />
						<span>{{ title }}</span>
					</div>
					<button v-if="!hideTitleCloseIcon" class="close-button" :aria-label="t.step.close" @click="open = false">
						<Icon name="close" />
					</button>
				</div>
				<ScrollContainer>
					<div class="content">
						<slot><em>This is an empty Modal dialog.</em></slot>
					</div>
					<div v-if="!hideFooter" class="footer">
						<div class="left">
							<slot name="footer-left"></slot>
						</div>
						<div class="right">
							<slot name="footer-right">
								<Button class="secondary" @click="open = false">{{ t.step.cancel }}</Button>
								<Button @click="open = false">{{ t.step.ok }}</Button>
							</slot>
						</div>
					</div>
				</ScrollContainer>
			</Comp>
		</Transition>
	</Teleport>
</template>

<style scoped lang="scss">
	$padding: 24px;
	$titlebar-thickness: 48px;

	:comp {
		@include dropdown-flyouts;
		@include set-max-size;
		@include acrylic-background;
		overflow: clip;
		translate: none;
		transition: $fallback-transitions, all $ease-out-max 400ms;

		@include not-mobile {
			@include absolute-center(fixed, false); // TODO: 修改密码模态框出现模糊情况。
			@include round-large;
			transform-origin: top left;

			&.v-enter-from {
				scale: 1.1;
				opacity: 0;
			}

			&.v-leave-to {
				scale: 0.9;
				opacity: 0;
			}

			&.v-leave-active {
				transition: $fallback-transitions, all $ease-in-smooth 150ms;
			}
		}

		@include mobile {
			top: unset;
			bottom: 0;
			width: 100dvw;

			&.v-enter-from,
			&.v-leave-to {
				translate: 0 100% !important;
			}

			&.v-enter-active {
				transition: $fallback-transitions, all $ease-out-smooth 600ms;
			}

			&.v-leave-active {
				transition: $fallback-transitions, all $ease-out-max 200ms;
			}
		}

		&:not(:focus, :focus-within) {
			@include dropdown-flyouts-unfocus;
			background-color: c(acrylic-bg, 60%);

			.titlebar {
				.title,
				.close-button {
					opacity: 0.75;
				}

				.title {
					color: c(icon-color);
				}
			}
		}

		.titlebar {
			@include flex-center;
			justify-content: space-between;
			height: $titlebar-thickness;
			background-color: c(main-bg, 45%);

			.title {
				display: flex;
				align-items: center;
				width: 100%;
				height: 100%;
				padding-left: 14px;
				color: c(text-color);
				touch-action: pinch-zoom;

				&.hide {
					opacity: 0;
				}

				.icon {
					margin-right: 10px;
					font-size: 20px;
				}
			}

			.close-button {
				@include flex-center;
				@include square($titlebar-thickness);
				position: relative;
				flex-shrink: 0;
				color: c(icon-color);
				font-size: 24px;

				&,
				* {
					transition: $fallback-transitions, color 10ms, fill 10ms, rotate 350ms $ease-out-smooth;
				}

				.icon {
					@include enable-hardware-3d;
				}

				&::after {
					@include square(32px);
					@include round-small;
					@include absolute-center-sized;
					content: "";
					background-color: c(hover-overlay);
					opacity: 0;
				}

				&:hover {
					color: c(red);

					&::after {
						opacity: 1;
					}

					// .icon { // 我真心觉得关闭图标旋转的动画很丑，关闭、清除等按钮应该表现为朴素而不显眼，而不是让用户觉得“好玩”的地方。
					// 	rotate: 90deg;
					// }
				}

				&:hover:active {
					scale: 0.93;
					opacity: 0.7;
				}
			}
		}

		.scroll-container:deep(> .scroller > .content) {
			max-width: 100dvw;
			max-height: calc(100dvh - $titlebar-thickness);
		}

		.content {
			@include card-in-card-shadow;
			display: flex;
			padding: calc($padding / 3) $padding $padding;
			overflow: scroll;
			background-color: c(main-bg, 45%);

			@include mobile {
				padding: 8px 16px 16px;
			}
		}

		.footer {
			@include flex-center;
			justify-content: space-between;
			padding: 18px $padding;

			@include mobile {
				padding: 14px 16px;
			}

			> * {
				@include flex-center;
				gap: 8px;
			}
		}
	}
</style>
