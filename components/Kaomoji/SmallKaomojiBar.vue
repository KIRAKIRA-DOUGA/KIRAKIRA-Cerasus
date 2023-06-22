<script setup lang="ts">
	const kaomojis = useHistoryKaomoji().kaomojis;
	const selectedPosition = ref(0);
	const smallKaomojiBar = ref<HTMLElement>();
	const editor = inject<ShallowRef<Editor>>("editor")!;
	const input = editor.value;

	useEventListener("window", "keydown", e => {
		if (e.code === "ArrowRight")
			selectedPosition.value++;
		if (e.code === "ArrowLeft")
			selectedPosition.value--;
		if (e.code === "Enter")
			enter(selectedPosition.value + 1);
		if (e.code === "Escape") {
			input.commands.focus();
			kill(smallKaomojiBar);
		}
		if (selectedPosition.value > 3)
			selectedPosition.value = 0;
		if (selectedPosition.value < 0)
			selectedPosition.value = 3;
	});

	/**
	 * 输入函数。
	 * @param index 索引。
	 */
	function enter(index: number) {
		selectedPosition.value = index - 1;
		input.commands.insertContent(kaomojis[index - 1]);
		kill(smallKaomojiBar);
		input.commands.focus();
	}

	onMounted(() => {
		input.commands.blur();
	});
</script>

<template>
	<div ref="smallKaomojiBar" class="small-kaomoji-bar" autofocus>
		<div class="pointer" :style="{ 'margin-left': (-272 + 181.5 * selectedPosition) + 'px' }" />
		<Button v-for="n in 4" :key="n" class="kaomoji" @click="enter(n)">{{ kaomojis[n - 1] }}</Button>
	</div>
</template>

<style scoped lang="scss">
	.small-kaomoji-bar {
		@include dropdown-flyouts;
		@include radius-large;
		display: flex;
		justify-content: center;
		width: 370px;
		height: 40px;
		background-color: c(acrylic-bg);
	}

	.kaomoji {
		@include chip-shadow;
		@include radius-small;
		display: flex;
		width: 87px;
		height: 24px;
		margin: 2px;
		color: c(text-color);
		font-size: 0.5em;
		background-color: c(main-bg);
	}

	.pointer {
		@include chip-shadow;
		@include radius-small;
		position: absolute;
		z-index: 10;
		width: 10px;
		height: 10px;
		margin-top: 33px;
		background-color: c(accent);
		transition: 0.3s;
		rotate: 45deg;
	}
</style>
