<docs>
	电池图标。
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
			<rect v-if="charging" fill="white" width="24" height="24" />
			<rect v-else fill="white" width="24" height="24" />
			<Transition name="charging">
				<path
					v-if="charging"
					d="M11.9499 17.7303L14.5999 12.7303C14.6832 12.5637 14.6792 12.4013 14.5879 12.2433C14.4959 12.0847 14.3582 12.0053 14.1749 12.0053H12.9999V8.50532C12.9999 8.23865 12.8749 8.07599 12.6249 8.01732C12.3749 7.95932 12.1832 8.04699 12.0499 8.28032L9.39986 13.2803C9.31653 13.447 9.32087 13.6093 9.41287 13.7673C9.5042 13.926 9.64153 14.0053 9.82486 14.0053H10.9999V17.5053C10.9999 17.772 11.1249 17.9343 11.3749 17.9923C11.6249 18.051 11.8165 17.9637 11.9499 17.7303Z"
					transform-origin="center"
					fill="black"
				/>
			</Transition>
		</mask>
		<g mask="url(#mask_battery_charging)">
			<path
				:opacity="props.value >= 1 ? 1 : 0.3"
				d="M9 4C9 2.89543 9.89543 2 11 2H13C14.1046 2 15 2.89543 15 4H16C17.1046 4 18 4.89543 18 6V20C18 21.1046 17.1046 22 16 22H8C6.89543 22 6 21.1046 6 20V6C6 4.89543 6.89543 4 8 4H9Z"
			/>
			<mask
				id="mask_battery_percent"
				style="mask-type:alpha"
				maskUnits="userSpaceOnUse"
				x="6"
				y="2"
				width="90"
				height="20"
			>
				<path
					d="M9 4C9 2.89543 9.89543 2 11 2H13C14.1046 2 15 2.89543 15 4H16C17.1046 4 18 4.89543 18 6V20C18 21.1046 17.1046 22 16 22H8C6.89543 22 6 21.1046 6 20V6C6 4.89543 6.89543 4 8 4H9Z"
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
					:style="{ transform: 'scaleY(' + value + ')' }"
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
