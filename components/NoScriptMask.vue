<script lang="tsx">
	// 写个屁的 script，你写了它也不会跑的。

	export default defineComponent({
		render() {
			const styles = useCssModule();

			// 已知特性之一，使用 template 写会导入不进样式，只能用 tsx 写。
			return (
				<noscript>
					<div class={styles.mask}>
						<div class={styles.card}>
							<h1>JavaScript被禁用</h1>
							<a href="https://www.enable-javascript.com/" target="_blank">如何启用 JavaScript？</a>
						</div>
					</div>
				</noscript>
			);
			// BUG: 一旦包含 noscript 标签，会在控制台打印一个警告和一个错误，但不影响使用。
			// 目前还没查出是 vue 的问题还是 nuxt 的问题。找出问题来源后稍后去 GitHub 提 issue。
		},
	});
</script>

<style module lang="scss">
	.mask {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		width: 100vw;
		height: 100vh;
		padding: 6rem;
		background-color: c(white, 50%);
		backdrop-filter: blur(5px);
	}

	.card {
		@include square(100%);
		@include radius-large;
		padding: 2rem;
		background-color: c(white, 75%);

		h1 {
			margin: 0;
			color: c(accent);
		}
	}
</style>
