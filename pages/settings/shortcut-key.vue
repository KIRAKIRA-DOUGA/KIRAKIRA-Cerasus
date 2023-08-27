<script setup lang="ts">

</script>

<template>
	<Subheader icon="keyboard">{{ t.shortcut_key_guide }}</Subheader>
	<div class="table">
		<!-- #region 播放页 -->
		<h3>播放页</h3>

		<p>播放/暂停</p>
		<p><kbd>Space</kbd></p>

		<p>退出全屏</p>
		<p><kbd>Esc</kbd></p>
		<!-- #endregion -->

		<!-- #region 分页器 -->
		<h3>分页器</h3>

		<p>翻页</p>
		<p><kbd>←</kbd> <kbd>→</kbd></p>
		<!-- #endregion -->

		<!-- #region 评论区 -->
		<h3>评论区</h3>

		<p>加粗</p>
		<p><kbd>Ctrl</kbd> + <kbd>B</kbd></p>

		<p>倾斜</p>
		<p><kbd>Ctrl</kbd> + <kbd>I</kbd></p>

		<p>下划线</p>
		<p><kbd>Ctrl</kbd> + <kbd>U</kbd></p>

		<p>删除线</p>
		<p><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>X</kbd></p>

		<p>快捷插入颜文字</p>
		<p><kbd>Ctrl</kbd> + <kbd>M</kbd></p>

		<p>发送</p>
		<p><kbd>Ctrl</kbd> + <kbd>Enter</kbd></p>
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
