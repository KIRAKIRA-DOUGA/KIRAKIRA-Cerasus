<script setup lang="ts">
	const main = ref<TwoD>([1, 0]);
	const smoothMain = useSmoothValue(main, 0.5);
	const auxiliary = ref(0);
	const model = ref<"rgb" | "hsl" | "hsb">("rgb");
	const values = ref<ThreeD>([255, 0, 0]);
	const color = reactive(Color.fromHex("ff0000")) as Color;
	// const hex = computed({ get: () => color.hex.slice(0, 6), set: v => color.hex = v });
	const hex = ref("ff0000");
	const hashHex = computed(() => "#" + hex.value);
	const boxShadowColor = computed(() => hashHex.value + "cc");
	const hueColor = computed(() => Color.fromHsv(color.hsv.h, 100, 100).hashHex);

	const isUpdatingHex = ref(false);
	const isUpdatingValues = ref(false);

	const setHex = () => { if (!isUpdatingHex.value) hex.value = color.hex.slice(0, 6); };
	const setValues = () => {
		if (!isUpdatingValues.value)
			if (model.value === "rgb") {
				const { r, g, b } = color.rgb;
				values.value = [r, g, b];
			} else if (model.value === "hsl") {
				const { h, s, l } = color.hsl;
				values.value = [h, s, l];
			} else if (model.value === "hsb") {
				const { h, s, b } = color.hsb;
				values.value = [h, s, b];
			}
	};

	watch(hex, async hex => {
		isUpdatingHex.value = true;
		color.hex = hex;
		setValues();
		await nextTick();
		isUpdatingHex.value = false;
	});

	watch(values, async values => {
		isUpdatingValues.value = true;
		color[model.value] = values as never;
		if (!isUpdatingHex.value) setHex();
		await nextTick();
		isUpdatingValues.value = false;
	}, { deep: true });

	watch(model, async _model => {
		isUpdatingHex.value = true;
		setValues();
		await nextTick();
		isUpdatingHex.value = false;
	}, { deep: true });

	/**
	 * 按下主要调节平面逻辑处理。
	 * @param e - 指针事件（包括鼠标和触摸）。
	 */
	function onPlaneDown(e: PointerEvent) {
		const plane = e.currentTarget as HTMLDivElement;
		const { left: x, width: xMax, top: y, height: yMax } = plane.getBoundingClientRect();
		const pointerMove = (e: PointerEvent) => {
			const positionX = clamp(e.clientX - x, 0, xMax);
			const positionY = clamp(e.clientY - y, 0, yMax);
			const valueX = map(positionX, 0, xMax, 0, 1);
			const valueY = map(positionY, 0, yMax, 0, 1);
			main.value = [valueX, valueY];
		};
		const pointerUp = () => {
			document.removeEventListener("pointermove", pointerMove);
			document.removeEventListener("pointerup", pointerUp);
		};
		document.addEventListener("pointermove", pointerMove);
		document.addEventListener("pointerup", pointerUp);
		pointerMove(e);
	}
</script>

<template>
	<Subheader icon="palette">调色板</Subheader>
	<Comp
		:style="{
			'--color': hashHex,
			'--box-shadow-color': boxShadowColor,
			'--hue': hueColor,
		}"
	>
		<div class="plane color" @pointerdown="onPlaneDown">
			<div v-if="model === 'rgb'" class="preview rgb">
				<div class="solid"></div>
				<div class="cover black"></div>
			</div>
			<div v-else-if="model === 'hsl'" class="preview hsl">
				<div class="hue"></div>
				<div class="cover gray"></div>
			</div>
			<div v-else-if="model === 'hsb'" class="preview hsb">
				<div class="hue"></div>
				<div class="cover white"></div>
			</div>
			<div class="thumb" :style="{ '--x': smoothMain[0], '--y': smoothMain[1] }"></div>
		</div>
		<Slider v-model="auxiliary" :min="0" :max="1" :class="[model]" />
		<div class="controls">
			<Segmented v-model="model">
				<SegmentedItem id="rgb">RGB</SegmentedItem>
				<SegmentedItem id="hsl">HSL</SegmentedItem>
				<SegmentedItem id="hsb">HSB</SegmentedItem>
			</Segmented>
			<TextBox v-model="values[0]" />
			<TextBox v-model="values[1]" />
			<TextBox v-model="values[2]" />
			<div class="view-color color"></div>
			<TextBox v-model="hex" class="hex" prefix="#" />
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	$thumb-size: 24px;

	.subheader {
		margin-bottom: 16px;
	}
	
	:comp > :not(:last-child) {
		margin-bottom: 16px;
	}
	
	.plane {
		position: relative;
		margin: 0 12px;
		aspect-ratio: 1 / 1;
		cursor: pointer;
		
		> .preview {
			display: contents;
			pointer-events: none;
			
			> * {
				position: absolute;
				border-radius: 8px; // 与下方滑动条的圆角大小一致，因此使用特殊值。
				inset: 0;
			}
		}
		
		.rgb .solid {
			background: linear-gradient(to right, white, var(--hue));
		}
		
		.hue {
			background: $hue-linear;
		}
		
		.cover {
			// stylelint-disable-next-line function-disallowed-list
			background: linear-gradient(to top, rgb(var(--rgb)), rgb(var(--rgb) / 0%));
			
			&.black {
				--rgb: 0 0 0;
			}
			
			&.gray {
				--rgb: 127 127 127;
			}
			
			&.white {
				--rgb: 255 255 255;
			}
		}
	}
	
	.slider:deep {
		--size: large;
		margin-top: 16px;
		
		.passed {
			display: none;
		}
		
		.thumb {
			box-shadow: 0 1px 6px var(--box-shadow-color) !important;
			
			&::after {
				background-color: var(--color);
			}
		}
	}
	
	@function slider-model($model) {
		@return ".slider.#{$model}:deep .track";
	}
	
	#{slider-model(rgb)} {
		background: $hue-linear;
	}
	
	#{slider-model(hsl)} {
		background: linear-gradient(to right, black, var(--hue), white);
	}
	
	#{slider-model(hsb)} {
		background: linear-gradient(to right, black, var(--hue));
	}
	
	.controls {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px 6px;
		width: 100%;
		margin-bottom: 4px;
		padding: 0 12px;
		
		.segmented {
			grid-column-end: span 3;
			width: 100%;
		}
		
		.text-box.hex {
			grid-column-end: span 2;
		}
	}
	
	.view-color {
		@include color-palette-stroke;
		background-color: var(--color);
	}
	
	.color {
		@include round-large;
	}
	
	.thumb {
		@include square($thumb-size);
		@include circle;
		@include flex-center;
		@include control-ball-shadow;
		position: absolute;
		top: calc(var(--y) * 100% - $thumb-size / 2);
		left: calc(var(--x) * 100% - $thumb-size / 2);;
		background-color: c(main-bg);
		cursor: pointer;
		transition: $fallback-transitions, left 0s, top 0s;
		
		&::after {
			@include square(100%);
			@include circle;
			display: block;
			background-color: var(--color);
			transition: $fallback-transitions;
			content: "";
			scale: 0.625;
		}
		
		&:any-hover::after {
			scale: 0.765;
		}
		
		.plane:active &::after,
		&:active::after {
			scale: 0.4 !important;
		}
	}
</style>
