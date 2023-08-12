<script setup lang="ts">
	const content = ref("");
	const flyoutKaomoji = ref<FlyoutModel>();
	const flyoutKaomojiMini = ref<FlyoutModel>();
</script>

<template>
	<FlyoutKaomoji v-model="flyoutKaomoji" @insert="insertKaomoji" />
	<FlyoutKaomojiMini v-model="flyoutKaomojiMini" @insert="insertKaomoji" @escape="insertKaomoji" />

	<Comp role="textbox">
		<TextBox v-model="content" :placeholder="t.send_danmaku">
			<template #actions>
				<SoftButton icon="kaomoji" appearance="textbox-trailingicon" :active="!!flyoutKaomoji" @click.stop @click="e => flyoutKaomoji = [e, 'y']" />
				<SoftButton icon="text_format" appearance="textbox-trailingicon" @click.stop />
				<SoftButton icon="send" appearance="textbox-trailingicon" @click.stop />
			</template>
		</TextBox>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		display: flex;
		flex-shrink: 0;
		width: 100%;
		height: 36px;

		.text-box {
			--square: true;
			width: 100%;
		}
	}
</style>
