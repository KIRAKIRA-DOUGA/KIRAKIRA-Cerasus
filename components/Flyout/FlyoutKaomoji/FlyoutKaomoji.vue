<script setup lang="ts">
	import kaomojis from "helpers/kaomojis";

	const emits = defineEmits<{
		insert: [text: string];
	}>();

	const { ref: flyout, show, hide } = useBaseComponentShowHide();
	const RECENT_ID = "recent";
	const selected = ref<keyof typeof kaomojis | typeof RECENT_ID>("happy");
	const tabs = computed(() => Object.keys(kaomojis));
	const transitionName = ref<"left" | "right" | "">("right");
	const recentKaomoji = useRecentKaomojiStore();
	const kaomojiList = computed(() => selected.value === RECENT_ID ? recentKaomoji.kaomojis : kaomojis[selected.value]);

	watch(selected, (curSelected, prevSelected) => {
		const cur = tabs.value.indexOf(curSelected), prev = tabs.value.indexOf(prevSelected);
		transitionName.value = cur > prev ? "right" : cur < prev ? "left" : "";
	});

	defineExpose({
		show, hide,
	});

	/**
	 * 插入颜文字回调函数。
	 * @param kaomoji - 输入的颜文字。
	 */
	function input(kaomoji: string) {
		emits("insert", kaomoji);
		recentKaomoji.add(kaomoji);
	}
</script>

<template>
	<Flyout ref="flyout" noPadding>
		<Comp>
			<TabBar v-model="selected">
				<TabItem :id="RECENT_ID" icon="time" />
				<TabItem v-for="tab in tabs" :id="tab" :key="tab">{{ t[tab] }}</TabItem>
			</TabBar>
			<Transition :name="transitionName" mode="out-in" appear>
				<div :key="selected" class="grid">
					<FlyoutKaomojiButton v-for="i in kaomojiList" :key="i" @click="input(i)">{{ i }}</FlyoutKaomojiButton>
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
		align-content: flex-start;
		height: $height;
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
</style>
