<docs>
	可拖动模态框
</docs>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 已打开。 */
		modelValue?: boolean;
		/** 已打开，单向绑定使用。 */
		open?: boolean;
		/** 标题。 */
		title?: string;
		/** 聚焦内容。是否**不要**单击空白处关闭。 */
		static?: boolean;
		/** 应用图标。 */
		icon?: string;
	}>(), {
		title: "",
		icon: "sakuranomiya",
	});

	const emits = defineEmits<{
		(event: "update:modelValue", open: boolean): void;
	}>();

	const open = computed({
		get: () => !!(props.modelValue ?? props.open),
		set: value => emits("update:modelValue", value),
	});

	const modal = ref<HTMLDivElement>();

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
	<ClientOnlyTeleport to="#popovers">
		<Transition name="modal">
			<div v-if="open" ref="modal" class="modal" tabindex="0">
				<div class="titlebar">
					<div class="title" @pointerdown="onTitleBarDown">
						<NuxtIcon :name="icon" filled @dblclick="open = false" />
						<span>{{ title }}</span>
					</div>
					<button class="close-button" @click="open = false">
						<NuxtIcon name="close" />
					</button>
				</div>
				<div class="content">
					<slot><em>这是一个空的模态框。</em></slot>
				</div>
				<div class="footer">
					<div class="left">
						<slot name="footer-left"></slot>
					</div>
					<div class="right">
						<slot name="footer-right">
							<Button secondary @click="open = false">取消</Button>
							<Button @click="open = false">确定</Button>
						</slot>
					</div>
				</div>
			</div>
		</Transition>
	</ClientOnlyTeleport>
</template>

<style scoped lang="scss">
	$padding: 24px;

	.modal {
		@include absolute-center(fixed);
		@include dropdown-flyouts;
		@include flex-block;
		@include radius-large;
		max-width: 100dvw;
		overflow: hidden;
		background-color: c(acrylic-bg, 75%);
		transform: translate(-50%, -50%);
		transform-origin: left top;
		transition: $fallback-transitions, all $ease-out-max 400ms, translate 0s;
		translate: none;

		&.modal-leave-active {
			transition: $fallback-transitions, all $ease-in-smooth 150ms;
		}

		&.modal-enter-from,
		&.modal-leave-to {
			opacity: 0;
			scale: 1.1;
		}

		&:not(:focus, :focus-within) {
			@include dropdown-flyouts-unfocus;
			background-color: c(acrylic-bg, 60%);

			.titlebar {
				.title,
				.close-button {
					color: c(gray-50);
				}
			}
		}

		.titlebar {
			@include flex-center;
			justify-content: space-between;
			height: 28px;

			.title {
				display: flex;
				align-items: center;
				width: 100%;
				padding: 6px 0;
				font-size: 12px;
				touch-action: pinch-zoom;

				.nuxt-icon {
					margin-right: 10px;
					margin-left: 12px;
					font-size: 16px;
				}
			}

			.close-button {
				@include flex-center;
				position: relative;
				width: 45px;
				height: 100%;
				font-size: 18px;

				&,
				* {
					transition: $fallback-transitions, color 0s, fill 0s;
				}

				&::after {
					@include square(22px);
					@include radius-small;
					@include absolute-center-sized;
					background-color: c(hover-color);
					opacity: 0;
					content: "";
				}

				&:hover {
					color: c(red);

					&::after {
						opacity: 1;
					}
				}

				&:hover:active {
					opacity: 0.7;
				}
			}
		}

		.content {
			@include card-in-card-shadow;
			display: flex;
			padding: $padding $padding;
			background-color: c(main-bg, 45%);
		}

		.footer {
			@include flex-center;
			justify-content: space-between;
			padding: 12px $padding;

			> * {
				@include flex-center;
				gap: 8px;
			}
		}
	}
</style>
