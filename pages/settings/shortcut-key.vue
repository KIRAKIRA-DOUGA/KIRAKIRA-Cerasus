<script setup lang="tsx">
	import k1bod from "assets/audios/K1B0D.ogg";

	const sfx = ref<HTMLAudioElement>();
	const playSfx = () => {
		if (!sfx.value) return;
		sfx.value.currentTime = 0;
		sfx.value.play();
	};
	const Kbd = ((_, { slots }) => <kbd onClick={playSfx}>{slots.default?.()}</kbd>) as VueJsx;
	
	type Platform = "Windows" | "macOS" | "Linux";
	
	const platform = computed<Platform | undefined>(() => {
		if (environment.server) return;
		const { platform } = navigator;
		if (/(Mac|iPhone|iPod|iPad)/i.test(platform)) return "macOS";
		else if (/(Linux)/i.test(platform)) return "Linux";
		else if (/(Win)/i.test(platform)) return "Windows";
	});
	
	const Ctrl = computed(() => platform.value === "macOS" ? "Cmd" : platform.value === "Linux" ? "Control" : "Ctrl");
</script>

<template>
	<Subheader icon="keyboard">{{ t.guide }}</Subheader>
	<audio ref="sfx" :src="k1bod"></audio>
	<div class="table">
		<!-- #region 播放页 -->
		<h3>播放页</h3>

		<p>播放/暂停</p>
		<p><Kbd>Space</Kbd></p>

		<p>退出全屏</p>
		<p><Kbd>Esc</Kbd></p>
		<!-- #endregion -->

		<!-- #region 分页器 -->
		<h3>分页器</h3>

		<p>翻页</p>
		<p><Kbd>←</Kbd> <Kbd>→</Kbd></p>
		<!-- #endregion -->

		<!-- #region 评论区 -->
		<h3>评论区</h3>

		<p>加粗</p>
		<p><Kbd>{{ Ctrl }}</Kbd> + <Kbd>B</Kbd></p>

		<p>倾斜</p>
		<p><Kbd>{{ Ctrl }}</Kbd> + <Kbd>I</Kbd></p>

		<p>下划线</p>
		<p><Kbd>{{ Ctrl }}</Kbd> + <Kbd>U</Kbd></p>

		<p>删除线</p>
		<p><Kbd>{{ Ctrl }}</Kbd> + <Kbd>Shift</Kbd> + <Kbd>X</Kbd></p>

		<p>快捷插入颜文字</p>
		<p><Kbd>{{ Ctrl }}</Kbd> + <Kbd>M</Kbd></p>

		<p>发送</p>
		<p><Kbd>{{ Ctrl }}</Kbd> + <Kbd>Enter</Kbd></p>
		<!-- #endregion -->
	</div>
</template>

<style scoped lang="scss">
	h3 {
		color: c(accent);
	}

	.table {
		display: grid;
		grid-template-columns: repeat(2, auto);
		gap: 8px;
		align-items: center;

		h3 {
			grid-column-end: span 2;
			margin: 0.35rem 0 0.25rem;

			&:first-of-type {
				margin-top: 0;
			}
		}
	}
</style>
