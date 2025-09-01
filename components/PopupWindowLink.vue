<script lang="tsx">
	export default (({ href }, { slots, attrs: { href: _, ...attrs } }) => {
		async function popupWindow(url: string) {
			if ("documentPictureInPicture" in window) {
				const pipWindow = await window.documentPictureInPicture.requestWindow({
					width: window.innerWidth,
					height: window.innerHeight,
					disallowReturnToOpener: true,
				});
				const iframe = document.createElement("iframe");
				iframe.src = url;
				assign(iframe.style, {
					position: "absolute",
					inset: "0",
					border: "none",
					width: "100vw",
					height: "100vh",
				});
				pipWindow.document.body.append(iframe);
			} else
				window.open(url, document.title, "toolbar=no,location=no,directories=no,menubar=no,scrollbars=yes,resizable=no,status=no");
		}

		return (
			<a {...attrs} onClick={withModifiers(e => popupWindow(href), ["stop"])}>
				{slots.default?.()}
			</a>
		);
	}) as VueJsx<{
		/** 超链接。 */
		href: string;
	}>;
</script>
