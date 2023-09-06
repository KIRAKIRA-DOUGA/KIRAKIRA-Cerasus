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
	<LocaleLink ref="localeLink" v-ripple activable :to="href || '#'" class="bottom-nav-item lite">
		<Icon :name="icon" />
		<Transition @enter="onLabelEnter" @leave="onLabelLeave">
			<label v-if="active"><slot></slot></label>
		</Transition>
	</LocaleLink>
</template>

<style scoped lang="scss">
	a:comp {
		@include square(128px);
		@include circle;
		@include flex-center;
		position: relative;
		color: c(icon-color);
		
		&:any-hover {
			color: c(gray-50);
		}
		
		> * {
			position: relative;
			z-index: 1;
		}
		
		.icon {
			font-size: 24px;
		}
		
		label {
			margin-left: 5px;
			font-weight: bold;
			font-size: 16px;
			white-space: nowrap;
		}
			
		&::before {
			@include oval;
			position: absolute;
			width: 40%;
			height: 36px;
			background-color: transparent;
			transition-duration: 600ms;
			content: "";
		}

		&.router-link-active {
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
