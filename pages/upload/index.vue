<script setup lang="ts">
	useHead({ title: t.upload });
	const file = ref<HTMLInputElement>();
	const dragover = ref(false);
	const uploaded = (files: File[]) => navigate("/upload/edit");
	const invalidUploaded = () => useEvent("app:toast", { message: "不支持上传所选文件！", severity: "error" });

	/**
	 * 获取合法的文件列表。
	 * @param fileList - 原生文件列表。
	 * @returns 合法的文件列表。
	 */
	function getValidFiles(fileList?: FileList | null) {
		if (!fileList || !fileList.length) return [];
		const files: File[] = [];
		for (const file of fileList)
			if (file.type.startsWith("video"))
				files.push(file);
		return files;
	}

	/**
	 * 拖放事件。
	 * @param e - 拖放事件。
	 */
	function onDrop(e: DragEvent) {
		dragover.value = false;
		const files = e.dataTransfer?.files;
		if (!files) return;
		const dropFiles = getValidFiles(files);
		if (dropFiles.length)
			uploaded(dropFiles);
		else if (files.length)
			invalidUploaded();
	}

	/**
	 * 上传文件事件。
	 * @param e - 普通事件。
	 */
	function onChangeFile(e: Event) {
		const input = e.target as HTMLInputElement;
		const files = getValidFiles(input.files);
		if (files.length)
			uploaded(files);
		else if (input.files?.length)
			invalidUploaded();
	}
</script>

<template>
	<div class="container">
		<ShadingIcon icon="upload" position="right top" />
		<HeadingGroup :name="t.upload" englishName="Upload" />
		<input
			ref="file"
			hidden
			type="file"
			multiple
			accept="video/*"
			@change="onChangeFile"
		/>
		
		<div class="upload-wrapper">
			<div
				class="upload"
				:class="{ dragover }"
				@dragover.stop.prevent="dragover = true"
				@dragenter.stop.prevent="dragover = true"
				@dragleave.stop.prevent="dragover = false"
				@dragend.stop.prevent="dragover = false"
				@drop.stop.prevent="onDrop"
				@click="file?.click()"
			>
				<div class="content">
					<h3>拖到此处上传</h3>
					<p>支持MP4、WMV、WEBM等主流格式</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		height: 100dvh;
		overflow: hidden;
	}

	.upload-wrapper {
		@include flex-center;
		flex-direction: column;
		height: 100%;
		margin-top: 1rem;
		
		.upload {
			@include flex-center;
			@include round-large;
			$color: c(gray-60);
			width: 100%;
			height: 350px;
			max-height: 100%;
			color: $color;
			text-align: center;
			border: 2px dashed $color;
			cursor: pointer;
			
			&.dragover {
				animation: shake 1s infinite;
			}
			
			h3 {
				margin-bottom: 8px;
				font-size: 36px;
			}
		}
	}
	
	@keyframes shake {
		0% {
			transform: translate(1px, 1px) rotate(0);
		}

		10% {
			transform: translate(-1px, -2px) rotate(-1deg);
		}

		20% {
			transform: translate(-3px) rotate(1deg);
		}

		30% {
			transform: translate(3px, 2px) rotate(0);
		}

		40% {
			transform: translate(1px, -1px) rotate(1deg);
		}

		50% {
			transform: translate(-1px, 2px) rotate(-1deg);
		}

		60% {
			transform: translate(-3px, 1px) rotate(0);
		}

		70% {
			transform: translate(3px, 1px) rotate(-1deg);
		}

		80% {
			transform: translate(-1px, -1px) rotate(1deg);
		}

		90% {
			transform: translate(1px, 2px) rotate(0);
		}

		100% {
			transform: translate(1px, -2px) rotate(-1deg);
		}
	}
</style>
