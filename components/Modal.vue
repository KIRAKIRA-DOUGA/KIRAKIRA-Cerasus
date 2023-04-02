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
	}>(), {
		title: "",
	});

	const emits = defineEmits<{
		(event: "update:modelValue", open: boolean): void;
	}>();

	const open = computed({
		get: () => !!(props.modelValue ?? props.open),
		set: value => emits("update:modelValue", value),
	});

	const modal = ref<HTMLDivElement>();

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
			<div v-if="open" ref="modal" class="modal">
				<div class="titlebar">
					<div class="title" @pointerdown="onTitleBarDown">{{ title }}</div>
					<div class="close-button" @click="open = false">
						<NuxtIcon name="close" />
					</div>
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
	$padding: 16px;
	$titlebar-thickness: 36px;

	.modal {
		@include absolute-center(fixed);
		@include dropdown-flyouts;
		@include flex-block;
		@include radius-large;
		overflow: hidden;
		background-color: c(acrylic-bg, 75%);
		transform: translate(-50%, -50%);
		transform-origin: left top;
		transition: $fallback-transitions, all $ease-out-max 500ms, translate 0ms;
		translate: none;

		&.modal-leave-active {
			transition: $fallback-transitions, all $ease-in-smooth 150ms;
		}

		&.modal-enter-from,
		&.modal-leave-to {
			opacity: 0;
			scale: 1.1;
		}

		.titlebar {
			@include flex-center;
			justify-content: space-between;
			height: $titlebar-thickness;

			.title {
				width: 100%;
				padding: 6px $padding;
			}

			.close-button {
				@include flex-center;
				width: $titlebar-thickness + 4px;
				height: 100%;
				font-size: 18px;

				&,
				* {
					transition: $fallback-transitions, color 0s, fill 0s;
				}

				&::before {
					@include square(24px);
					@include radius-small;
					position: absolute;
					background-color: transparent;
					content: "";
				}

				&:hover {
					color: c(red);

					&::before {
						background-color: c(hover-color);
					}
				}
			}
		}

		.content {
			padding: 6px $padding;
		}

		.footer {
			@include flex-center;
			justify-content: space-between;
			padding: $padding;

			> * {
				@include flex-center;
				gap: 8px;
			}
		}
	}
</style>
