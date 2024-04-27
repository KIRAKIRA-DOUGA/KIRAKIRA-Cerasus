<docs>
	# 电池图标
</docs>

<script setup lang="ts">
	const props = defineProps<{
		/** 当前电量，从 0 到 1。 */
		value: number;
		/** 是否正在充电？ */
		charging: boolean;
	}>();
</script>

<template>
	<svg class="icon icon-battery" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<mask id="mask_battery_charging">
			<rect fill="white" width="24" height="24" />
			<Transition name="charging">
				<path
					v-if="charging"
					d="M9.35889 8.49942V14.0204C9.35889 14.3578 9.63493 14.6338 9.97232 14.6338H11.1992V19.0199C11.1992 19.3327 11.6102 19.4431 11.7697 19.1732L14.9534 13.7136C15.1927 13.3026 14.8982 12.7935 14.4259 12.7935H13.0395L14.567 8.71413C14.7203 8.31539 14.4259 7.88599 13.9965 7.88599H9.97232C9.63493 7.88599 9.35889 8.16203 9.35889 8.49942Z"
					transform-origin="center"
					fill="black"
				/>
			</Transition>
		</mask>
		<g mask="url(#mask_battery_charging)">
			<path
				:opacity="value >= 1 ? 1 : 0.3"
				d="M9 4.00004V2.00002L15 2.00002V4.00004H16C17.1046 4.00004 18 4.89547 18 6.00004V20C18 21.1046 17.1046 22 16 22H8C6.89543 22 6 21.1046 6 20V6.00004C6 4.89547 6.89543 4.00004 8 4.00004H9Z"
			/>
			<mask
				id="mask_battery_percent"
				mask-type="alpha"
				maskUnits="userSpaceOnUse"
				x="6"
				y="2"
				width="90"
				height="20"
			>
				<path
					d="M9 4.00004V2.00002L15 2.00002V4.00004H16C17.1046 4.00004 18 4.89547 18 6.00004V20C18 21.1046 17.1046 22 16 22H8C6.89543 22 6 21.1046 6 20V6.00004C6 4.89547 6.89543 4.00004 8 4.00004H9Z"
				/>
			</mask>
			<g mask="url(#mask_battery_percent)">
				<rect
					class="percent"
					x="6"
					y="4"
					width="12"
					height="18"
					transform-origin="50% calc(100% - 2px)"
					:transform="`scale(1 ${value})`"
				/>
			</g>
		</g>
	</svg>
</template>

<style scoped lang="scss">
	svg {
		@include square(1em);
		fill: currentColor;
	}

	.charging-enter-from,
	.charging-leave-to {
		scale: 0;
	}
</style>
