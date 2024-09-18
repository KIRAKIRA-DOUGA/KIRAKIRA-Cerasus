<docs>
	# 颜色选取器
</docs>

<script lang="ts">
	import checkerboard from "workers/paint/checkerboard?url";
	if (environment.client)
		CSS.paintWorklet?.addModule(checkerboard);
</script>

<script setup lang="ts">
	const props = defineProps<{
		/** 是否允许带不透明度的颜色。 */
		enableAlpha?: boolean;
	}>();

	const color = defineModel<Color | UnwrapRef<Color>>({ required: true });
	const specificModel = defineModel<ColorModel>("model", { default: "hsl" });

	const main = ref<TwoD>([1, 1]);
	const smoothMain = useSmoothValue(main, 0.5);
	const auxiliary = ref(0);
	const opacity = ref(1);
	const model = ref(specificModel.value!);
	const values = ref<ThreeD>([255, 0, 0]);
	const hex = ref("FF0000");
	const hashHex = computed(() => color.value.hashHex);
	const partialColor = computed(() => {
		const { hsl, hsv } = color.value;
		// wo (w/o) is an abbr of "without".
		return {
			boxShadow: Color.fromHsv(hsv.h, hsv.s, hsv.v, 0.8).hashHex,
			h: Color.fromHsv(hsv.h, 100, 100).hashHex,
			woL: Color.fromHsl(hsl.h, hsl.s, 50).hashHex,
			woV: Color.fromHsv(hsv.h, hsv.s, 100).hashHex,
			l: Color.fromHsv(0, 0, hsl.l >= 50 ? 100 : 0, Math.abs(hsl.l - 50) / 50).hashHex,
			v: Color.fromHsv(0, 0, 0, 1 - hsv.v / 100).hashHex,
			woH: Color.fromHsv(0, 0, hsv.v, 1 - (hsv.s / 100 * hsv.v / 100) ** 0.5).hashHex,
			woA: Color.fromHsv(hsv.h, hsv.s, hsv.v, 1).hashHex,
		};
	});
	const isUpdating = reactive({}) as Record<ChangedParam, boolean>;
	const maxValue = computed<ThreeD>(() => model.value === "rgb" ? [255, 255, 255] : [359, 100, 100]);
	const getHexInvalidMessage = (hex: string) => !props.enableAlpha ?
		[3, 6].includes(hex.length) ? "" : "HEX颜色值的长度必须为3位数或6位数。" :
		[3, 4, 6, 8].includes(hex.length) ? "" : "HEX颜色值的长度必须为3位数、4位数、6位数或8位数。";
	const hexInvalidMessage = computed(() => getHexInvalidMessage(hex.value));
	const spectrums = computed({
		get: () => [...main.value, auxiliary.value, opacity.value] as FourD,
		set: value => {
			main.value = [value[0], value[1]];
			auxiliary.value = value[2];
			opacity.value = value[3];
		},
	});
	const darkThumb = computed(() => color.value.naturalLightness >= 0.7);

	const update = async () => {
		if (isUpdating.update) return;
		isUpdating.update = true;
		if (!isUpdating.hex)
			hex.value = color.value.hex;
		if (!isUpdating.values)
			if (model.value === "rgb") {
				const { r, g, b } = color.value.rgb;
				values.value = [r, g, b];
			} else if (model.value === "hsl") {
				const { h, s, l } = color.value.hsl;
				values.value = [h, s, l];
			} else if (model.value === "hsb") {
				const { h, s, b } = color.value.hsb;
				values.value = [h, s, b];
			}
		if (!isUpdating.spectrums)
			if (model.value === "rgb") {
				const { h, s, b, a } = color.value.hsb;
				spectrums.value = [s / 100, b / 100, h / 359, a];
			} else if (model.value === "hsl") {
				const { h, s, l, a } = color.value.hsl;
				spectrums.value = [h / 359, s / 100, l / 100, a];
			} else if (model.value === "hsb") {
				const { h, s, b, a } = color.value.hsb;
				spectrums.value = [h / 359, s / 100, b / 100, a];
			}
		await nextTick();
		isUpdating.update = false;
	};
	update();

	watch(hex, useChange("hex", hex => {
		if (getHexInvalidMessage(hex)) return;
		color.value.hex = hex;
		update();
	}));

	watch(values, useChange("values", values => {
		color.value[model.value] = values as never;
		update();
	}), { deep: true });

	watch(model, useChange("hex", model => {
		update();
		specificModel.value = model;
	}));

	watch(spectrums, useChange("spectrums", spectrums => {
		if (model.value === "rgb") {
			const [s, b, h, a] = spectrums;
			color.value.hsb = [h * 359, s * 100, b * 100, a];
		} else if (model.value === "hsl") {
			const [h, s, l, a] = spectrums;
			color.value.hsl = [h * 359, s * 100, l * 100, a];
		} else if (model.value === "hsb") {
			const [h, s, b, a] = spectrums;
			color.value.hsb = [h * 359, s * 100, b * 100, a];
		}
		update();
	}), { deep: true });

	watch(specificModel, specificModel => specificModel && (model.value = specificModel));

	/**
	 * 按下主要调节平面逻辑处理。
	 * @param e - 指针事件（包括鼠标和触摸）。
	 */
	function onPlaneDown(e: PointerEvent) {
		const plane = e.currentTarget as HTMLDivElement;
		const { left: x, width: xMax, top: y, height: yMax } = plane.getBoundingClientRect();
		const pointerMove = useDebounce((e: PointerEvent) => {
			const positionX = clamp(e.clientX - x, 0, xMax);
			const positionY = clamp(e.clientY - y, 0, yMax);
			const valueX = map(positionX, 0, xMax, 0, 1);
			const valueY = map(positionY, 0, yMax, 1, 0);
			main.value = [valueX, valueY];
		});
		const pointerUp = () => {
			document.removeEventListener("pointermove", pointerMove);
			document.removeEventListener("pointerup", pointerUp);
		};
		document.addEventListener("pointermove", pointerMove);
		document.addEventListener("pointerup", pointerUp);
		pointerMove(e);
	}

	type ChangedParam = "hex" | "values" | "spectrums" | "update";

	/**
	 * 监测要不改变的参数。
	 * @param param - 要改变的参数名称。
	 * @param callback - 回调函数。
	 * @returns 产生的 watch 回调函数。
	 */
	function useChange<T>(param: ChangedParam, callback: (current: T, previous: T) => void) {
		return async (current: T, previous: T) => {
			if (isUpdating.update) return;
			isUpdating[param] = true;
			callback(current, previous);
			await nextTick();
			isUpdating[param] = false;
		};
	}

	// TODO: 方形区域滑块在外面，但滑轨区域滑块又在里面，很丑，需要统一样式。
</script>

<template>
	<div class="title">
		<slot name="navigation-back"></slot>
		<Subheader icon="palette">{{ t.color_picker }}</Subheader>
	</div>
	<Comp
		:class="{
			'dark-thumb': darkThumb,
		}"
		:style="{
			'--color': hashHex,
			'--box-shadow': partialColor.boxShadow,
			'--h': partialColor.h,
			'--wo-l': partialColor.woL,
			'--wo-v': partialColor.woV,
			'--l': partialColor.l,
			'--v': partialColor.v,
			'--wo-h': partialColor.woH,
			'--wo-a': partialColor.woA,
		}"
	>
		<div class="plane color" @pointerdown="onPlaneDown">
			<div v-if="model === 'rgb'" class="spectrum rgb">
				<div class="solid"></div>
				<div class="cover black"></div>
			</div>
			<div v-else-if="model === 'hsl'" class="spectrum hsl">
				<div class="hue"></div>
				<div class="cover gray"></div>
				<div class="mask"></div>
			</div>
			<div v-else-if="model === 'hsb'" class="spectrum hsb">
				<div class="hue"></div>
				<div class="cover white"></div>
				<div class="mask"></div>
			</div>
			<div class="thumb" :style="{ '--x': smoothMain[0], '--y': 1 - smoothMain[1] }"></div>
		</div>
		<Slider v-model="auxiliary" class="auxiliary" :min="0" :max="1" :class="[model]" />
		<Slider v-if="enableAlpha" v-model="opacity" class="opacity" :min="0" :max="1" />
		<div class="controls">
			<Segmented v-model="model">
				<SegmentedItem id="rgb">RGB</SegmentedItem>
				<SegmentedItem id="hsl">HSL</SegmentedItem>
				<SegmentedItem id="hsb">HSB</SegmentedItem>
			</Segmented>
			<TextBox
				v-model="values[0]"
				type="number"
				required
				preventIfInvalid
				hideClearAll
				:min="0"
				:max="maxValue[0]"
				:step="1"
			/>
			<TextBox
				v-model="values[1]"
				type="number"
				required
				preventIfInvalid
				hideClearAll
				:min="0"
				:max="maxValue[1]"
				:step="1"
			/>
			<TextBox
				v-model="values[2]"
				type="number"
				required
				preventIfInvalid
				hideClearAll
				:min="0"
				:max="maxValue[2]"
				:step="1"
			/>
			<div class="view-color color">
				<div class="checkerboard"></div>
				<div class="solid"></div>
				<div class="stroke"></div>
			</div>
			<TextBox
				v-model="hex"
				class="hex"
				prefix="#"
				preventIfInvalid
				required
				:pattern="!enableAlpha ? /[0-9A-Fa-f]{0,6}/ : /[0-9A-Fa-f]{0,8}/"
				:invalid="hexInvalidMessage"
				case="uppercase"
			/>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	$thumb-size: 24px;
	$thumb-size-half: calc($thumb-size / 2);

	.title {
		display: flex;
		gap: 2px;
		align-items: center;

		.subheader {
			flex-shrink: 0;
		}
	}

	%inner-stroke {
		@include color-palette-stroke;
		content: "";
		position: absolute;
		inset: 0;
		border-radius: inherit;
	}

	.plane {
		position: relative;
		aspect-ratio: 1 / 1;
		margin: $thumb-size-half 0;
		cursor: pointer;
		touch-action: pinch-zoom;

		&::after {
			@extend %inner-stroke;
		}

		> .spectrum {
			display: contents;
			pointer-events: none;

			> * {
				position: absolute;
				inset: 0;
				border-radius: 8px; // 与下方滑动条的圆角大小一致，因此使用特殊值。
			}
		}

		.rgb .solid {
			background: linear-gradient(to right, white, var(--h));
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

		.mask {
			transition: none;
		}

		.hsb .mask {
			background-color: var(--v);
		}

		.hsl .mask {
			background-color: var(--l);
		}
	}

	.slider {
		margin-bottom: 0;

		&:last-of-type {
			margin-bottom: 16px;
		}
	}

	.slider:deep() {
		--size: large;

		.passed {
			display: none;
		}

		.base {
			position: relative;
			overflow: clip;

			&::after {
				@extend %inner-stroke;
			}
		}
	}

	@function slider-model($model) {
		@return ".slider.auxiliary.#{$model}:deep() .base";
	}

	#{slider-model(rgb)} {
		background: $hue-linear;

		&::before {
			content: "";
			position: absolute;
			inset: 0;
			background-color: var(--wo-h);
			transition: none;
		}
	}

	#{slider-model(hsl)} {
		background: linear-gradient(to right, black, var(--wo-l), white);
	}

	#{slider-model(hsb)} {
		background: linear-gradient(to right, black, var(--wo-v));
	}

	.slider.opacity:deep() .base,
	.checkerboard {
		$color: c(gray-40);
		--checkerboard-size: 8px;
		--checkerboard-color-odd: #{$color};
		--checkerboard-color-even: transparent;
		background: paint(checkerboard);

		@supports (not (background: paint(id))) {
			background:
				linear-gradient(-45deg, $color 25%, transparent 0),
				linear-gradient(-45deg, transparent 75%, $color 0),
				linear-gradient(-45deg, $color 25%, transparent 0),
				linear-gradient(-45deg, transparent 75%, $color 0);
			background-position: 0 0, 8px 8px, 8px 8px, 16px 16px;
			background-size: 16px 16px;
		}
	}

	.slider.opacity:deep() .base::before {
		content: "";
		position: absolute;
		inset: 0;
		background: linear-gradient(to right, transparent, var(--wo-a));
		transition: none;
	}

	.controls {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
		width: 100%;
		margin-bottom: 4px;

		.segmented {
			grid-column-end: span 3;
			width: 100%;
		}

		.text-box.hex {
			grid-column-end: span 2;
		}
	}

	.view-color {
		position: relative;
		overflow: clip;

		* {
			position: absolute;
			inset: 0;
			border-radius: inherit;
			transition: none;
		}

		.stroke {
			@include color-palette-stroke;
		}

		.solid {
			background-color: var(--color);
		}
	}

	.color {
		@include round-large;
	}

	.slider:deep() .thumb,
	.plane .thumb {
		z-index: 1;
		background-color: white;
		box-shadow: 0 1px 6px var(--box-shadow) !important;
		transition: $fallback-transitions, left 0s, top 0s, box-shadow 0s;

		:comp.dark-thumb & {
			background-color: black;
		}

		&::after {
			background-color: var(--color) !important;
			transition: $fallback-transitions, scale $ease-out-back 250ms, background-color 0s;
		}
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

		&::after {
			@include square(100%);
			@include circle;
			content: "";
			display: block;
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
