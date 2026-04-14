<script setup lang="ts">
	const props = withDefaults(defineProps<{
		title?: string | Function;
		type?: "info" | "warning";
		lite?: boolean;
	}>(), {
		title: undefined,
		type: "info",
	});

	const icon = computed(() => ({
		info: "info",
		warning: "exclamation_circle",
	}[props.type]));
</script>

<template>
	<Comp :class="{ 'force-color yellow': type === 'warning', lite }">
		<Icon :name="icon" />
		<div class="content">
			<p v-if="title" class="title">{{ title }}</p>
			<p><slot></slot></p>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include round-large;
		@include chip-shadow;
		display: flex;
		gap: 8px;
		padding: 16px;
		color: white;
		background-color: c(accent);

		&:not(.lite):deep(a:any-link) {
			color: white;

			::selection {
				background-color: c(white, 50%);
			}
		}

		&.lite {
			color: c(text-color);
			background-color: c(surface-color);
		}
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 4px;
		text-align: start;

		&:lang-justify {
			text-align: justify;
		}

		:deep(*) {
			white-space: pre-line;
			user-select: text;
		}
	}

	.title {
		font-size: 16px;
		font-weight: bold;
	}

	.icon {
		font-size: 24px;
	}
</style>
