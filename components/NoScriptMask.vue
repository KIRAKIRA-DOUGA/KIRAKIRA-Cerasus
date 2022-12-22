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
		width: 100%;
		height: 100%;
		padding: 2rem;
		background-color: c(white, 75%);
		border-radius: 6px;

		h1 {
			margin: 0;
			color: c(accent);
		}
	}
</style>
