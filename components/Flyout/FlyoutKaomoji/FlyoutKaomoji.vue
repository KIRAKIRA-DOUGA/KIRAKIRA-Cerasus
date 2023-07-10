<script setup lang="ts">
	import kaomojis from "helpers/kaomojis";

	const emits = defineEmits<{
		insert: [text: string];
	}>();

	const model = defineModel<FlyoutModel>();
	const RECENT_ID = "recent";
	const selected = ref<keyof typeof kaomojis | typeof RECENT_ID>("happy");
	const tabs = computed(() => Object.keys(kaomojis));
	const transitionName = ref<"left" | "right" | "">("right");
	const recentKaomoji = useRecentKaomojiStore();
	const kaomojiList = computed(() => selected.value === RECENT_ID ? recentKaomoji.kaomojis : kaomojis[selected.value]);
	const placement = ref<Placement>();

	watch(selected, (curSelected, prevSelected) => {
		const cur = tabs.value.indexOf(curSelected), prev = tabs.value.indexOf(prevSelected);
		transitionName.value = cur > prev ? "right" : cur < prev ? "left" : "";
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
	<Flyout v-model="model" noPadding @beforeShow="p => placement = p">
		<Comp :class="[placement]">
			<TabBar v-model="selected">
				<TabItem :id="RECENT_ID" icon="time" />
				<TabItem v-for="tab in tabs" :id="tab" :key="tab">{{ t[tab] }}</TabItem>
			</TabBar>
			<div>
				<Transition :name="transitionName" mode="out-in">
					<div :key="selected" class="grid">
						<FlyoutKaomojiButton v-for="i in kaomojiList" :key="i" @click="input(i)">{{ i }}</FlyoutKaomojiButton>
					</div>
				</Transition>
			</div>
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
	}
	
	@for $j from 1 through 2 {
		$placement: if($j == 1, top, bottom);
		$keyframes-name: if($j == 1, float-up, float-down);
		$direction: if($j == 1, 1, -1);
		$length: 2;
		
		@for $i from 1 through $length {
			$delay: if($j == 1, $i, $length + 1 - $i);
			
			:comp.#{$placement} > :nth-child(#{$i}) {
				animation: #{$keyframes-name} 600ms #{$delay * 100ms} $ease-out-expo backwards;
			}
		}
		
		@keyframes #{$keyframes-name} {
			from {
				opacity: 0;
				translate: 0 #{$direction * 200px};
			}
		}
	}
</style>
