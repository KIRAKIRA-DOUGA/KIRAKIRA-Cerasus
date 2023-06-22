<script setup lang="ts">
	import kaomojis from "helpers/kaomojis";
	import { ShallowRef } from "nuxt/dist/app/compat/capi";
	import { Editor } from "@tiptap/vue-3";
	import Queue from "~/utils/queue";

	const flyout = refFlyout();
	const { show, hide } = useBaseComponentShowHide(flyout);
	const selected = ref<keyof typeof kaomojis>("happy");
	const tabs = computed(() => Object.keys(kaomojis));
	const transitionName = ref<"left" | "right" | "">("right");
	const editor = (inject("edt") as ShallowRef<Editor>).value;
	const kaomojiList = new Queue();
	kaomojiList.data = useHistoryKaomoji().kaomojis;

	watch(selected, (curSelected, prevSelected) => {
		const cur = tabs.value.indexOf(curSelected), prev = tabs.value.indexOf(prevSelected);
		transitionName.value = cur > prev ? "right" : cur < prev ? "left" : "";
	});

	defineExpose({
		show, hide,
	});
	/**
	 * 富文本编辑器输入函数
	 * @param str 输入的字符串
	*/
	function enter(str:string) {
		kaomojiList.join(str);
		if (kaomojiList.data.length >= 5)
			delete kaomojiList.data[4];
		editor.commands.focus();
		editor.commands.insertContent(str);
	}
</script>

<template>
	<Flyout ref="flyout" noPadding>
		<Comp>
			<TabBar v-model="selected">
				<TabItem v-for="tab in tabs" :id="tab" :key="tab">{{ t[tab] }}</TabItem>
			</TabBar>
			<Transition :name="transitionName" mode="out-in" appear>
				<div :key="selected" class="grid">
					<Button v-for="i in kaomojis[selected]" :key="i" class="kaomoji" @click="enter(i)">{{ i }}</Button>
				</div>
			</Transition>
		</Comp>
	</Flyout>
</template>

<style scoped lang="scss">
	$padding: 0.75rem 1rem;
	$width: 400px;
	$height: 350px;

	:comp {
		width: $width;
		overflow: hidden;
	}

	.tab-bar {
		padding: $padding;
		padding-bottom: 1rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 6px;
		max-height: $height;
		padding: $padding;
		padding-top: 0.25rem;
		overflow-y: auto;

		&.right-enter-active,
		&.left-enter-active {
			transition: all $ease-out-smooth 600ms !important;
		}

		&.right-leave-active,
		&.left-leave-active {
			transition: all $ease-in-smooth 100ms !important;
		}

		&.right-enter-from,
		&.left-leave-to {
			translate: 2rem;
			opacity: 0;
		}

		&.right-leave-to,
		&.left-enter-from {
			translate: -2rem;
			opacity: 0;
		}
	}

	.kaomoji {
		@include chip-shadow;
		@include radius-small;
		display: flex;
		width: 100%;
		height: 24px;
		color: c(text-color);
		background-color: c(main-bg);

		@media (any-hover: hover) {
			&:hover {
				@include button-shadow-unchecked-hover;
				background-color: c(gray-20);
			}

			&:hover:focus {
				@include button-shadow-unchecked-hover-focus;
			}
		}

		&:active {
			background-color: c(gray-20);
		}

		&:focus {
			@include button-shadow-unchecked-focus;
		}
	}
</style>
