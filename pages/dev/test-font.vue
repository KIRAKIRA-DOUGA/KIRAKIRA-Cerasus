<script setup lang="ts">
	useHead({ title: "Font Test" });
	const size = ref(24);
	const weight = ref(400);
	const opsz = ref(10);
	const lang = ref("zh-Hans-CN");
	const isForceFontFamily = ref(false);
	const forceFontFamily = ref("sans-serif");
</script>

<template>
	<div class="container">
		<span>提示：以下文字可以直接编辑。</span>
		<p
			:contenteditable="true"
			class="text"
			:lang
			:style="{
				fontSize: size + 'px',
				fontWeight: weight,
				fontFamily: isForceFontFamily ? forceFontFamily : undefined,
			}"
		>
			返
			<br />
			造直羽信令神
			<br />
			The quick brown fox jumps over a lazy dog.
		</p>
		<section>
			<span>语言</span>
			<Segmented v-model="lang">
				<SegmentedItem id="zh-Hans-CN">简中</SegmentedItem>
				<SegmentedItem id="zh-Hant-TW">繁中</SegmentedItem>
				<SegmentedItem id="ja">日</SegmentedItem>
				<SegmentedItem id="ko">韩</SegmentedItem>
				<SegmentedItem id="en">英</SegmentedItem>
				<SegmentedItem id="vi">越</SegmentedItem>
				<SegmentedItem id="id">印尼</SegmentedItem>
			</Segmented>
		</section>

		<section>
			<span>大小</span>
			<TextBox v-model="size" type="number" :min="0" :max="128" />
			<Slider v-model="size" :min="0" :max="128" :step="1" :defaultValue="24" />
		</section>
		<section>
			<span>字重</span>
			<TextBox v-model="weight" type="number" :min="1" :max="1000" />
			<Slider v-model="weight" :min="1" :max="1000" :step="1" :defaultValue="400" />
		</section>
		<section>
			<span>光学尺寸</span>
			<TextBox v-model="opsz" type="number" :min="1" :max="50" />
			<Slider v-model="opsz" :min="1" :max="50" :step="1" :defaultValue="10" />
		</section>
		<section>
			<ToggleSwitch v-model="isForceFontFamily">强制字体家族</ToggleSwitch>
			<TextBox v-model="forceFontFamily" v-if="isForceFontFamily" />
		</section>
	</div>
</template>

<style scoped lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		gap: 24px;

		> span {
			color: c(icon-color);
		}
	}

	.segmented {
		width: 100%;
	}

	section {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;

		> * {
			flex-grow: 1;
		}

		.slider {
			margin-top: -8px;
			margin-bottom: -8px;
		}
	}

	.text {
		display: flex;
		flex-direction: column;
		min-height: 150px;
		transition: none;
	}
</style>
