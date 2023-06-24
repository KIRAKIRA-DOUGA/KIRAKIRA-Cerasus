<docs>
	# 迷你颜文字浮窗
</docs>

<script setup lang="ts">
	const emits = defineEmits<{
		insert: [text: string];
		escape: [];
	}>();

	const grid = ref<HTMLDivElement>();
	const { ref: flyout, show: baseShow, hide } = useBaseComponentShowHide();
	const show = async (...args: unknown[]) => {
		await baseShow(...args);
		(grid.value?.children[0] as HTMLElement)?.focus();
	};
	const recentKaomoji = useRecentKaomojiStore();
	const selectedItem = () => grid.value?.querySelector(":focus"); // 使用 computed 时结果会出错，为什么？

	defineExpose({
		show, hide,
	});

	/**
	 * 移动选中位置。
	 * @param displacement - 位移值，正数为右，负数为左。
	 */
	function moveSelectedPosition(displacement: number) {
		const current = elementIndex(selectedItem());
		const length = grid.value?.childElementCount ?? 0;
		if (!length) return;
		let newIndex = 0;
		if (current !== -1) {
			newIndex = current;
			newIndex += displacement;
			newIndex = PNMod(newIndex, length);
		}
		(grid.value?.children[newIndex] as HTMLElement)?.focus();
	}

	/**
	 * 插入颜文字回调函数。
	 * @param kaomoji - 输入的颜文字。
	 */
	function input(kaomoji: string) {
		emits("insert", kaomoji);
		recentKaomoji.add(kaomoji);
		hide();
	}

	/**
	 * 按下键盘事件。
	 * @param e - 键盘事件。
	 */
	function onKeydown(e: KeyboardEvent) {
		switch (e.code) {
			case "Escape":
				hide();
				emits("escape");
				break;
			case "ArrowRight":
				moveSelectedPosition(1);
				break;
			case "ArrowLeft":
				moveSelectedPosition(-1);
				break;
			// 我没有 case "Enter" 哦，它直接就可以用。
			default:
				break;
		}
	}
</script>

<template>
	<Flyout ref="flyout">
		<Comp>
			<div ref="grid" class="grid" @keydown="onKeydown">
				<FlyoutKaomojiButton
					v-for="(kaomoji, index) in recentKaomoji.kaomojis"
					:key="kaomoji"
					v-i="index"
					highlighted
					@click="input(kaomoji)"
				>{{ kaomoji }}</FlyoutKaomojiButton>
			</div>
		</Comp>
	</Flyout>
</template>

<style scoped lang="scss">
	$button-width: 120px;
	
	.grid {
		display: flex;
		gap: 6px;
	}

	.flyout-kaomoji-button {
		width: $button-width;
		animation: float-left 500ms calc(var(--i) * 100ms) $ease-out-max backwards;
	}
	
	@keyframes float-left {
		from {
			translate: 40px;
			opacity: 0;
		}
	}
</style>
