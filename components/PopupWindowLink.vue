<script lang="tsx">
	export default (({ href }, { slots, attrs }) => {
		function popupWindow(url: string) {
			window.open(url, document.title, "toolbar=no,location=no,directories=no,menubar=no,scrollbars=yes,resizable=no,status=no");
		}

		return (
			<a {...attrs} href={href} target="_blank" onClick={withModifiers(e => popupWindow((e.currentTarget as HTMLAnchorElement).href), ["stop"])}>
				{slots.default?.()}
			</a>
		);
	}) as VueJsx<{
		/** 超链接。 */
		href: string;
	}>;
</script>
