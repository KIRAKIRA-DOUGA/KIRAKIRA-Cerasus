<docs>
	可拖动模态框
</docs>

<script setup lang="ts">
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
		icon: "colored-logo/sakuranomiya",
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

	/**
	 * 拖拽模态逻辑处理。
	 * @param e - 指针事件（包括鼠标和触摸）。
	 */
	function onTitleBarDown(e: PointerEvent) {
		if (!modal.value) return;
		const { pageX: startX, pageY: startY } = e;
		const { x: originalX, y: originalY } = getTranslate(modal.value);
		const pointerMove = (e: PointerEvent) => {
			if (!modal.value) return;
			modal.value.style.translate = `${e.pageX - startX + originalX}px ${e.pageY - startY + originalY}px`;
		};
		const pointerUp = (_e: PointerEvent) => {
			document.removeEventListener("pointermove", pointerMove);
			document.removeEventListener("pointerup", pointerUp);
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
				<div class="body">
					<div class="titlebar">
						<div class="title" :class="{ hide: hideTitle }" @pointerdown="onTitleBarDown">
							<Icon :name="icon" :filled="icon.startsWith('colored-')" @dblclick="open = false" />
							<span>{{ title }}</span>
						</div>
						<button v-if="!hideTitleCloseIcon" class="close-button" :aria-label="t.step.close" @click="open = false">
							<Icon name="close" />
						</button>
					</div>
					<div class="content">
						<slot><em>这是一个空的模态框。</em></slot>
					</div>
				</div>
				<div v-if="!hideFooter" class="footer">
					<div class="left">
						<slot name="footer-left"></slot>
					</div>
					<div class="right">
						<slot name="footer-right">
							<Button class="secondary" @click="open = false">取消</Button>
							<Button @click="open = false">确定</Button>
						</slot>
					</div>
				</div>
			</Comp>
		</Transition>
	</Teleport>
</template>

<style scoped lang="scss">
	$padding: 24px;
	$titlebar-thickness: 48px;

	:comp {
		@include absolute-center(fixed);
		@include dropdown-flyouts;
		@include round-large;
		@include set-max-size;
		@include acrylic-background;
		overflow: clip;
		transform: translate(-50%, -50%); // TODO: 修改密码模态框出现模糊情况。
		transform-origin: left top;
		translate: none;
		transition: $fallback-transitions, all $ease-out-max 400ms, translate 0s;

		&.v-leave-active {
			transition: $fallback-transitions, all $ease-in-smooth 150ms;
		}

		&.v-enter-from,
		&.v-leave-to {
			scale: 1.1;
			opacity: 0;
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

		.body {
			@include card-in-card-shadow;
			background-color: c(main-bg, 45%);
		}

		.titlebar {
			@include flex-center;
			justify-content: space-between;
			height: $titlebar-thickness;

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

		.content {
			display: flex;
			padding: calc($padding / 3) $padding $padding;
		}

		.footer {
			@include flex-center;
			justify-content: space-between;
			padding: 18px $padding;

			> * {
				@include flex-center;
				gap: 8px;
			}
		}
	}
</style>
