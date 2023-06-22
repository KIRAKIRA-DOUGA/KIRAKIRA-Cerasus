<script setup lang="ts">
	import { useHistoryKaomoji } from "~/stores/history-kaomojis";
	import { ShallowRef } from "nuxt/dist/app/compat/capi";
	import { Editor } from "@tiptap/vue-3";
	import kill from "~/utils/kill";
	const kaomojis = useHistoryKaomoji().kaomojis;
	const selPos = ref(0);
	const smallKaomojiBar = ref<HTMLElement>();
	const editor = inject("edt");
	const input = (editor as ShallowRef<Editor>).value;

	useEventListener("window", "keydown", e => {
		if (e.code === "ArrowRight")
			selPos.value++;
		if (e.code === "ArrowLeft")
			selPos.value--;
		if (e.code === "Enter")
			enter(selPos.value + 1);
		if (e.code === "Escape") {
			input.commands.focus();
			kill(smallKaomojiBar);
		}
		if (selPos.value > 3)
			selPos.value = 0;
		if (selPos.value < 0)
			selPos.value = 3;
	});
	/**
	 * 输入函数。
	 * @param index 索引。
	*/
	function enter(index: number) {
		selPos.value = index - 1;
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
		<div class="pointer" :style="{ 'margin-left': (-272 + 181.5 * selPos) + 'px' }" />
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
