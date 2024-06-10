<script setup lang="ts">
	const props = defineProps<{
		/** 指定点击后跳转的链接。 */
		href?: string;
		/** 图标。 */
		icon: DeclaredIcons;
	}>();

	const localeLink = ref<InstanceType<typeof LocaleLink>>();
	const active = computed(() => props.href !== undefined && isCurrentPath(props.href));
	const [onLabelEnter, onLabelLeave] = simpleAnimateSize("width", 600);
</script>

<template>
	<LocaleLink ref="localeLink" activable :to="href || '#'" class="bottom-nav-item lite">
		<div>
			<div v-ripple>
				<Icon :name="icon" />
				<Transition @enter="onLabelEnter" @leave="onLabelLeave">
					<label v-if="active"><slot></slot></label>
				</Transition>
			</div>
		</div>
	</LocaleLink>
</template>

<style scoped lang="scss">
	$wrapper-size: 128px;
	$ripple-ratio: calc(64px / 58px);
	$ripple-size: calc(var(--wrapper-size) * $ripple-ratio);

	@layer props {
		a:comp {
			--wrapper-size: #{$wrapper-size};
			--ripple-size: #{$ripple-size};
		}
	}

	a:comp {
		@include flex-center;
		@include square(var(--wrapper-size));
		@include circle;
		min-width: 0;
		color: c(icon-color);

		> div {
			@include flex-center;
			@include ripple-clickable-only-inside(var(--wrapper-size));
			@include circle;
			touch-action: manipulation;

			> div {
				@include flex-center;
				@include square(var(--ripple-size));
				@include circle;
				flex-shrink: 0;
			}

			&:any-hover {
				background-color: c(hover-overlay);
			}
		}

		.icon {
			font-size: 24px;
		}

		label {
			margin-left: 5px;
			overflow: clip;
			font-size: 16px;
			font-weight: bold;
			white-space: nowrap;
		}

		&.router-link-active {
			@include accent-ripple;
			color: c(accent);

			.icon {
				font-size: 28px;
			}

			&::before {
				width: 80%;
				background-color: c(accent-10);
			}
		}
	}
</style>
